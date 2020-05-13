// https://github.com/RobinBuschmann/sequelize-typescript
import { Sequelize } from 'sequelize-typescript'
import config from '../config'

const { database, username, password, host, port } = config.database
const sequelize = new Sequelize({
  dialect: 'mysql',
  database,
  host,
  port,
  username,
  password,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00',
  logging: config.database.logging
})

export default sequelize
