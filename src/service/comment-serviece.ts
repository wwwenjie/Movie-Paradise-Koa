import Comment from '../entity/mongodb/comment'
import { ObjectID } from 'mongodb'
import { getConnection } from 'typeorm'

interface CommentService {
  getByMovieId(id: string, limit: string, offset: string): Promise<Comment[]>
  creat(comment: Comment): Promise<void>
  delete(id: string): Promise<void>
}

export default class CommentServiceImpl implements CommentService {
  private readonly commentRepository = getConnection('mongodb').getMongoRepository(Comment)

  async getByMovieId (movieId: string, limit: string, offset: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: {
        movie_id: parseInt(movieId)
      },
      order: {
        update_time: 'DESC'
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    })
  }

  async creat (comment: Comment): Promise<void> {
    comment.user_id = ObjectID(comment.user_id)
    comment.create_time = new Date()
    comment.update_time = comment.create_time
    await this.commentRepository.insertOne(comment)
  }

  async delete (id: string): Promise<void> {
    await this.commentRepository.deleteOne({
      _id: ObjectID(id)
    })
  }
}
