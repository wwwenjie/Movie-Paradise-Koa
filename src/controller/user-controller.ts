import UserServiceImpl from '../service/user-service'
import { prefix, request, responses, summary, tagsAll } from 'koa-swagger-decorator/dist'

const userService = new UserServiceImpl()

@tagsAll('User Controller')
@prefix('/users')
export default class UserController {
  @request('post', '/tokens')
  @summary('user login')
  @responses({ 200: { description: 'token' } })
  static async login (ctx): Promise<void> {
    ctx.body = await userService.login(ctx.request.body)
  }

  @request('post', '')
  @summary('user register')
  static async register (ctx): Promise<void> {
    ctx.body = await userService.register(ctx.request.body)
  }
}
