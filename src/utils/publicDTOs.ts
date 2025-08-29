import { User } from "../models/userEntity";
import { Comment } from "../models/commentEntity";
import { Post } from "../models/postEntity";
import { PublicUser, PublicComment, PublicPost } from "./publicTypes";

export function userToPublic(user: User): PublicUser {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatarURL: user.avatarURL,
  };
}

export function commentToPublic(comment: Comment): PublicComment {
  return {
    _id: comment._id,
    content: comment.content,
    author: userToPublic(comment.author),
    likes: comment.likes.map(userToPublic),
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

export function postToPublic(post: Post): PublicPost {
  return {
    _id: post._id,
    title: post.title,
    content: post.content,
    author: userToPublic(post.author),
    likes: post.likes.map(userToPublic),
    comments: (post.comments ?? [])
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(commentToPublic),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}