import { Entity, ObjectID, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export default class User {
  @ObjectIdColumn()
  _id: ObjectID

  @Column()
  name: string

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

  @CreateDateColumn()
  create_time: Date
}
