import { prefix, query, request, responses, summary, tagsAll } from 'koa-swagger-decorator/dist'
import { genreArraySchema } from './swagger-definition'
import Genre from '../entity/genre'

@tagsAll('Genre Controller')
@prefix('/genres')
export default class GenreController {
  @request('get', '')
  @query({
    limit: { type: 'number', default: 6, description: 'limit how many genres get' },
    offset: { type: 'number', default: 0, description: 'offset how many genres when get' }
  })
  @summary('get genres')
  @responses({ 200: { description: 'genre array', schema: genreArraySchema } })
  async getGenres (ctx): Promise<void> {
    let { limit, offset } = ctx.query
    limit = limit == null ? 6 : limit
    offset = offset == null ? 0 : offset
    ctx.body = await Genre.find({
      select: ['name', 'name_en'],
      take: parseInt(limit),
      skip: parseInt(offset)
    })
  }
}
