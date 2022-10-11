import { ObjectId } from 'mongoose'
import modelRoom from '../../../models/modelRoom'

async function createGroupRoom(data: {
  groupName: string
  groupImage: string
  groupMembers: ObjectId[]
  groupType: string
}) {
  const { groupName, groupImage, groupMembers, groupType } = data

  await modelRoom.create({
    roomId: `${Date.now()}`,
    chatType: groupType,
    users_id: groupMembers,
    room_img: groupImage,
    room_name: groupName
  })
}
export default createGroupRoom
