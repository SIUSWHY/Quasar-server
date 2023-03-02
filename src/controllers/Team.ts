import Team from '../models/modelTeam';
import User from '../models/modelUser';
import fs from 'fs';
import { logger } from '../helpers/logger';
import { s3 } from '../helpers/storage';

const createTeam = async function (req: any, res: any) {
  const data: { name: string; link: string; userId: string } = req.body;

  try {
    const img = fs.readFileSync(req.file!.path);
    const team = await Team.findOne({ teamName: data.name });

    if (Boolean(team)) {
      res.status(409).send({ message: 'This team name already exists', type: 'warning' });
    } else {
      const upload = await s3.Upload(
        {
          buffer: img,
        },
        '/teams/'
      );

      const newTeam = await Team.create({
        admin: data.userId,
        inviteLink: 'https://hermes-server.online/' + data.name.toLowerCase(),
        members: [data.userId.toString()],
        teamLogo: upload.Location,
        teamName: data.name,
      });

      await User.findByIdAndUpdate(
        { _id: data.userId },
        { $push: { teams: newTeam._id.toString() }, $set: { defaultTeam: newTeam._id } }
      );

      return res.status(200).send({ message: 'Team is created', newTeam });
    }
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

const joinToTeam = async function (req: any, res: any) {
  const { link, _id }: { _id: string; link: string } = req.body;

  try {
    const team = await Team.findOne({ inviteLink: link });
    const user = await User.findById(_id);

    if (!Boolean(user.defaultTeam)) {
      await User.findByIdAndUpdate(
        { _id },
        { $push: { teams: team._id.toString() }, $set: { defaultTeam: team._id.toString() } }
      );
    } else {
      await User.findByIdAndUpdate({ _id }, { $push: { teams: team._id.toString() } });
    }

    const newTeam = await Team.findByIdAndUpdate(
      { _id: team._id },
      { $push: { members: user._id.toString() } },
      { new: true }
    );

    logger.log({
      level: 'info',
      message: `User ${user.name}:[_id:${user._id}] is connect to ${team.teamName}`,
    });

    return res.status(200).send({ message: 'User is connected', newTeam });
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

const getTeams = async function (req: any, res: any) {
  const { ids }: { ids: string[] } = req.body;

  try {
    const arrTeams = await Promise.all(
      ids.map(async (_id: string) => {
        return await Team.findById(_id);
      })
    );

    return res.status(200).send(arrTeams);
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

export { createTeam, joinToTeam, getTeams };
