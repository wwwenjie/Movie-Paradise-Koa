import MovieService from '../../service/movie-service'
import InitManager from '../../core/init'
import Movie from '../../entity/movie'

function getMovie (): Movie {
  const movie = new Movie()
  movie._id = 1
  movie.title = 'test title'
  movie.path = 'test path'
  movie.info = {
    actors: 'actor1/actor2',
    genre: 'genre1/genre2',
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

// test('test', async () => {
//   await InitManager.initLoadDatabase()
//   const movieService = new MovieService()
//   console.log('typeorm')
//   console.time('s')
//   await movieService.findByGenre('灾难')
//   // await movieService.findByActor('成龙')
//   console.timeEnd('s')
// }, 10000)

// only test in test database
// test('MovieService', async () => {
//   // CRUD
//   await InitManager.initLoadDatabase()
//   const movieService = new MovieService()
//   const movie = getMovie()
//   const C = await movieService.create(movie)
//   expect(C).toBeTruthy()
//   const R = await movieService.findByPath(movie.path)
//   expect(R._id).toBe(movie._id)
//   movie.title = 'updated title'
//   const U = await movieService.update(movie)
//   expect(U.title).toBe('updated title')
//   // // delete is not allowed
//   const movieSecond = getMovie()
//   movieSecond._id = 2
//   movieSecond.path = 'path 2'
//   await movieService.create(movieSecond)
//   // Find
//   const actor = await movieService.findByActor('actor1')
//   expect(actor[0]._id).toBe(movie._id)
//   const genre = await movieService.findByGenre('genre1')
//   expect(genre[0]._id).toBe(movie._id)
//   expect(genre.length).toBe(2)
//   const limit = await movieService.findByActor('actor2', 1, 0)
//   expect(limit[0]._id).toBe(movie._id)
//   expect(limit.length).toBe(1)
//   const offset = await movieService.findByGenre('genre2', 8, 1)
//   expect(offset[0]._id).toBe(movieSecond._id)
//   expect(offset.length).toBe(1)
//   const noMovie = await movieService.findByGenre('no genre')
//   expect(noMovie.length).toBe(0)
// }, 100000)
