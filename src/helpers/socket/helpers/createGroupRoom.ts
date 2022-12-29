import { ObjectId } from 'mongoose';
import modelRoom from '../../../models/modelRoom';
import makeIdForRoom from './createIdString';

async function createGroupRoom(data: {
  groupName: string;
  groupImage: string;
  groupMembers: ObjectId[];
  groupType: string;
}) {
  const { groupName, groupImage, groupMembers, groupType } = data;

  await modelRoom.create({
    roomId: makeIdForRoom(20).toString(),
    chatType: groupType,
    users_id: groupMembers,
    room_img: groupImage,
    room_name: groupName,
  });
}
export default createGroupRoom;
