import CError from './CError'

enum HTTP {
  BadRequest=400,
  Unauthorized=401,
  Forbidden=403,
  NotFound=404,
  MethodNotAllowed=405,
  Conflict=409,
  InternalServerError=500,
  NotImplemented=501,
  BadGateway=502,
  ServiceUnavailable=503
}

// enum can not used for object, so here is const
const E = {
  AccountWrong: new CError('Email or password is wrong', 40001, HTTP.Unauthorized),
  NameExist: new CError('Name already used', 40002, HTTP.Conflict),
  EmailExist: new CError('Email already used', 40003, HTTP.Conflict)
}

export default E
