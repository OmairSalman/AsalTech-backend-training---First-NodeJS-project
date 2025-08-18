import { Request, Response } from "express";
import PostService from "../services/postService";

const postService = new PostService();

export default class PostController
{
    async getAllPosts(request: Request, response: Response)
    {
        const posts = await postService.getPosts(1, 10);
        if(!posts) return response.status(404).send('No posts yet');
        return response.status(200).json(posts);
    }

    async getPost(request: Request, response: Response)
    {
        const postId = request.params.postId;
        const post = await postService.getPostById(postId);
        if(!post) return response.status(404).send("Post not found");
        return response.status(200).json(post);
    }

    async savePost(request: Request, response: Response)
    {
        let newPost = request.body;
        const author = request.session!.user!.id.toString();
        newPost = await postService.savePost(newPost, author);
        response.status(201).json(newPost);
    }
}