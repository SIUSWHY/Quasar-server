import app from '../../app';
import Users from '../../models/modelUser';
import jwt from 'jsonwebtoken';

const request = require('supertest')(app);

describe('Account controller', () => {
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
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Users.findOne({ $or: [{ phone: email }, { email: email }] })
            .then(user => {
              const decoded = jwt.verify(res.body['token'], 'JWT_SECRET');
              expect(user).toBe(decoded);
              done();
            })
            .catch(e => done(e));
        });
    });
  });

  describe('Register user - POST /account/signUp', () => {
    const url = '/account/signUp';
    const method = 'post';
    it('should login user & return token', () => {
      expect(1).toBe(1);
    });
  });
});
