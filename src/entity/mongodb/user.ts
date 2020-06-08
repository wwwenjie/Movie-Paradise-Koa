import { Entity, ObjectID, ObjectIdColumn, Column, CreateDateColumn, Index } from 'typeorm'

@Entity()
export default class User {
  @ObjectIdColumn()
  _id: ObjectID

  @Index('user_name', { unique: true })
  @Column()
  name: string

  @Index('user_email', { unique: true })
  @Column()
  email: string

  @Column()
  password: string

  @Column()
  desc: string

  @Column()
  avatar: string

  @Column()
  list: [number]

  @Column()
  like: [number]

  @Column()
  watched: [number]

  // not working in mongo
  @CreateDateColumn()
  create_time: Date
}
