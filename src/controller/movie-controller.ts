import * as Router from 'koa-router'
import MovieService from '../service/movie-service'
import Movie from '../models/movie'

const router = new Router({
  prefix: '/movies'
})

router.get('/', async (ctx) => {
  ctx.body = await MovieService.findByAll()
})

router.post('/', async (ctx) => {
  ctx.body = await MovieService.create(new Movie(ctx.request.body))
})

router.get('/:id', async (ctx) => {
  ctx.body = await MovieService.findById(ctx.params.id)
})

export default router
