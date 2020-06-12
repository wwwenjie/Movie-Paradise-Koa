import E from '../error/ErrorEnum'
import * as jwt from 'jsonwebtoken'
import config from '../config'
import CError from '../error/CError'

const check = () => (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  const func = descriptor.value
  descriptor.value = function (...args) {
    if (args[0].request.header.authorization === undefined) {
      throw E.AuthRequired
    }
    const auth: string = args[0].request.header.authorization.trim().split(' ').pop()
    const url: string = args[0].request.url
    const uid: string = url.substring(url.lastIndexOf('/') + 1)
    if (uid !== getUid(auth)) {
      throw E.Forbidden
    }
    return func.apply(this, args)
  }
}

const checkAdmin = () => (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  const func = descriptor.value
  descriptor.value = function (...args) {
    if (args[0].request.header.authorization === undefined) {
      throw E.AuthRequired
    }
    const auth: string = args[0].request.header.authorization.trim().split(' ').pop()
    // todo: get adminUid
    const adminUid = ['1', '2']
    if (!adminUid.includes(getUid(auth))) {
      throw E.Forbidden
    }
    return func.apply(this, args)
  }
}

function getUid (auth: string): string {
  let decoded
  try {
    decoded = jwt.verify(auth, config.jwtSecret)
  } catch (e) {
    throw new CError(`${E.JWTError.message}: ${String(e.message)}`, E.JWTError.code, E.JWTError.status)
  }
  return decoded.uid
}

export {
  check,
  checkAdmin
}
