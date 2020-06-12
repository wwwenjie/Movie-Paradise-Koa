import UserServiceImpl from '../../service/user-service'
import InitManager from '../../core/init'
import User from '../../entity/mongodb/user'
import E from '../../error/ErrorEnum'

test('user service', async () => {
  await InitManager.initLoadDatabase()
  const userService = new UserServiceImpl()
  const user = new User()
  user.name = 'test'
  user.email = 'test'
  user.password = 'test'
  if (await userService.getByName(user) === undefined) {
    await userService.register(user)
    // change password to original, register will encrypt password
    user.password = 'test'
  }
  try {
    await userService.register(user)
  } catch (e) {
    expect(e).toBe(E.NameExist)
  }
  // also used when test update
  user.name = 'testName'
  try {
    await userService.register(user)
  } catch (e) {
    expect(e).toBe(E.EmailExist)
  }
  const token = await userService.login(user)
  const uid = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8')).uid
  await userService.update(uid, user)
  const updatedUser = await userService.getByUid(uid)
  expect(updatedUser.name).toStrictEqual(user.name)
  await userService.delete(uid)
})
