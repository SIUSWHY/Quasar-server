import { ObjectId } from 'mongoose';
import Users from '../models/modelUser';
import { UserType } from '../types/userType';

const user = async function (req: any, res: any) {
  const userId: ObjectId = req.body._id;
  const User: UserType | null = await Users.findOne({ _id: userId });

  res.json(User);
};

const allUsers = async function (req: any, res: any) {
  const { _id } = req.data;
  const { teamId }: { teamId: string } = req.body;

  const arrUser: UserType[] = await Users.find({
    _id: { $ne: _id },
  });

  const teamUser = arrUser.map(user => {
    if (user.teams.includes(teamId)) {
      return user;
    }
  });

  res.json(teamUser);
};

const currentUser = async function (req: any, res: any) {
  const { _id } = req.data;
  const CurrentUser = await Users.findOne({
    _id: _id,
  });

  res.json(CurrentUser);
};

const companion = async function (req: any, res: any) {
  const companionUserData = req.body;
  const Companion = await Users.findOne(companionUserData);

  res.json(Companion);
};

export { user, allUsers, currentUser, companion };
