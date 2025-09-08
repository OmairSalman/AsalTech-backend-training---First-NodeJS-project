import { userToPublic } from '../utils/publicDTOs';

describe('userToPublic', () => {
  it('should return a public user object', () => {
    const user = { _id: '1', name: 'Test', email: 'test@example.com', password: 'secret', isAdmin: false };
    const publicUser = userToPublic(user as any);
    expect(publicUser).toHaveProperty('name', 'Test');
    expect(publicUser).not.toHaveProperty('password');
  });
});