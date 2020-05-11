import { configure, getLogger } from 'log4js'
configure({
  appenders: {
    Movie: { type: 'file', filename: 'movie.log' },
    OSS: { type: 'file', filename: 'oss.log' }
  },
  categories: {
    default: { appenders: ['Movie'], level: 'info' },
    Movie: { appenders: ['Movie'], level: 'info' },
    OSS: { appenders: ['OSS'], level: 'info' }
  }
})
export const movieLogger = getLogger('Movie')
export const ossLogger = getLogger('OSS')
