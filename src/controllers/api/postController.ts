import { Request, Response } from "express";
import PostService from "../../services/postService";

const postService = new PostService();

export default class PostController
{
    async getAllPosts(request: Request, response: Response)
    {
        const page = parseInt(request.query.page as string) || 1;
        const limit = parseInt(request.query.limit as string) || 10;
        const posts = await postService.getPosts(page, limit);
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
        const author = request.user!;
        newPost = await postService.savePost(newPost, author);
        response.status(201).json({message: "Post saved successfully", post: newPost});
    }

    async updatePost(request: Request, response: Response)
    {
        let postId = request.params.postId;
        let post = request.body;
        const updatedPost = await postService.updatePost(postId, post);
        if(!updatedPost) return response.status(404).send("Post not found");
        return response.status(200).json({message: "Post update successfully", post: updatedPost});
    }

    async deletePost(request: Request, response: Response)
    {
        let postId = request.params.postId;
        const deletedPost = await postService.deletePost(postId);
        if(!deletedPost) return response.status(404).send("Post not found");
        return response.status(200).json({message: "Post deleted successfully", post: deletedPost});
    }

    async like(request: Request, response: Response)
    {
        let postId = request.params.postId;
        let user = request.user!;
        const likedPost = await postService.like(postId, user);
        if(!likedPost) return response.status(404).send("Post not found");
        return response.status(200).json({message: `Liked post ${postId} by ${user._id} successfully.`, liked: true, likeCount: likedPost.likes.length, likes: likedPost.likes});
    }

    async unlike(request: Request, response: Response)
    {
        let postId = request.params.postId;
        let user = request.user!;
        const unlikedPost = await postService.unlike(postId, user);
        if(!unlikedPost) return response.status(404).send("Post not found");
        return response.status(200).json({message: `Unliked post ${postId} by ${user._id} successfully.`, liked: false, likeCount: unlikedPost.likes.length, likes: unlikedPost.likes});
    }
}