import * as Router from 'koa-router'
import MovieService from '../service/movie-service'

const router = new Router({
  prefix: '/movies'
})

const movieService = new MovieService()

router.get('/', async (ctx) => {
  const { genre, actor, limit, offset } = ctx.query
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/strict-boolean-expressions
  console.time(`movie query ${genre || 'actor'} ${actor || 'genre'} ${limit} ${offset}`)
  if (actor !== undefined) {
    ctx.body = await movieService.findByActor(actor, limit, offset)
  } else {
    ctx.body = await movieService.findByGenre(genre, limit, offset)
  }
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/strict-boolean-expressions
  console.timeEnd(`movie query ${genre || 'actor'} ${actor || 'genre'} ${limit} ${offset}`)
})

router.post('/', async (ctx) => {
  await movieService.update(ctx.request.body)
  ctx.body = { code: 200, msg: 'success' }
})

router.get('/:path', async (ctx) => {
  ctx.body = await movieService.findByPath(ctx.params.path)
})

export default router
