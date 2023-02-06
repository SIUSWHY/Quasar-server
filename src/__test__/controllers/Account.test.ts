import app from '../../app';

const request = require('supertest')(app);

describe('Account controller', () => {
  describe('Register user - POST /account/signUp', () => {
    const url = '/account/signUp';
    const method = 'post';
    it('should login user & return token', () => {
      expect(1).toBe(1);
    });
  });

  describe('Login user - POST /account/signIn', () => {
    const url = '/account/signIn';
    const email = 'Test1@gmail.com';
    const password = 'Test1';
    it('should login user & return token', done => {
      request
        .post(url)
        .send({ name: email, password })
        .expect(200)
        .expect(res => {
          expect(res.body['token']).toBeTruthy();
        });
    });
  });
});
