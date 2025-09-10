import { Request, Response, NextFunction } from 'express';
import { isAuthenticated } from '../../middlewares/auth/isAuthenticated';
import jwt from 'jsonwebtoken';
import redisClient from '../../config/redis';

jest.mock('jsonwebtoken');

describe('isAuthenticated Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      cookies: {}
    };
    
    mockResponse = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    
    mockNext = jest.fn();
  });

  it('should redirect to login if no tokens provided', async () => {
    await isAuthenticated(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.redirect).toHaveBeenCalledWith('/login');
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next() for valid access token', async () => {
    const mockPayload = { _id: '123', name: 'John', email: 'john@example.com' };
    mockRequest.cookies = { accessToken: 'valid-token' };
    (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

    await isAuthenticated(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockRequest.user).toEqual(mockPayload);
    expect(mockNext).toHaveBeenCalled();
  });
});

afterAll(async () => {
  await redisClient.quit();
});