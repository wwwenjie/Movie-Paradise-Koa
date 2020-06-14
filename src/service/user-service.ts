import User from '../entity/mongodb/user'
import { getConnection } from 'typeorm'
import { ObjectID } from 'mongodb'
import E from '../error/ErrorEnum'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import config from '../config'
import OSS from '../util/oss'
import * as fs from 'fs'

interface UserService {
  login(user: User): Promise<User>

  register(user: User): Promise<void>

  update(uid: string, user: User): Promise<void>

  delete(uid: String): Promise<void>

  uploadAvatar(file: File): Promise<string>

  getByUid(uid: String): Promise<User>

  getUserList(limit: string, offset: string): Promise<User[]>
}

export default class UserServiceImpl implements UserService {
  private readonly userRepository = getConnection('mongodb').getMongoRepository(User)

  async login (user: User): Promise<User> {
    const result = await this.userRepository.findOne({
      email: user.email
    })
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (result !== undefined && await bcrypt.compare(user.password, result.password)) {
      // !permanent valid
      const token = jwt.sign({
        uid: result._id
      },
      config.jwtSecret,
      {
        issuer: 'https://github.com/wwwenjie/Movie-Paradise'
      })
      delete result.password
      // @ts-ignore
      result.token = token
      return result
    } else {
      throw E.AccountWrong
    }
  }

  async register (user: User): Promise<void> {
    await this.checkIndex(user)
    user.create_time = new Date()
    user.password = await bcrypt.hash(user.password, 10)
    await this.userRepository.insertOne(user)
  }

  async update (uid: string, user: User): Promise<void> {
    if (user.email !== undefined || user.name !== undefined) {
      await this.checkIndex(user)
    }
    // check currentPassword
    if (user.email !== undefined || user.password !== undefined) {
      const res = await this.userRepository.findOne({
        _id: ObjectID(uid)
      })
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!await bcrypt.compare(user.currentPassword, res.password)) {
        throw E.AccountWrong
      }
      if (user.password !== undefined) {
        user.password = await bcrypt.hash(user.password, 10)
      }
    }
    // @ts-ignore
    delete user.currentPassword
    await this.userRepository.updateOne({ _id: ObjectID(uid) }, {
      $set: user
    })
  }

  async delete (uid: String): Promise<void> {
    await this.userRepository.deleteOne({
      _id: ObjectID(uid)
    })
  }

  async uploadAvatar (file: File): Promise<string> {
    // @ts-ignore
    const path: string = file.path
    const res = await OSS.putAvatar(file.name, path)
    const user = new User()
    user.avatar = res.url
    await this.update(file.name, user)
    fs.unlink(path, (err) => {
      console.log(err)
    })
    return res.url
  }

  async getByUid (uid: String): Promise<User> {
    const user = await this.userRepository.findOne({
      _id: ObjectID(uid)
    })
    // Obviously, findOne does not provide a exclusion option
    delete user.email
    delete user.password
    return user
  }

  async getUserList (limit: string = '8', offset: string = '0'): Promise<User[]> {
    return await this.userRepository.find({
      take: parseInt(limit),
      skip: parseInt(offset)
    })
  }

  async checkIndex (user): Promise<void> {
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
  }
}
