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
  logging: process.env.NODE_ENV !== 'production' ? console.log : null
})

export default sequelize
