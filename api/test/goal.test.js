const request = require('supertest');
const { expect } = require('chai');
const app = require('../index'); // Asegúrate de que exportas app en index.js
const User = require('../models/user');
const Goal = require('../models/goal');

describe('Goal API', () => {
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
    // Limpiar usuarios y metas de prueba
    await User.destroy({ where: { Email: 'testuser@example.com' } });
    await User.destroy({ where: { Email: 'newuser@example.com' } });
    await Goal.destroy({ where: { UsuarioID: testUser.ID } });
  });

  it('should create a new goal', async () => {
    const res = await request(app)
      .post('/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        MontoObjetivo: 1000.00,
        Categoria: 'Ahorro',
        FechaObjetivo: '2023-12-31',
        Progreso: 0.0,
        UsuarioID: testUser.ID,
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('ID');
  });

  it('should get all goals', async () => {
    const res = await request(app)
      .get('/goals')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should update an existing goal', async () => {
    const newGoal = await Goal.create({
      MontoObjetivo: 1000.00,
      Categoria: 'Ahorro',
      FechaObjetivo: '2023-12-31',
      Progreso: 0.0,
      UsuarioID: testUser.ID,
    });

    const res = await request(app)
      .put(`/goals/${newGoal.ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        MontoObjetivo: 1200.00,
        Categoria: 'Ahorro',
        FechaObjetivo: '2023-12-31',
        Progreso: 10.0,
        UsuarioID: testUser.ID,
      });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Goal updated successfully');
  });

  it('should delete an existing goal', async () => {
    const newGoal = await Goal.create({
      MontoObjetivo: 1000.00,
      Categoria: 'Ahorro',
      FechaObjetivo: '2023-12-31',
      Progreso: 0.0,
      UsuarioID: testUser.ID,
    });

    const res = await request(app)
      .delete(`/goals/${newGoal.ID}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Goal deleted successfully');
  });
});
