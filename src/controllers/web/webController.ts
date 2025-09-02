import { Request, Response } from "express";
import PostService from "../../services/postService";
import CommentService from "../../services/commentService";
import UserService from "../../services/userService";
import jwt from 'jsonwebtoken';
import UserPayload from "../../config/express";
import crypto from 'crypto';

const postService = new PostService();
const commentService = new CommentService();
const userService = new UserService();

export default class WebController
{
    home(request: Request, response: Response)
    {
        const accessToken = request.cookies.accessToken;
        if(accessToken)
        {
            response.redirect('/feed');
        }
        else
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
            const totalPages = Math.ceil(posts.length/10);
            response.render('pages/feed', {currentUser: request.user, currentUserId: request.user._id, posts: posts, page: page, limit: 10, totalPages: totalPages });
        }
    }

    login(request: Request, response: Response)
    {
        const accessToken = request.cookies.accessToken;
        if (!accessToken)
        {
            return response.render('pages/login');
        }
    
        return response.redirect('/feed');
    }

    register(request: Request, response: Response)
    {
        const accessToken = request.cookies.accessToken;
        if (!accessToken)
        {
            return response.render('pages/register');
        }
    
        return response.redirect('/feed');
    }

    create(request: Request, response: Response)
    {
        response.render('pages/createPost', {currentUser: request.user});
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

            const page = parseInt(request.query.postsPage as string) || 1;
            posts = await postService.getPostsByUserId(user._id, page, 10);
            if(posts)
            {
                const totalPages = Math.ceil(posts.length/10);
                const postsLikes = await postService.countUserPostsLikes(user._id.toString());
                const commentsLikes = await commentService.countUserCommentsLikes(user._id.toString());
                response.render('pages/profile', {user: user, currentUser: user, hasCustomAvatar: res.status !== 404, posts: posts, postsLikes: postsLikes, commentsLikes: commentsLikes, postsPage: page, limit: 10, totalPages: totalPages });
            }
        }
    }

    async showUserProfile(request: Request, response: Response)
    {
        const currentUser = request.user;
        const userId = request.params.userId;
        const page = parseInt(request.query.postsPage as string) || 1;
        const user = await userService.getUserById(userId);
        if(user)
        {
            const email = user.email.trim().toLowerCase();
            const hash =  crypto.createHash('sha256').update(email).digest('hex');
            const res = await fetch(`https://www.gravatar.com/avatar/${hash}?s=200&d=404`);
            
            const posts = await postService.getPostsByUserId(userId.toString(), page, 10);
            if(posts)
            {
                const totalPages = Math.ceil(posts.length/10);
                const postsLikes = await postService.countUserPostsLikes(userId.toString());
                const commentsLikes = await commentService.countUserCommentsLikes(userId.toString());
                response.render('pages/profile', {user: user, currentUser: currentUser, hasCustomAvatar: res.status !== 404, posts: posts, postsLikes: postsLikes, commentsLikes: commentsLikes, postsPage: page, limit: 10, totalPages: totalPages });
            }
        }
    }

    editProfile(request: Request, response: Response)
    {
        const user = request.user;
        return response.render('pages/editProfile', {currentUser: user});
    }

    async adminUsersPanel(request: Request, response: Response)
    {
        const user = request.user;
        const users = await userService.readUsers();
        return response.render('pages/users', {currentUser: user, users: users});
    }

    async editUser(request: Request, response: Response)
    {
        const currentUser = request.user;
        const userId = request.params.userId;
        if(currentUser?._id === userId)
        {
            return response.redirect('/profile/edit');
        }
        const user = await userService.getUserById(userId);
        return response.render('pages/adminEditUser', { user: user, currentUser: currentUser });
    }

    about(request: Request, response: Response)
    {
        const currentUser = getUserFromToken(request, response);
        response.render('pages/about', {currentUser: currentUser});
    }

    privacy(request: Request, response: Response)
    {
        const currentUser = getUserFromToken(request, response);
        response.render('pages/privacy', {currentUser: currentUser});
    }

    terms(request: Request, response: Response)
    {
        const currentUser = getUserFromToken(request, response);
        response.render('pages/terms', {currentUser: currentUser});
    }

    contact(request: Request, response: Response)
    {
        const currentUser = getUserFromToken(request, response);
        response.render('pages/contact', {currentUser: currentUser});
    }
}

function getUserFromToken(request: Request, response: Response)
{
    const accessToken = request.cookies.accessToken;
    const refreshToken = request.cookies.refreshToken;

    if (!accessToken && ! refreshToken)
    {
        return null;
    }

    try
    {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as UserPayload;
        return decoded;
    }
    catch (error)
    {
        if (!refreshToken)
            return null;
    }

    try
    {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as UserPayload;
        
        const newAccessToken = jwt.sign(
            {
                _id: decodedRefresh._id,
                name: decodedRefresh.name,
                email: decodedRefresh.email,
                avatarURL: decodedRefresh.avatarURL,
                isAdmin: decodedRefresh.isAdmin
            },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '15m' }
        );
        
        response.cookie("accessToken", newAccessToken,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 15
        });
        return decodedRefresh;
    }
    catch (refreshErr)
    {
        return null;
    }

}