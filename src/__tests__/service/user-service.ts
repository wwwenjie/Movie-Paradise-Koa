import UserServiceImpl from '../../service/user-service'
import InitManager from '../../core/init'
import User from '../../entity/mongodb/user'
import E from '../../error/ErrorEnum'

test('user service', async () => {
  await InitManager.initLoadDatabase()
  const userService = new UserServiceImpl()
  const user = new User()
  const password = 'test1234'
  user.name = new Date().getTime().toString()
  user.email = new Date().getTime().toString() + '@test.com'
  user.password = password
  await userService.register(user)
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
  user.password = password
  const res = await userService.login(user)
  const uid = res._id.toString()
  // @ts-expect-error
  user.currentPassword = password
  user.email = new Date().getTime().toString() + '@test.com'
  await userService.update(uid, user)
  const updatedUser = await userService.getByUid(uid)
  expect(updatedUser.name).toStrictEqual(user.name)
  await userService.delete(uid, password)
})
