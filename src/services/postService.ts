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
            .skip(skip)
            .limit(limit)
            .populate('author', 'name')
            .populate('likes', 'name')
            .populate({
                path: 'comments',
                populate:
                {
                    path: 'author',
                    select: 'name'
                }
            });
        }
        catch(error)
        {
            const errorDate = new Date();
            const errorDateString = errorDate.toLocaleDateString();
            const errorTimeString = errorDate.toLocaleTimeString();
            console.error(`[${errorDateString} @ ${errorTimeString}] Error fetching users data from DB:\n`, error);
            return [];
        }
    }

    async getPostById(postId: string): Promise<Post | null>
    {
        const userDoc = await PostModel.findById(postId);
        const user = userDoc?.toObject();
        if (!user) return null;
        else return user;
    }

    //async savePost()
}