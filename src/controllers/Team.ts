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
        members: [data.userId],
        teamLogo: upload.Location,
        teamName: data.name,
      });

      await User.findByIdAndUpdate({ _id: data.userId }, { $push: { teams: newTeam._id } });

      return res.status(200).send({ message: 'Team is created', newTeam });
    }
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

export { createTeam };
