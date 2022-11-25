export interface UserType {
  _id?: string;
  name: string;
  password: string;
  email: string;
  phone: string;
  avatar: {
    name: string;
    desc: string;
    img: { data: Buffer; contentType: String };
  };
}
