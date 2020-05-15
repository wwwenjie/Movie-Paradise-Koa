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
  // ts node for dev
  entities: [path.resolve(__dirname, '../entity/*.ts')],
  synchronize: sync,
  logging: logging
})
