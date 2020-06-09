import User from '../entity/mongodb/user'
import { getConnection, ObjectID } from 'typeorm'
import E from '../error/ErrorEnum'

interface UserService {
  login(user: User): Promise<{ uid: ObjectID, token: string }>

  register(user: User): Promise<void>

  update(user: User): Promise<void>

  delete(uid: ObjectID): Promise<void>

  findByUid(uid: ObjectID): Promise<User>
}

export default class UserServiceImpl implements UserService {
  private readonly userRepository = getConnection('mongodb').getMongoRepository(User)

  async login (user: User): Promise<{ uid: ObjectID, token: string }> {
    const result = await this.userRepository.findOne({
      email: user.email,
      password: user.password
    })
    if (result !== undefined) {
      return { uid: result._id, token: 'token' }
    } else {
      throw E.AccountWrong
    }
  }

  async register (user: User): Promise<void> {
    if (await this.userRepository.findOne({
      name: user.name
    }) !== undefined) {
      throw E.NameExist
    }
    if (await this.userRepository.findOne({
      email: user.email
    }) !== undefined) {
      throw E.EmailExist
    }
    user.create_time = new Date()
    await this.userRepository.insertOne(user)
  }

  async update (user: User): Promise<void> {
    await this.userRepository.save(user)
  }

  async delete (uid: ObjectID): Promise<void> {
    await this.userRepository.deleteOne({
      _id: uid
    })
  }

  async findByUid (uid: ObjectID): Promise<User> {
    return await this.userRepository.findOne({
      _id: uid
    })
  }
}
