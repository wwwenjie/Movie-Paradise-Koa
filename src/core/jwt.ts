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
    const auth = args[0].request.header.authorization
    if (auth === undefined) {
      throw E.AuthRequired
    }
    const url: string = args[0].request.url
    // todo: diff url support
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
    const auth = args[0].request.header.authorization
    if (auth === undefined) {
      throw E.AuthRequired
    }
    // todo: get adminUid
    const adminUid = ['1', '2']
    if (!adminUid.includes(getUid(auth))) {
      throw E.Forbidden
    }
    return func.apply(this, args)
  }
}

function getUid (auth: string): string {
  const token: string = auth.trim().split(' ').pop()
  let decoded
  try {
    decoded = jwt.verify(token, config.jwtSecret)
  } catch (e) {
    throw new CError(`${E.JWTError.message}: ${String(e.message)}`, E.JWTError.code, E.JWTError.status)
  }
  return decoded.uid
}

export {
  check,
  checkAdmin,
  getUid
}
