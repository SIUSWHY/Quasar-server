import { model, Schema } from 'mongoose';
import { UserType } from '../types/userType';

const UserSchema = new Schema<UserType>({
  name: String,
  password: String,
  email: String,
  avatar: {},
  phone: String,
});

export default model<UserType>('Users', UserSchema);
