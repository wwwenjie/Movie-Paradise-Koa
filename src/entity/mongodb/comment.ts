import { Entity, ObjectID, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export default class Comment {
  @ObjectIdColumn()
  _id: ObjectID

  @Column()
  title: string

  @Column()
  user_id: string

  @Column()
  user_name: string

  @Column()
  movie_id: string

  @Column()
  summary: string

  @Column()
  rating: number

  // parent id
  @Column()
  pid: number

  @CreateDateColumn()
  create_time: Date

  @UpdateDateColumn()
  update_time: Date
}
