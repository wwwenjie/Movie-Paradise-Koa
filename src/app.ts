import * as Koa from 'koa'
import InitManager from './core/init'
import * as parser from 'koa-bodyparser'

const app = new Koa()
InitManager.initCore(app)
app.use(parser())
