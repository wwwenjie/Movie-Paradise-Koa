import UserServiceImpl from '../service/user-service'
import { body, path, prefix, query, request, responses, summary, tagsAll } from 'koa-swagger-decorator/dist'

const userService = new UserServiceImpl()

@tagsAll('User Controller')
@prefix('/users')
export default class UserController {
  @request('post', '/tokens')
  @summary('user login')
  @body({
    email: { type: 'string', example: 'admin' },
    password: { type: 'string', example: 'admin' }
  })
  @responses({
    200: {
      description: 'uid and token',
      schema: {
        type: 'object',
        properties: {
          uid: { type: 'string', example: '5edf5ade1c0ca52410508138' },
          token: { type: 'string', example: 'eyJpc3MiOiJKb2huI.eyJpc3MiOiJ.Kb2huIFd1IEp' }
        }
      }
    }
  })
  static async login (ctx): Promise<void> {
    ctx.body = await userService.login(ctx.request.body)
  }

  @request('post', '')
  @summary('user register')
  @body({
    name: { type: 'string', example: 'admin' },
    email: { type: 'string', example: 'admin' },
    password: { type: 'string', example: 'admin' }
  })
  static async register (ctx): Promise<void> {
    ctx.body = await userService.register(ctx.request.body)
  }

  @request('put', '/{uid}')
  @summary('update user')
  @path({
    uid: { type: 'string', required: true, description: 'user id' }
  })
  static async update (ctx): Promise<void> {
    ctx.body = await userService.update(ctx.request.body)
  }

  @request('delete', '/{uid}')
  @summary('delete user')
  @path({
    uid: { type: 'string', required: true, description: 'user id' }
  })
  static async delete (ctx): Promise<void> {
    ctx.body = await userService.delete(ctx.params.uid)
  }

  @request('get', '/{uid}')
  @summary('get user by user id')
  @path({
    uid: { type: 'string', required: true, description: 'user id' }
  })
  static async findByUid (ctx): Promise<void> {
    ctx.body = await userService.getByUid(ctx.params.uid)
  }

  @request('get', '')
  @summary('get user list (admin)')
  @query({
    limit: { type: 'number', default: 8 },
    offset: { type: 'number', default: 0 }
  })
  static async getUserList (ctx): Promise<void> {
    const { limit, offset } = ctx.query
    ctx.body = await userService.getUserList(limit, offset)
  }
}
