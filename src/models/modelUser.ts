import { model, Schema } from 'mongoose'
import { UserType } from '../types/userType'

const UserSchema = new Schema<UserType>({
  _id: Schema.Types.ObjectId,
  name: String,
  password: String
})

export default model<UserType>('Users', UserSchema)
