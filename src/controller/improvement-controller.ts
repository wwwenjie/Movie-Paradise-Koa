import * as Router from 'koa-router'
import ImprovementServiceImpl from '../service/improvement-service'

const router = new Router({
  prefix: '/movies'
})

const improvementService = new ImprovementServiceImpl()

router.patch('/trailer', async (ctx) => {
  const { id } = ctx.query
  await improvementService.addTrailer(parseInt(id))
  ctx.body = { msg: 'Thanks for support' }
})

router.patch('/poster', async (ctx) => {
  const { id } = ctx.query
  await improvementService.addPoster(parseInt(id))
  ctx.body = { msg: 'Thanks for support' }
})

router.patch('/backdrop', async (ctx) => {
  const { id, backdrops } = ctx.query
  await improvementService.addBackdrop(parseInt(id), backdrops)
  ctx.body = { msg: 'Thanks for support' }
})

export default router
