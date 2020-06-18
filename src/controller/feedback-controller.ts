import { body, prefix, request, summary, tagsAll } from 'koa-swagger-decorator/dist'
import logger from '../core/log4js'

@tagsAll('Feedback Controller')
@prefix('/feedback')
export default class FeedbackController {
  @request('post', '')
  @summary('add feedback')
  @body({
    name: { type: 'string', example: 'admin' },
    email: { type: 'string', example: 'admin' },
    password: { type: 'string', example: 'admin' }
  })
  async addFeedback (ctx): Promise<void> {
    // todo: send email
    logger.info(ctx.request.body)
    ctx.status = 204
  }
}
