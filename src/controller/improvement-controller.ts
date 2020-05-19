import * as Router from 'koa-router'
import ImprovementServiceImpl from '../service/improvement-service'

const router = new Router({
  prefix: '/movies'
})

const improvementService = new ImprovementServiceImpl()

router.patch('/poster', async (ctx) => {
  const { id } = ctx.request.body
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  improvementService.addPoster(id)
  ctx.body = { msg: 'Thanks for support' }
})

router.patch('/trailer', async (ctx) => {
  const { id, trailers } = ctx.request.body
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  improvementService.addTrailers(id, trailers)
  ctx.body = { msg: 'Thanks for support' }
})

router.patch('/backdrop', async (ctx) => {
  const { id, backdrops } = ctx.request.body
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  improvementService.addBackdrops(id, backdrops)
  ctx.body = { msg: 'Thanks for support' }
})

export default router
