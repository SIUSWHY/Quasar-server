import { model, Schema } from 'mongoose';
import { UserType } from '../types/userType';

const UserSchema = new Schema<UserType>({
  name: String,
  password: String,
  email: String,
  avatar: String,
  phone: String,
  isDarkMode: { default: true, type: Boolean },
  teams: [],
});

export default model<UserType>('Users', UserSchema);
