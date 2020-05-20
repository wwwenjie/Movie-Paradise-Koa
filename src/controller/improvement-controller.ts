import ImprovementServiceImpl from '../service/improvement-service'
import { body, prefix, request, responses, summary, tagsAll } from 'koa-swagger-decorator/dist'
import { movieProperties } from './swagger-definition'

const improvementService = new ImprovementServiceImpl()

@tagsAll('Improvement Controller')
@prefix('/movies')
export default class ImprovementController {
  @request('patch', '/poster')
  @summary('add poster to ali oss')
  @body({
    id: movieProperties._id
  })
  static async patchPoster (ctx): Promise<void> {
    const { id } = ctx.request.body
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    improvementService.patchPoster(id)
    ctx.body = { msg: 'Thanks for support' }
  }

  @request('patch', '/trailers')
  @summary('patch trailers to database')
  @body({
    id: movieProperties._id,
    trailers: movieProperties.trailers
  })
  static async patchTrailers (ctx): Promise<void> {
    const { id, trailers } = ctx.request.body
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    improvementService.patchTrailers(id, trailers)
    ctx.body = { msg: 'Thanks for support' }
  }

  @request('patch', '/backdrops')
  @summary('patch backdrops to database')
  @body({
    id: movieProperties._id,
    backdrops: movieProperties.backdrops
  })
  static async patchBackdrops (ctx): Promise<void> {
    const { id, backdrops } = ctx.request.body
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    improvementService.patchBackdrops(id, backdrops)
    ctx.body = { msg: 'Thanks for support' }
  }
}
