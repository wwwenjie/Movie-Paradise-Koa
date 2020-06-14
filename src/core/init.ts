// inspired by https://github.com/LFB/nodejs-koa-blog
import connect from './db'
import * as path from 'path'
import * as cors from '@koa/cors'
import { SwaggerRouter } from 'koa-swagger-decorator'
import config from '../config'
import CError from '../error/CError'
import logger from './log4js'
import * as koaBody from 'koa-body'

export default class InitManager {
  private static app: any
  public static initCore (app): void {
    InitManager.app = app
    ;(async () => {
      await InitManager.initLoadErrorHandler()
      await InitManager.initLoadDatabase()
      await InitManager.initLoadCORS()
      await InitManager.initLoadFileSupport()
      await InitManager.initLoadRouters()
      InitManager.app.listen(config.port, () => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`listen at http://localhost:${config.port}`)
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`swagger at http://localhost:${config.port}/swagger-html`)
      })
    })().catch(err => {
      console.error(err)
    })
  }

  public static async initLoadErrorHandler (): Promise<void> {
    InitManager.app.use(async (ctx, next) => {
      try {
        await next()
      } catch (error) {
        if (error instanceof CError) {
          ctx.body = error
          ctx.status = error.status
        } else {
          logger.error(error)
          ctx.body = error.message
          ctx.status = 500
        }
      }
    })
  }

  public static async initLoadDatabase (): Promise<void> {
    try {
      await connect
      console.log('Connection has been established successfully.')
    } catch (err) {
      console.error('Unable to connect to the database:', err)
    }
  }

  private static async initLoadCORS (): Promise<void> {
    InitManager.app.use(cors({
      origin: ctx => {
        const allowOrigin: string[] = config.cors.allowOrigin
        if (allowOrigin.includes(ctx.request.header.origin)) {
          return ctx.request.header.origin
        }
      },
      keepHeadersOnError: false
    }
    ))
  }

  private static async initLoadFileSupport (): Promise<void> {
    InitManager.app.use(koaBody({
      multipart: true,
      formidable: {
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024,
        uploadDir: config.ossLocalPath
      }
    }))
  }

  private static async initLoadRouters (): Promise<void> {
    const router = new SwaggerRouter()
    router.swagger({
      title: 'Movie Paradise API V1 Server',
      description: 'Movie Paradise API DOC',
      version: '1.0.0'
    })
    router.mapDir(path.resolve(__dirname, '../controller/'))
    // @ts-ignore
    InitManager.app.use(router.routes())
    console.log('Routes loaded.')
  }
}
