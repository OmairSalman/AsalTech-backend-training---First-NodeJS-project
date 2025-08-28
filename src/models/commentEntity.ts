import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  BaseEntity,
} from "typeorm";
import { User } from "./userEntity";
import { Post } from "./postEntity";

@Entity()
export class Comment extends BaseEntity
{
  @PrimaryGeneratedColumn("uuid")
  _id!: string;

  @Column("text")
  content!: string;

  @ManyToOne(() => User, (user) => user.comments, { eager: true, onDelete: "CASCADE" })
  author!: User;

  @ManyToOne(() => Post, post => post.comments, { onDelete: "CASCADE" })
  post!: Post;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  likes!: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}