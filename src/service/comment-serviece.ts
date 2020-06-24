import Comment from '../entity/mongodb/comment'
import { ObjectID } from 'mongodb'
import { getConnection } from 'typeorm'
import { checkUid } from '../core/jwt'

interface CommentService {
  creat: (comment: Comment) => Promise<void>
  update: (comment: Comment, auth: string) => Promise<void>
  delete: (id: string, auth: string) => Promise<void>
  getCommentList: (limit: string, offset: string) => Promise<Comment[]>
  getByMovieId: (movieId: string, limit: string, offset: string) => Promise<Comment[]>
  getByUserId: (userId: string, limit: string, offset: string) => Promise<Comment[]>
}

export default class CommentServiceImpl implements CommentService {
  private readonly commentRepository = getConnection('mongodb').getMongoRepository(Comment)

  async creat (comment: Comment): Promise<void> {
    comment.create_time = new Date()
    comment.update_time = comment.create_time
    await this.commentRepository.insertOne(comment)
  }

  async update (comment: Comment, auth: string): Promise<void> {
    // dont believe request's user_id
    // hackers can register user and give right auth and user_id to delete comment not belong them
    // get user_id from database
    const commentRes = await this.commentRepository.findOne(ObjectID(comment._id))
    checkUid(auth, commentRes.user_id)
    const id = comment._id
    delete comment._id
    comment.update_time = new Date()
    await this.commentRepository.updateOne({ _id: ObjectID(id) }, {
      $set: comment
    })
  }

  async delete (id: string, auth: string): Promise<void> {
    const comment = await this.commentRepository.findOne(ObjectID(id))
    checkUid(auth, comment.user_id)
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
        user_id: userId
      },
      order: {
        update_time: 'DESC'
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    })
  }
}
