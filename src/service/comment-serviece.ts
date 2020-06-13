import Comment from '../entity/mongodb/comment'
import { ObjectID } from 'mongodb'
import { getConnection } from 'typeorm'

interface CommentService {
  creat(comment: Comment): Promise<void>
  update(id: string): Promise<void>
  delete(id: string): Promise<void>
  getCommentList (limit: string, offset: string): Promise<Comment[]>
  getByMovieId(movieId: string, limit: string, offset: string): Promise<Comment[]>
  getByUserId(userId: string, limit: string, offset: string): Promise<Comment[]>
}

export default class CommentServiceImpl implements CommentService {
  private readonly commentRepository = getConnection('mongodb').getMongoRepository(Comment)

  async creat (comment: Comment): Promise<void> {
    comment.user_id = ObjectID(comment.user_id)
    comment.create_time = new Date()
    comment.update_time = comment.create_time
    await this.commentRepository.insertOne(comment)
  }

  async update (id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete (id: string): Promise<void> {
    await this.commentRepository.deleteOne({
      _id: ObjectID(id)
    })
  }

  async getCommentList (limit: string, offset: string): Promise<Comment[]> {
    return this.commentRepository.find({
      order: {
        update_time: 'DESC'
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    })
  }

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

  async getByUserId (userId: string, limit: string, offset: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: {
        movie_id: ObjectID(userId)
      },
      order: {
        update_time: 'DESC'
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    })
  }
}
