export default class Config {
  public static readonly port: number = 3000
  public static readonly database = {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'movie_paradise',
    forceSync: false
  }

  public static readonly cors = {
    allowOrigin: [
      'http://localhost:8080',
      'https://movie.jinwenjie.me'
    ]
  }
}
