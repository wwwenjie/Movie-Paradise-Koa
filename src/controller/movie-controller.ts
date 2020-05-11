import * as Router from 'koa-router'
import MovieService from '../service/movie-service'

const router = new Router({
  prefix: '/movies'
})

router.get('/', async (ctx) => {
  // todo: limit
  const genre = ctx.query.genre
  const special = new Map()
    // newest
    .set('newest', MovieService.findAll())
    // search
    .set('key', MovieService.findAll())
  ctx.body = special.has(genre) ? await special.get(genre) : await MovieService.findByGenre(genre)
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
