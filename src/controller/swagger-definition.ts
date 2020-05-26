export const pagingQuery = {
  limit: { type: 'number', default: 8, description: 'limit how many movies get' },
  offset: { type: 'number', default: 0, description: 'offset how many movies when get' }
}

export const getMoviesQuery = {
  ids: { type: 'string', description: 'example: 12345-54321-254861' },
  genre: { type: 'string' },
  actor: { type: 'string' },
  limit: { type: 'number', default: 8 },
  offset: { type: 'number', default: 0 },
  keyword: { type: 'string', description: 'search by keyword' }
}

export const movieProperties = {
  _id: { type: 'number', example: 25964071 },
  imdb_id: { type: 'string', example: 'tt5061814' },
  title: { type: 'string', example: '电影标题' },
  title_en: { type: 'string', example: 'movie title english' },
  year: { type: 'number', example: 2020 },
  release: { type: 'string', example: '2020-05-20' },
  poster: { type: 'string', example: 'https://xxx.xxx.xxx' },
  path: { type: 'string', example: 'unique-movie-path' },
  info: {
    type: 'object',
    example: {
      director: '导演',
      writer: '编剧',
      actors: '演员',
      genre: '分类',
      region: '中国大陆',
      language: '汉语普通话',
      release: '2020-05-20(中国大陆)',
      duration: '120分钟',
      alias: '别名',
      summary: '电影介绍'
    }
  },
  rating: {
    type: 'object',
    example: {
      douban_score: '7.6',
      douban_votes: 593088,
      tags: '标签',
      imdb_score: '6.7',
      imdb_votes: 1877
    }
  },
  recs: { type: 'array', items: { type: 'number', example: 25964071 } },
  trailers: {
    type: 'array',
    items: {
      type: 'object',
      example: {
        m: 34835822,
        _id: 'yt_kH9NUqjjYtA',
        name: '预告片名',
        play_url: 'https://xxx.xxx.xxx'
      }
    }
  },
  backdrops: {
    type: 'array',
    items: {
      type: 'object',
      example: {
        aspect_ratio: 1.777777777777778,
        file_path: '/lurZ6PAlfZYGSanrI6V9P7UcCLY.jpg',
        height: 720,
        iso_639_1: null,
        vote_average: 0,
        vote_count: 0,
        width: 1280
      }
    }
  },
  create_time: { type: 'string', example: '2012-05-30T11:10:22.625Z' },
  update_time: { type: 'string', example: '2019-05-30T11:10:22.625Z' }
}

export const movieSchema = {
  type: 'object',
  properties: movieProperties
}

export const movieArraySchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: movieProperties
  }
}

export const genreProperties = {
  name: { type: 'string', example: '喜剧' },
  name_en: { type: 'string', example: 'Comedy' }
}

export const genreArraySchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: genreProperties
  }
}
