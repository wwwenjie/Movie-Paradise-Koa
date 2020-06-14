import * as Koa from 'koa'
import InitManager from './core/init'

const app = new Koa()
InitManager.initCore(app)
