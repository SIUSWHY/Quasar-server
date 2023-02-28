import { model, Schema } from 'mongoose';
import { TeamType } from '../types/teamType';

const TeamSchema = new Schema<TeamType>({
  teamName: String,
  inviteLink: String,
  teamLogo: String,
  admin: String,
  members: [],
});

export default model<TeamType>('Team', TeamSchema);
