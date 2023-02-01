import app from '../../app';
const request = require('supertest')(app);

describe('Health controller', () => {
  describe('Check health - get /', () => {
    const url = '/';
    it('should return 200 & { health: OK }', async () => {
      return await request.get(url).then(response => {
        expect(response.statusCode).toBe(200);
      });
    });
  });
});
