import { Post } from "../models/postEntity";
import { User } from "../models/userEntity";
import redisClient from "../config/redis";
import { userToPublic } from "../utils/publicUser";

export default class PostService
{
    async getPosts(page: number, limit: number): Promise<Post[]>
    {
        try
        {
            const cacheKey = "feed:page:1";
            if(page === 1)
            {
                const cached = await redisClient.get(cacheKey);
                if (cached)
                {
                    return JSON.parse(cached);
                }
            }
            const skip = (page - 1) * limit;
            const posts = await Post.find(
                {
                    order: {createdAt: "DESC"},
                    skip: skip,
                    take: limit
                }
            );
            if(page === 1) await redisClient.setex(cacheKey, 600, JSON.stringify(posts));
            return posts;
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
            const post = await Post.findOne(
                {
                    where: { _id: postId },
                });
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
            await Post.insert({
                title: newPost.title,
                content: newPost.content,
                author: (await User.findOneBy({_id: userId}))!,
            });
            const keys = await redisClient.keys(`user:${userId}:posts:page:*`);
            if (keys.length) await redisClient.del(keys);
            await redisClient.del('feed:page:1');

            return await Post.findOneBy({author: {_id: userId}});
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
            if(!post) return null;

            const keys = await redisClient.keys(`user:${post.author._id}:posts:page:*`);
            if (keys.length) await redisClient.del(keys);
            const res = await redisClient.del('feed:page:1');
            console.log(res);

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
            const post = await Post.findOne({ where: {_id: postId } });
            if(!post) return null;
            await post.remove();
            for (const comment of post.comments) {
                await redisClient.del(`user:${comment.author._id}:comments:likes:count`);
            }
            const keys = await redisClient.keys(`user:${post.author._id}:posts:*`);
            if (keys.length) await redisClient.del(keys);

            await redisClient.del('feed:page:1');
            await redisClient.del(`user:${post.author._id}:comments:likes:count`);

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
        const cacheKey = `user:${userId}:posts:page:${page}:limit:${limit}`;
        try
        {
            const cached = await redisClient.get(cacheKey);
            if (cached)
            {
                return JSON.parse(cached);
            }
            const skip = (page - 1) * limit;
            const posts =  await Post.find(
                {
                    where: { author: {_id: userId} },
                    order: { createdAt: "DESC" },
                    skip: skip,
                    take: limit
                }
            );
            await redisClient.setex(cacheKey, 3600, JSON.stringify(posts));
            return posts ?? null;
        }
        catch (error)
        {
            const errorDate = new Date();
            console.error(`[${errorDate.toLocaleDateString()} @ ${errorDate.toLocaleTimeString()}] Error fetching posts by user:\n`, error);
            return null;
        }
    }

    async countUserPostsLikes(userId: string)
    {
        const cacheKey = `user:${userId}:posts:likes:count`;
        const cached = await redisClient.get(cacheKey);
        if (cached)
        {
            return JSON.parse(cached);
        }
        const posts = await Post.find(
            {
                where: { author: {_id: userId} },
            }
        );
        if(posts)
        {
            let postsLikes = 0;
            posts.forEach(comment =>{
                postsLikes += comment.likes.length;
            });
            await redisClient.setex(cacheKey, 300, JSON.stringify(postsLikes));
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
                });
            if (!post) return null;

            const user = await User.findOneBy({_id: userId});
            if (!user) return null;

            if (!post.likes.some(u => u._id === userId))
            {
                post.likes.push(user);
                await post.save();
            }

            const keys = await redisClient.keys(`user:${post.author._id}:posts:*`);
            if (keys.length) await redisClient.del(keys);
            await redisClient.del('feed:page:1');
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
            });
            if (!post) return null;

            post.likes = post.likes.filter(u => u._id !== userId);
            await post.save();

            const keys = await redisClient.keys(`user:${post.author._id}:posts:*`);
            if (keys.length) await redisClient.del(keys);

            await redisClient.del('feed:page:1');
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