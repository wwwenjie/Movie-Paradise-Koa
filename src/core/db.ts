import config from '../config'
import { createConnection } from 'typeorm'
import * as path from 'path'

const { type, username, password, host, port, database, sync, logging } = config.database
export default createConnection({
  type: type,
  host: host,
  port: port,
  username: username,
  password: password,
  database: database,
  entities: [path.resolve(__dirname, '../entity/*.*')],
  synchronize: sync,
  logging: logging
})
