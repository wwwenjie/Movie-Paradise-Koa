import * as Router from 'koa-router'
import ImprovementServiceImpl from '../service/improvement-service'
import Movie from '../entity/movie'

const router = new Router({
  prefix: '/movies'
})

const improvementService = new ImprovementServiceImpl()

router.patch('/trailer', async (ctx) => {
  const { id } = ctx.request.body
  await improvementService.addTrailer(parseInt(id))
  ctx.body = { msg: 'Thanks for support' }
})

router.patch('/poster', async (ctx) => {
  const { id } = ctx.request.body
  await improvementService.addPoster(parseInt(id))
  ctx.body = { msg: 'Thanks for support' }
})

router.patch('/backdrop', async (ctx) => {
  const movie: Movie = ctx.request.body
  await improvementService.addBackdrop(movie)
  ctx.body = { msg: 'Thanks for support' }
})

export default router
