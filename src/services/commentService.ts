import UserPayload from "../config/express";
import redisClient from "../config/redis";
import { Comment } from "../models/commentEntity";
import { Post } from "../models/postEntity";
import { User } from "../models/userEntity";
import { commentToPublic } from "../utils/publicDTOs";
import { PublicComment } from "../utils/publicTypes";

export default class CommentService
{
    async saveComment(postId: string, newComment: Comment, author: UserPayload): Promise<PublicComment | null>
    {
        try
        {
            const insertResult = await Comment.insert({
                content: newComment.content,
                post: (await Post.findOneBy({ _id: postId }))!,
                author: author
            });
            const comment = await Comment.findOne(
                {
                    where: {_id: insertResult.identifiers[0]._id},
                    relations: ["post"]
                });
            if(!comment) return null;

            const keys = await redisClient.keys(`user:${comment.post.author._id}:posts:page:*`);
            if (keys.length) await redisClient.del(keys);
            await redisClient.del('feed:page:1');

            const safeComment = commentToPublic(comment);
            return safeComment;
        }
        catch(error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error saving comment:`, error);
            return null;
        }
    }

    async countUserCommentsLikes(userId: string)
    {
        const cacheKey = `user:${userId}:comments:likes:count`;
        const cached = await redisClient.get(cacheKey);
        if (cached)
        {
            return JSON.parse(cached);
        }
        const comments = await Comment.find(
            {
                where: {author: {_id: userId}}
            });
        if(comments)
        {
            let commentsLikes = 0;
            comments.forEach(comment =>{
                commentsLikes += comment.likes.length;
            });
            await redisClient.setex(cacheKey, 300, JSON.stringify(commentsLikes));
            return commentsLikes;
        }
    }

    async updateComment(commentId: string, updatedComment: Comment): Promise<PublicComment | null>
    {
        try
        {
            await Comment.update({_id: commentId}, updatedComment);
            const comment = await Comment.findOne(
                {
                    where: {_id: commentId},
                    relations: ["post"]
                });
            if(!comment) return null;

            const keys = await redisClient.keys(`user:${comment.post.author._id}:posts:page:*`);
            if (keys.length) await redisClient.del(keys);
            await redisClient.del('feed:page:1');

            const safeComment = commentToPublic(comment);
            return safeComment;
        }
        catch(error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error updating comment:`, error);
            return null;
        }
    }

    async deleteComment(commentId: string): Promise<PublicComment | null>
    {
        try
        {
            const comment = await Comment.findOne(
                {
                    where: {_id: commentId},
                    relations: ["post"]
                });
            if(!comment) return null;
            await comment.remove();

            const keys = await redisClient.keys(`user:${comment.post.author._id}:posts:page:*`);
            if (keys.length) await redisClient.del(keys);
            await redisClient.del('feed:page:1');
            await redisClient.del(`user:${comment.author._id}:comments:likes:count`);

            const safeComment = commentToPublic(comment);
            return safeComment;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error deleting comment:`, error);
            return null;
        }
    }

    async like(commentId: string, user: UserPayload): Promise<PublicComment | null>
    {
        try
        {
            const comment = await Comment.findOne(
                {
                    where: { _id: commentId },
                    relations: ["post"]
                });
            if (!comment) return null;

            if (!comment.likes.some(u => u._id === user._id))
            {
                comment.likes.push(user as User);
                await comment.save();
            }

            const keys = await redisClient.keys(`user:${comment.post.author._id}:posts:page:*`);
            if (keys.length) await redisClient.del(keys);
            await redisClient.del('feed:page:1');
            await redisClient.del(`user:${comment.author._id}:comments:likes:count`);
            const safeComment = commentToPublic(comment);
            return safeComment;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error liking comment:`, error);
            return null;
        }
    }

    async unlike(commentId: string, user: UserPayload): Promise<PublicComment | null>
    {
        try
        {
                const comment = await Comment.findOne(
                {
                    where: { _id: commentId },
                    relations: ["post"]
                });
            if (!comment) return null;

            comment.likes = comment.likes.filter(u => u._id !== user._id);
            await comment.save();

            const keys = await redisClient.keys(`user:${comment.post.author._id}:posts:page:*`);
            if (keys.length) await redisClient.del(keys);
            await redisClient.del('feed:page:1');
            await redisClient.del(`user:${comment.author._id}:comments:likes:count`);
            const safeComment = commentToPublic(comment);
            return safeComment;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error unliking comment:`, error);
            return null;
        }
    }
}