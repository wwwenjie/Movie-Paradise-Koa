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
  await improvementService.patchBackdrops(movie._id)
  await improvementService.patchPoster(movie._id)
  await improvementService.patchTrailers(movie._id)
}, 20000)
