const request = require('supertest');
const app = require('../app');

describe('GET /products', () => {
  it('should return all products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});