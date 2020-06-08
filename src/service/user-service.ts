import User from '../entity/mongodb/user'
import { getConnection } from 'typeorm'
import CError from '../error/CError'

const userRepository = getConnection('mongodb').getMongoRepository(User)

interface UserService {
  login(user: User): Promise<string>

  register(user: User): Promise<void>
}

export default class UserServiceImpl implements UserService {
  async login (user: User): Promise<string> {
    const result = await userRepository.findOne({
      email: user.email,
      password: user.password
    })
    if (result !== undefined) {
      return 'user token and uid'
    } else {
      throw new CError('email or password is wrong', 40001, 401)
    }
  }

  async register (user: User): Promise<void> {
    user.create_time = new Date()
    try {
      await userRepository.insert(user)
    } catch (e) {
      throw new CError('Email already used!', 40002, 401)
    }
  }
}
