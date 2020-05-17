import * as Router from 'koa-router'
import MovieService from '../service/movie-service'

const router = new Router({
  prefix: '/movies'
})

const movieService = new MovieService()

router.get('/today', async (ctx) => {
  ctx.body = await movieService.getToday()
})

router.get('/newest', async (ctx) => {
  const { limit, offset } = ctx.query
  ctx.body = await movieService.getNewest(limit, offset)
})

router.get('/coming', async (ctx) => {
  const { limit, offset } = ctx.query
  ctx.body = await movieService.getComing(limit, offset)
})

router.get('/:path', async (ctx) => {
  ctx.body = await movieService.findByPath(ctx.params.path)
})

router.get('/', async (ctx) => {
  const { ids, genre, actor, limit, offset } = ctx.query
  if (ids !== undefined) {
    ctx.body = await movieService.findByIds(ids)
    return
  }
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

router.put('/', async (ctx) => {
  await movieService.update(ctx.request.body)
  ctx.body = { code: 200, msg: 'success' }
})

export default router
