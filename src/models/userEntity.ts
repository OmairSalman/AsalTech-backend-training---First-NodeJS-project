import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, BaseEntity
} from "typeorm";
import { Post } from "./postEntity";
import { Comment } from "./commentEntity";

@Entity()
export class User extends BaseEntity
{
  @PrimaryGeneratedColumn("uuid")
  _id!: string

  @Column()
  name!: string

  @Column()
  email!: string

  @Column()
  password!: string

  @Column()
  avatarURL!: string

  @OneToMany(() => Post, (post) => post.author, { cascade: true })
  posts!: Post[]

  @OneToMany(() => Comment, (comment) => comment.author, { cascade: true })
  comments!: Comment[]

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}