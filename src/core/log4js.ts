import { configure, getLogger } from 'log4js'
configure({
  appenders: { Movie: { type: 'file', filename: 'movie.log' } },
  categories: { default: { appenders: ['Movie'], level: 'info' } }
})
const logger = getLogger('Movie')
export default logger
