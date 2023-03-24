export interface UserType {
  _id?: string;
  name: string;
  password: string;
  email: string;
  phone: string;
  avatar: string;
  isDarkMode: boolean;
  defaultTeam: string;
  teams: string[];
  locale:string
}
