import { Request, Response } from "express";
import PostService from "../../services/postService";
import CommentService from "../../services/commentService";
import UserService from "../../services/userService";
import { PostModel } from "../../models/postModel";
import jwt from 'jsonwebtoken';
import UserPayload from "../../interfaces/express";
import crypto from 'crypto';

const postService = new PostService();
const commentService = new CommentService();
const userService = new UserService();

export default class WebController
{
    home(request: Request, response: Response)
    {
        const token = request.cookies.token;
        try
        {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
        
            request.user = decoded;

            response.redirect('/feed');
        }
        catch (error)
        {
            response.render('pages/home');
        }
    }

    async feed(request: Request, response: Response)
    {
        if(!request.user)
            response.redirect('/');
        else
        {
            const page = parseInt(request.query.page as string) || 1;
            const posts = await postService.getPosts(page, 10);
            const totalPosts = await PostModel.countDocuments();
            const totalPages = Math.ceil(totalPosts/10);
            response.render('pages/feed', {user: request.user, currentUserId: request.user._id, posts: posts, page: page, limit: 10, totalPages: totalPages });
        }
    }

    login(request: Request, response: Response)
    {
        response.render('pages/login');
    }

    register(request: Request, response: Response)
    {
        response.render('pages/register');
    }

    create(request: Request, response: Response)
    {
        response.render('pages/createPost', {user: request.user});
    }

    async profile(request: Request, response: Response)
    {
        const user = request.user;
        let posts;
        if(user)
        {
            const email = user.email.trim().toLowerCase();
            const hash =  crypto.createHash('sha256').update(email).digest('hex');
            const res = await fetch(`https://www.gravatar.com/avatar/${hash}?s=200&d=404`);
            user.hasCustomAvatar =  res.status !== 404;

            const page = parseInt(request.query.postsPage as string) || 1;
            posts = await postService.getPostsByUserId(user._id.toString(), page, 10);
            if(posts)
            {
                const totalUserPosts = await PostModel.countDocuments({author: user._id});
                const totalPages = Math.ceil(totalUserPosts/10);
                const postsLikes = await postService.countUserPostsLikes(user._id.toString());
                const commentsLikes = await commentService.countUserCommentsLikes(user._id.toString());
                response.render('pages/profile', {user: user, currentUserId: request.user?._id,posts: posts, postsLikes: postsLikes, commentsLikes: commentsLikes, postsPage: page, limit: 10, totalPages: totalPages });
            }
        }
    }

    async showUserProfile(request: Request, response: Response)
    {
        const userId = request.params.userId;
        const page = parseInt(request.query.postsPage as string) || 1;
        const user = await userService.getUserById(userId);
        if(user)
        {
            const posts = await postService.getPostsByUserId(userId.toString(), page, 10);
            if(posts)
            {
                const totalUserPosts = await PostModel.countDocuments({author: userId});
                const totalPages = Math.ceil(totalUserPosts/10);
                const postsLikes = await postService.countUserPostsLikes(userId.toString());
                const commentsLikes = await commentService.countUserCommentsLikes(userId.toString());
                response.render('pages/profile', {user: user, currentUserId: request.user?._id, posts: posts, postsLikes: postsLikes, commentsLikes: commentsLikes, postsPage: page, limit: 10, totalPages: totalPages });
            }
        }
    }
}