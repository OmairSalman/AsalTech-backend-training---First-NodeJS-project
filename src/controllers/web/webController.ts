import { Request, Response } from "express";

export default class WebController
{
    home(request: Request, response: Response)
    {
        if(!request.session.user)
            response.render('pages/home');
        else
            response.render('pages/feed');
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