import mongoose from "mongoose";
import { Post } from "../interfaces/post";
import { PostModel } from "../models/postModel";

export default class PostService
{
    async getPosts(page: number, limit: number): Promise<Post[]>
    {
        try
        {
            const skip = (page - 1) * limit;
            return await PostModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', 'name')
                .populate('likes', 'name')
                .populate({
                    path: 'comments',
                    options: { sort: { createdAt: -1 } },
                    populate: { path: 'author', select: 'name' }
                })
                .lean();
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error fetching posts:`, error);
            return [];
        }
    }

    async getPostById(postId: string): Promise<Post | null>
    {
        try
        {
            const post = await PostModel.findById(postId)
                .populate('author', 'name')
                .populate('likes', 'name')
                .populate({
                    path: 'comments',
                    populate: { path: 'author', select: 'name' }
                });
            return post?.toObject() ?? null;
        }
        catch
        (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error fetching post by ID:`, error);
            return null;
        }
    }

    async savePost(newPost: Post, userId: string): Promise<Post | null>
    {
        try
        {
            const post = new PostModel({...newPost, author: userId});
            await post.save();
            return post.toObject();
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error saving post:`, error);
            return null;
        }
    }

    async updatePost(postId: string, updatedPost: Post): Promise<Post | null>
    {
        try
        {
            const post = await PostModel.findByIdAndUpdate(postId, updatedPost, { new: true });
            return post?.toObject() ?? null;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error updating post:`, error);
            return null;
        }
    }

    async deletePost(postId: string): Promise<Post | null>
    {
        try
        {
            const postDoc = await PostModel.findByIdAndDelete(postId);
            return postDoc?.toObject() ?? null;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error deleting post:`, error);
            return null;
        }
    }

    async getPostsByUserId(userId: string, page: number, limit: number): Promise<Post[] | null>
    {
        try
        {
            const skip = (page - 1) * limit;
            const posts = await PostModel.find({ author: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', 'name')
                .populate('likes', 'name')
                .populate({
                    path: 'comments',
                    options: { sort: { createdAt: -1 } },
                    populate: { path: 'author', select: 'name' }
                })
                .lean();
            return posts ?? null;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error fetching posts by user:`, error);
            return null;
        }
    }

    async countUserPostsLikes(userId: string)
    {
        const posts = await PostModel.find({author: userId});
        if(posts)
        {
            let postsLikes = 0;
            posts.forEach(comment =>{
                postsLikes += comment.likes.length;
            });
            return postsLikes;
        }
    }

    async like(postId: string, userId: string): Promise<Post | null>
    {
        try
        {
            const post = await PostModel.findByIdAndUpdate(
                postId,
                { $addToSet: { likes: new mongoose.Types.ObjectId(userId) } },
                { new: true }
            );
            return post?.toObject() ?? null;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error liking post:`, error);
            return null;
        }
    }

    async unlike(postId: string, userId: string): Promise<Post | null>
    {
        try
        {
            const post = await PostModel.findByIdAndUpdate(
                postId,
                { $pull: { likes: new mongoose.Types.ObjectId(userId) } },
                { new: true }
            );
            return post?.toObject() ?? null;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error unliking post:`, error);
            return null;
        }
    }
}