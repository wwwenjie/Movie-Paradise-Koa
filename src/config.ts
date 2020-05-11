export default class Config {
  public static readonly port: number = 3000
  public static readonly database = {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'movie_paradise',
    // DO NOT change it unless you know what it is
    forceSync: false
  }

  public static readonly cors = {
    allowOrigin: [
      'http://localhost:8080',
      'https://movie.jinwenjie.me'
    ]
  }

  // replace with your alicloud oss config
  public static readonly ossConfig = {
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    region: ''
  }

  // replace with your local path
  public static readonly ossLocalPath = ''
}
