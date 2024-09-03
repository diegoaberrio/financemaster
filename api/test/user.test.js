const request = require('supertest');
const { expect } = require('chai');
const app = require('../index'); // Asegúrate de que exportas app en index.js
const User = require('../models/user');

describe('User API', () => {
  let token;
  let testUser;

  before(async () => {
    // Crear un usuario de prueba
    testUser = await User.create({
      Nombre: 'Test User',
      Email: 'testuser@example.com',
      Password: 'password123',
      Rol: 'usuario',
    });

    const res = await request(app)
      .post('/auth/login')
      .send({
        Email: 'testuser@example.com',
        Password: 'password123',
      });
    token = res.body.token;
  });

  after(async () => {
    // Limpiar usuarios de prueba
    await User.destroy({ where: { Email: 'testuser@example.com' } });
    await User.destroy({ where: { Email: 'newuser@example.com' } });
  });

  it('should get all users', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        Nombre: 'New User',
        Email: 'newuser@example.com',
        Password: 'password123',
        Rol: 'usuario',
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('ID');
  });

  it('should update an existing user', async () => {
    const newUser = await User.create({
      Nombre: 'Temporary User',
      Email: 'temporaryuser@example.com',
      Password: 'password123',
      Rol: 'usuario',
    });

    const res = await request(app)
      .put(`/users/${newUser.ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        Nombre: 'Updated User',
        Email: 'updateduser@example.com',
        Password: 'newpassword123',
        Rol: 'admin',
      });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Usuario actualizado correctamente');

    // Limpiar el usuario temporal
    await User.destroy({ where: { Email: 'updateduser@example.com' } });
  });

  it('should delete an existing user', async () => {
    const newUser = await User.create({
      Nombre: 'User to Delete',
      Email: 'deleteuser@example.com',
      Password: 'password123',
      Rol: 'usuario',
    });

    const res = await request(app)
      .delete(`/users/${newUser.ID}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Usuario eliminado correctamente');
  });
});
