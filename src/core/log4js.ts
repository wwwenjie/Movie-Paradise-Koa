import { configure, getLogger } from 'log4js'
configure({
  appenders: {
    Default: { type: 'file', filename: 'movie.log' },
    Movie: { type: 'file', filename: 'movie.log' },
    OSS: { type: 'file', filename: 'oss.log' },
    HTTP: { type: 'file', filename: 'http.log' }
  },
  categories: {
    default: { appenders: ['Default'], level: 'info' },
    Movie: { appenders: ['Movie'], level: 'info' },
    OSS: { appenders: ['OSS'], level: 'info' },
    HTTP: { appenders: ['HTTP'], level: 'info' }
  }
})
export default getLogger('default')
export const movieLogger = getLogger('Movie')
export const ossLogger = getLogger('OSS')
export const httpLogger = getLogger('HTTP')
