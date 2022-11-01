import { UserType } from '../../../types/userType'
import modelUser from '../../../models/modelUser'
import createToken from '../../../helpers/createToken'

async function loginUserByQr(data: { socketId: string; userData: UserType }) {
  const { phone, email } = data.userData
  const user: UserType = await modelUser.findOne({
    $or: [{ phone: phone }, { email: email }]
  })
  const { name, _id } = user

  const token = createToken({
    name,
    email,
    phone,
    _id
  })
  return token
}
export default loginUserByQr
