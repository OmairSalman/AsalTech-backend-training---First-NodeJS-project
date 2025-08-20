import { Request, Response } from "express";
import PostService from "../../services/postService";

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
            const posts = await postService.getPosts(1, 10);
            response.render('pages/feed', {user: request.session.user, posts: posts});
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