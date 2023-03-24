import Team from '../models/modelTeam';
import User from '../models/modelUser';
import Room from '../models/modelRoom';
import Message from '../models/modelMessage';
import fs from 'fs';
import { logger } from '../helpers/logger';
import { s3 } from '../helpers/storage';
import { TeamType } from '../types/teamType';
import { UserType } from '../types/userType';
import { RoomType } from '../types/roomType';

const s3_team_url = 'https://quasar-storage.storage.yandexcloud.net/teams/';
const s3_room_url = 'https://quasar-storage.storage.yandexcloud.net/avatars/';

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
        inviteLink: 'h.me/hermes-server.online/' + data.name.toLowerCase(),
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
      ids.map((_id: string) => {
        return Team.findById(_id);
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

const changeTeamAvatar = async function (req: any, res: any) {
  const { _id }: { _id: string } = req.body;

  const team: TeamType = await Team.findById({ _id });

  if (Boolean(team)) {
    try {
      const img = fs.readFileSync(req.file!.path);

      const upload = await s3.Upload(
        {
          buffer: img,
        },
        '/teams/'
      );

      await s3.Remove('teams/' + team.teamLogo.replace(s3_team_url, ''));

      const patchTeam = await Team.findByIdAndUpdate({ _id }, { teamLogo: upload.Location }, { new: true });

      logger.log({
        level: 'info',
        message: `Change team avatar`,
      });

      res.status(200).send(patchTeam);
    } catch (err) {
      logger.log({
        level: 'error',
        message: err,
      });
    }
  }
};

const changeTeamName = async function (req: any, res: any) {
  const { _id, name } = req.body;

  try {
    const team = await Team.findByIdAndUpdate(
      { _id },
      { teamName: name, inviteLink: 'h.me/hermes-server.online/' + name.toLowerCase() },
      { new: true }
    );

    return res.status(200).send(team);
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

const deleteUserFromTeam = async function (req: any, res: any) {
  const { _id, teamId }: { _id: string; teamId: string } = req.body;

  try {
    const user = await User.findById({ _id });
    const userWithoutTeam = user.teams.filter(elem => elem !== teamId);

    if (user.defaultTeam === teamId) {
      await User.findByIdAndUpdate({ _id }, { defaultTeam: '', teams: userWithoutTeam });
    } else {
      await User.findByIdAndUpdate({ _id }, { teams: userWithoutTeam });
    }

    const team = await Team.findById({ _id: teamId });
    const newMembers = team.members.filter(elem => elem !== _id);

    await Team.findByIdAndUpdate({ _id: teamId }, { members: newMembers }, { new: true });

    return res.status(200).send({ message: 'User is deleted' });
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

const deleteTeam = async function (req: any, res: any) {
  const { teamId }: { teamId: string } = req.body;

  try {
    const team = await Team.findById({ _id: teamId });
    const users: UserType[] = await Promise.all(
      team.members.map((_id: string) => {
        return User.findById({ _id });
      })
    );

    await Promise.all(
      users.map(async elem => {
        const user = await User.findById({ _id: elem._id });

        if (user.defaultTeam === teamId) {
          if (user.teams.length > 1) {
            const teamList = user.teams.filter(id => id !== teamId);
            await User.findByIdAndUpdate({ _id: elem._id }, { defaultTeam: teamList.pop(), teams: teamList });
          } else {
            await User.findByIdAndUpdate({ _id: elem._id }, { defaultTeam: '', teams: [] });
          }
        } else {
          const teamList = user.teams.filter(id => id !== teamId);
          await User.findByIdAndUpdate({ _id: elem._id }, { teams: teamList });
        }
      })
    );

    const rooms: RoomType[] = await Room.find({ teamId });
    await Promise.all(
      rooms.map(async room => {
        await Message.deleteMany({ roomId: room.roomId });

        await s3.Remove('avatars/' + room.room_img.replace(s3_room_url, ''));
        await Room.deleteOne({ roomId: room.roomId });
      })
    );

    await s3.Remove('teams/' + team.teamLogo.replace(s3_team_url, ''));
    await Team.deleteOne({ _id: teamId });

    logger.log({
      level: 'info',
      message: `Delete team`,
    });

    return res.status(200).send({ message: 'Team is deleted' });
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

export { createTeam, joinToTeam, getTeams, changeTeamAvatar, changeTeamName, deleteUserFromTeam, deleteTeam };
