import InitManager from '../../core/init'
import CommentServiceImpl from '../../service/comment-serviece'
import Comment from '../../entity/mongodb/comment'

test('comment service', async () => {
  await InitManager.initLoadDatabase()
  const commentService = new CommentServiceImpl()
  const comment = new Comment()
  comment.title = 'Title'
  comment.summary = 'Summary'
  comment.movie_id = 123
  await commentService.creat(comment)
  const res = await commentService.getByMovieId('123', '1', '0')
  expect(res[0].title).toStrictEqual(comment.title)
  expect(res[0].summary).toStrictEqual(comment.summary)
  await commentService.delete(res[0]._id.toString())
})
