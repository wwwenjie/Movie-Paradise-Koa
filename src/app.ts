import * as Koa from 'koa'
import config from './config'
import InitManager from './core/init'
import * as parser from 'koa-bodyparser'

const app = new Koa()
InitManager.initCore(app)
app.use(parser())

app.listen(config.port)
console.log(`listen at http://localhost:${config.port}`)
