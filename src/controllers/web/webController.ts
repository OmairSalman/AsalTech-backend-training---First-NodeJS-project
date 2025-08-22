import { Request, Response } from "express";
import PostService from "../../services/postService";
import CommentService from "../../services/commentService";
import { PostModel } from "../../models/postModel";

const postService = new PostService();
const commentService = new CommentService();

export default class WebController
{
    home(request: Request, response: Response)
    {
        if(!request.session.user)
            response.render('pages/home');
        else
            response.redirect('/feed');
    }

    async feed(request: Request, response: Response)
    {
        if(!request.session.user)
            response.redirect('/');
        else
        {
            const page = parseInt(request.query.page as string) || 1;
            const posts = await postService.getPosts(page, 10);
            const totalPosts = await PostModel.countDocuments();
            const totalPages = Math.ceil(totalPosts/10);
            response.render('pages/feed', {user: request.session.user, posts: posts, page: page, limit: 10, totalPages: totalPages });
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
        response.render('pages/createPost', {user: request.session.user});
    }

    async profile(request: Request, response: Response)
    {
        const user = request.session.user;
        let posts;
        if(user)
        {
            const page = parseInt(request.query.postsPage as string) || 1;
            posts = await postService.getPostsByUserId(user?.id.toString(), page, 10);
            if(posts)
            {
                const totalUserPosts = await PostModel.countDocuments({author: user.id});
                const totalPages = Math.ceil(totalUserPosts/10);
                const postsLikes = await postService.countUserPostsLikes(user?.id.toString());
                const commentsLikes = await commentService.countUserCommentsLikes(user?.id.toString());
                response.render('pages/profile', {user: user, posts: posts, postsLikes: postsLikes, commentsLikes: commentsLikes, postsPage: page, limit: 10, totalPages: totalPages });
            }
        }
    }
}