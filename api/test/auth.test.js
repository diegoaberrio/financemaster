const request = require('supertest');
const { expect } = require('chai');
const app = require('../index'); // Asegúrate de que exportas app en index.js
const User = require('../models/user');

describe('Auth API', () => {
  let token;

  before(async () => {
    // Crear un usuario de prueba
    await User.create({
      Nombre: 'Test User',
      Email: 'testuser@example.com',
      Password: 'password123',
      Rol: 'usuario',
    });
  });

  after(async () => {
    // Limpiar usuarios de prueba
    await User.destroy({ where: { Email: 'testuser@example.com' } });
    await User.destroy({ where: { Email: 'newuser@example.com' } });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        Nombre: 'New User',
        Email: 'newuser@example.com',
        Password: 'password123',
        Rol: 'usuario',
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('token');
  });

  it('should not register a user with invalid data', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        Nombre: 'T',
        Email: 'testuser@example',
        Password: '123',
        Rol: 'usuario',
      });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        Email: 'testuser@example.com',
        Password: 'password123',
      });
    token = res.body.token;
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('should not login a user with incorrect password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        Email: 'testuser@example.com',
        Password: 'wrongpassword',
      });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });
});
