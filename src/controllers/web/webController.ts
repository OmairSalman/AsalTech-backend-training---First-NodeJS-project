import { Request, Response } from "express";
import PostService from "../../services/postService";
import { PostModel } from "../../models/postModel";

const postService = new PostService();

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
}