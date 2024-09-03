const request = require('supertest');
const { expect } = require('chai');
const app = require('../index'); // Asegúrate de que exportas app en index.js
const User = require('../models/user');
const Budget = require('../models/budget');

describe('Budget API', () => {
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
    // Limpiar usuarios y presupuestos de prueba
    await User.destroy({ where: { Email: 'testuser@example.com' } });
    await User.destroy({ where: { Email: 'newuser@example.com' } });
    await Budget.destroy({ where: { UsuarioID: testUser.ID } });
  });

  it('should create a new budget', async () => {
    const res = await request(app)
      .post('/budgets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        Monto: 500.00,
        Categoria: 'Comida',
        FechaInicio: '2023-08-01',
        FechaFin: '2023-08-31',
        UsuarioID: testUser.ID,
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('ID');
  });

  it('should get all budgets', async () => {
    const res = await request(app)
      .get('/budgets')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should update an existing budget', async () => {
    const newBudget = await Budget.create({
      Monto: 500.00,
      Categoria: 'Comida',
      FechaInicio: '2023-08-01',
      FechaFin: '2023-08-31',
      UsuarioID: testUser.ID,
    });

    const res = await request(app)
      .put(`/budgets/${newBudget.ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        Monto: 600.00,
        Categoria: 'Transporte',
        FechaInicio: '2023-08-01',
        FechaFin: '2023-08-31',
        UsuarioID: testUser.ID,
      });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Budget updated successfully');
  });

  it('should delete an existing budget', async () => {
    const newBudget = await Budget.create({
      Monto: 500.00,
      Categoria: 'Comida',
      FechaInicio: '2023-08-01',
      FechaFin: '2023-08-31',
      UsuarioID: testUser.ID,
    });

    const res = await request(app)
      .delete(`/budgets/${newBudget.ID}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Budget deleted successfully');
  });
});
