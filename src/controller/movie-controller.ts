import * as Router from 'koa-router'
import MovieService from '../service/movie-service'

const router = new Router({
  prefix: '/movies'
})

router.get('/', async (ctx) => {
  const genre = ctx.query.genre
  const actor = ctx.query.actor
  const limit = ctx.query.limit
  const offset = ctx.query.offset
  if (actor !== undefined) {
    ctx.body = await MovieService.findByActor(actor, limit, offset)
    return
  }
  // todo: new map will process find all
  const special = new Map()
    // newest
    .set('newest', MovieService.findAll())
    // search
    .set('key', MovieService.findAll())
  ctx.body = special.has(genre) ? await special.get(genre) : await MovieService.findByGenre(genre, limit, offset)
})

router.post('/', async (ctx) => {
  if (ctx.request.body instanceof Array) {
    for (const movie of ctx.request.body) {
      await MovieService.create(movie)
    }
    ctx.body = ctx.request.body
  } else {
    ctx.body = await MovieService.create(ctx.request.body)
  }
})

router.get('/:id', async (ctx) => {
  ctx.body = await MovieService.findById(ctx.params.id)
})

export default router
