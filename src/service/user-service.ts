import User from '../entity/mongodb/user'
import { getConnection } from 'typeorm'
import { ObjectID } from 'mongodb'
import E from '../error/ErrorEnum'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import config from '../config'

interface UserService {
  login(user: User): Promise<string>

  register(user: User): Promise<void>

  update(uid: string, user: User): Promise<void>

  delete(uid: String): Promise<void>

  getByUid(uid: String): Promise<User>

  getUserList(limit: string, offset: string): Promise<User[]>
}

export default class UserServiceImpl implements UserService {
  private readonly userRepository = getConnection('mongodb').getMongoRepository(User)

  async login (user: User): Promise<string> {
    const result = await this.userRepository.findOne({
      email: user.email
    })
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (result !== undefined && await bcrypt.compare(user.password, result.password)) {
      // !permanent valid
      return jwt.sign({
        uid: result._id,
        name: result.name,
        desc: result.desc,
        avatar: result.avatar
      }, config.jwtSecret)
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
    user.password = await bcrypt.hash(user.password, 10)
    await this.userRepository.insertOne(user)
  }

  async update (uid: string, user: User): Promise<void> {
    await this.userRepository.updateOne({ _id: ObjectID(uid) }, {
      $set: user
    })
  }

  async delete (uid: String): Promise<void> {
    await this.userRepository.deleteOne({
      _id: ObjectID(uid)
    })
  }

  async getByUid (uid: String): Promise<User> {
    return await this.userRepository.findOne({
      _id: ObjectID(uid)
    })
  }

  // for test
  async getByName (user: User): Promise<User> {
    return await this.userRepository.findOne({
      name: user.name
    })
  }

  async getUserList (limit: string = '8', offset: string = '0'): Promise<User[]> {
    return await this.userRepository.find({
      take: parseInt(limit),
      skip: parseInt(offset)
    })
  }
}
