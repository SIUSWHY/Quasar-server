import { model, Schema } from 'mongoose'
import { UserType } from '../types/userType'

//ItemCard Schema
const UserSchema = new Schema<UserType>({
  name: String,
  password: String
})

export default model<UserType>('Users', UserSchema)
