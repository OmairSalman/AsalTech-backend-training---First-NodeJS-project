import { Comment } from "../models/commentEntity";
import { Post } from "../models/postEntity";
import { User } from "../models/userEntity";

export default class CommentService
{
    async saveComment(postId: string, newComment: Comment, userId: string): Promise<Comment | null>
    {
        try
        {
            const comment = new Comment();
            comment.content = newComment.content;
            const post = await Post.findOneBy({ _id: postId });
            if (!post) return null;
            comment.post = post;
            const author = await User.findOneBy({_id: userId});
            if(!author) return null;
            comment.author = author;
            await comment.save();
            await comment.reload();
            return comment;
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
        const comments = await Comment.find({where: {author: {_id: userId}}});
        if(comments)
        {
            let commentsLikes = 0;
            comments.forEach(comment =>{
                commentsLikes += comment.likes.length;
            });
            return commentsLikes;
        }
    }

    async updateComment(commentId: string, updatedComment: Comment): Promise<Comment | null>
    {
        try
        {
            await Comment.update({_id: commentId}, updatedComment);
            const comment = await Comment.findOneBy({_id: commentId});
            return comment ?? null;
        }
        catch(error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error updating comment:`, error);
            return null;
        }
    }

    async deleteComment(commentId: string): Promise<Comment | null>
    {
        try
        {
            const comment = await Comment.findOneBy({_id: commentId});
            if(!comment) return null;
            await comment.remove();
            return comment;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error deleting comment:`, error);
            return null;
        }
    }

    async like(commentId: string, userId: string): Promise<Comment | null>
    {
        try
        {
            const comment = await Comment.findOne(
                {
                    where: { _id: commentId },
                    relations: ["likes"],
                });
            if (!comment) return null;

            const user = await User.findOneBy({_id: userId});
            if (!user) return null;

            if (!comment.likes.some(u => u._id === userId))
            {
                comment.likes.push(user);
                await comment.save();
            }

            await comment.reload();
            return comment;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error liking post:`, error);
            return null;
        }
    }

    async unlike(commentId: string, userId: string): Promise<Comment | null>
    {
        try
        {
                const comment = await Comment.findOne(
                {
                    where: { _id: commentId },
                    relations: ["likes"],
                });
            if (!comment) return null;

            comment.likes = comment.likes.filter(u => u._id !== userId);
            await comment.save();

            await comment.reload();

            return comment;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error unliking post:`, error);
            return null;
        }
    }
}