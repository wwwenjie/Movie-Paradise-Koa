import InitManager from '../../core/init'
import ImprovementServiceImpl from '../../service/improvement-service'
import MovieServiceImpl from '../../service/movie-service'
import { getRandomItemFromArray } from '../../util'

test('improvement', async () => {
  await InitManager.initLoadDatabase()
  const improvementService = new ImprovementServiceImpl()
  const movieService = new MovieServiceImpl()
  const movies = await movieService.getToday()
  const movie = getRandomItemFromArray(movies, 1)[0]
  console.log(movie._id)
  movie.backdrops = [{
    width: 1920,
    height: 1080,
    file_path: '/bHMHpXNjeKRxcjWcpbIAD5f0aIK.jpg',
    iso_639_1: null,
    vote_count: 10,
    aspect_ratio: 1.777777777777778,
    vote_average: 5.42
  }]
  await improvementService.addBackdrops(movie)
  await improvementService.addPoster(movie._id)
  await improvementService.addTrailers(movie._id)
}, 20000)
