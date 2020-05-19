import * as Router from 'koa-router'
import MovieServiceImpl from '../service/movie-service'

const router = new Router({
  prefix: '/movies'
})

const movieService = new MovieServiceImpl()

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
  // todo: more elegant way to switch
  const { ids, genre, actor, limit, offset, keyword } = ctx.query
  if (keyword !== undefined) {
    ctx.body = await movieService.search(keyword)
    return
  }
  if (ids !== undefined) {
    ctx.body = await movieService.findByIds(ids)
    return
  }
  if (actor !== undefined) {
    ctx.body = await movieService.findByActor(actor, limit, offset)
    return
  }
  if (genre !== undefined) {
    ctx.body = await movieService.findByGenre(genre, limit, offset)
  }
})

router.put('/', async (ctx) => {
  await movieService.update(ctx.request.body)
  ctx.body = { code: 200, msg: 'success' }
})

export default router
