// inspired by https://github.com/LFB/nodejs-koa-blog
import sequelize from './db'
import * as fs from 'fs'
import * as path from 'path'
import * as Router from 'koa-router'

export default class InitManager {
  private static app: any
  public static initCore (app): void {
    InitManager.app = app
    ;(async () => {
      await InitManager.initLoadDatabase()
      await InitManager.initLoadRouters()
    })().catch(err => {
      console.error(err)
    })
  }

  private static async initLoadDatabase (): Promise<void> {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')
    // not async function
    sequelize.addModels([path.resolve(__dirname, '../models/')])
    console.log('Models loaded')
    // change force to true to drop tables if already exist (data will lose)
    await sequelize.sync({ force: false })
    console.log('Success sync database')
  }

  private static async initLoadRouters (): Promise<void> {
    const dir = path.resolve(__dirname, '../controller/')
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const route = await import(path.join(dir, file))
      if (route.default instanceof Router) {
        InitManager.app.use(route.default.routes())
        console.log('Routes loaded')
      }
    }
  }
}
