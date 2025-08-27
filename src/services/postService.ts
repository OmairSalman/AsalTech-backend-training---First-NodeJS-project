import mongoose from "mongoose";
import { Post } from "../models/postEntity";
import { User } from "../models/userEntity";

export default class PostService
{
    async getPosts(page: number, limit: number): Promise<Post[]>
    {
        try
        {
            const skip = (page - 1) * limit;
            return await Post.find(
                {
                    order: {createdAt: "DESC"},
                    skip: skip,
                    take: limit
                }
            );
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error fetching posts:\n`, error);
            return [];
        }
    }

    async getPostById(postId: string): Promise<Post | null>
    {
        try
        {
            const post = await Post.findOneBy({ _id: postId });
            return post ?? null;
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
            const post = new Post();
            post.title = newPost.title;
            post.content = newPost.content;
            const author = await User.findOneBy({_id: userId});
            if(!author) return null;
            post.author = author;
            await post.save();
            return post;
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
            await Post.update({ _id: postId }, updatedPost);
            const post = await Post.findOneBy({ _id: postId });
            return post ?? null;
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
            const post = await Post.findOneBy({ _id: postId });
            if(!post) return null;
            await post.remove();
            return post;
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
            const posts =  await Post.find(
                {
                    where: { author: { _id: userId } },
                    order: {createdAt: "DESC"},
                    skip: skip,
                    take: limit
                }
            );
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
        const posts = await Post.find(
            {
                where: { author: { _id: userId } },
            }
        );
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
            const post = await Post.findOne(
                {
                    where: { _id: postId },
                    relations: ["likes"],
                });
            if (!post) return null;

            const user = await User.findOneBy({_id: userId});
            if (!user) return null;

            if (!post.likes.some(u => u._id === userId))
            {
                post.likes.push(user);
                await post.save();
            }

            await post.reload();
            return post;
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
             const post = await Post.findOne(
                {
                    where: { _id: postId },
                    relations: ["likes"],
                });
            if (!post) return null;

            post.likes = post.likes.filter(u => u._id !== userId);
            await post.save();

            await post.reload();

            return post;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error unliking post:`, error);
            return null;
        }
    }
}