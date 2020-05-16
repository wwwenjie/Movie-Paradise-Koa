import MovieService from '../../service/movie-service'
import InitManager from '../../core/init'
import Movie from '../../entity/movie'

function getMovie (): Movie {
  const movie = new Movie()
  movie._id = 1
  movie.title = 'test title'
  movie.path = 'test path'
  movie.year = 2000
  movie.release = new Date(Date.now())
  movie.info = {
    actors: 'actor1/actor2',
    genre: 'genre1/actor2',
    alias: '',
    director: '',
    duration: '',
    language: '',
    region: '',
    release: '',
    summary: '',
    writer: ''
  }
  return movie
}

test('movie service', async () => {
  await InitManager.initLoadDatabase()
  const movieService = new MovieService()
  const movie = getMovie()
  if (Movie.hasId(movie)) {
    await movieService.update(movie)
  } else {
    await movieService.create(movie)
  }
  const newMovie = await movieService.findByPath(movie.path)
  const testGenre = await movieService.findByGenre('genre1')
  const testActor = await movieService.findByActor('actor2')
  expect(newMovie).toStrictEqual(testGenre[0])
  expect(newMovie).toStrictEqual(testActor[0])
  await Movie.delete({
    _id: newMovie._id
  })
  expect(await movieService.findByPath(newMovie.path)).toBeUndefined()
})
