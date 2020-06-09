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
  await userService.register(user)
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
  const loginResult = await userService.login(user)
  user._id = loginResult.uid
  await userService.update(user)
  const updatedUser = await userService.getByUid(user._id.toString())
  expect(updatedUser.name).toStrictEqual(user.name)
  await userService.delete(loginResult.uid)
})
