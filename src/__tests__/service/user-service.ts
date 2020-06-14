import UserServiceImpl from '../../service/user-service'
import InitManager from '../../core/init'
import User from '../../entity/mongodb/user'
import E from '../../error/ErrorEnum'

test('user service', async () => {
  await InitManager.initLoadDatabase()
  const userService = new UserServiceImpl()
  const user = new User()
  user.name = new Date().getTime().toString()
  user.email = new Date().getTime().toString()
  user.password = 'test'
  await userService.register(user)
  // change password to original, register will encrypt password
  user.password = 'test'
  try {
    await userService.register(user)
  } catch (e) {
    expect(e).toBe(E.NameExist)
  }
  user.name = new Date().getTime().toString()
  try {
    await userService.register(user)
  } catch (e) {
    expect(e).toBe(E.EmailExist)
  }
  const res = await userService.login(user)
  const uid = res._id.toString()
  // @ts-ignore
  user.currentPassword = user.password
  user.email = new Date().getTime().toString()
  await userService.update(uid, user)
  const updatedUser = await userService.getByUid(uid)
  expect(updatedUser.name).toStrictEqual(user.name)
  await userService.delete(uid)
})
