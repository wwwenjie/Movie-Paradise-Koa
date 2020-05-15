import * as Router from 'koa-router'
import MovieService from '../service/movie-service'

const router = new Router({
  prefix: '/movies'
})

const movieService = new MovieService()

router.get('/', async (ctx) => {
  const genre: string = ctx.query.genre
  const actor: string = ctx.query.actor
  const limit: number = ctx.query.limit
  const offset: number = ctx.query.offset
  console.log(Number.isInteger(limit))
  console.log(limit)
  console.time(`movie query ${genre} ${actor} ${limit} ${offset}`)
  if (actor !== undefined) {
    await movieService.findByActor(actor, limit, offset)
    console.timeEnd(`movie query ${genre} ${actor} ${limit} ${offset}`)
    return
  }
  ctx.body = await movieService.findByGenre(genre, limit, offset)
  console.timeEnd(`movie query ${genre} ${actor} ${limit} ${offset}`)
})

router.post('/', async (ctx) => {
  if (ctx.request.body instanceof Array) {
    for (const movie of ctx.request.body) {
      await movieService.create(movie)
    }
    ctx.body = ctx.request.body
  } else {
    ctx.body = await movieService.create(ctx.request.body)
  }
})

router.get('/:path', async (ctx) => {
  ctx.body = await movieService.findByPath(ctx.params.path)
})

export default router
