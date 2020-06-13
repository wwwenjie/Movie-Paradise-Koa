import { body, prefix, query, request, responses, summary, tagsAll } from 'koa-swagger-decorator/dist'
import { commentArraySchema, commentProperties } from './swagger-definition'
import CommentServiceImpl from '../service/comment-serviece'
import E from '../error/ErrorEnum'

const commentService = new CommentServiceImpl()

@tagsAll('Comment Controller')
@prefix('/comments')
export default class GenreController {
  @request('get', '')
  @query({
    movieId: { type: 'number', description: 'movie id' },
    limit: { type: 'number', default: 6, description: 'limit how many comments get' },
    offset: { type: 'number', default: 0, description: 'offset when query' }
  })
  @summary('get comments by movie id')
  @responses({ 200: { description: 'comment array', schema: commentArraySchema } })
  async getComments (ctx): Promise<void> {
    let { limit, offset, movieId } = ctx.query
    if (movieId == null) {
      throw E.MissParams
    }
    limit = limit == null ? 6 : limit
    offset = offset == null ? 0 : offset
    ctx.body = await commentService.getByMovieId(movieId, limit, offset)
  }

  @request('post', '')
  @body(commentProperties)
  @summary('add a comment')
  async creatComment (ctx): Promise<void> {
    ctx.body = await commentService.creat(ctx.request.body)
  }
}
