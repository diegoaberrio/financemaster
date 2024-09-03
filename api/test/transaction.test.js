const request = require('supertest');
const { expect } = require('chai');
const app = require('../index'); // Asegúrate de que exportas app en index.js
const User = require('../models/user');
const Transaction = require('../models/transaction');

describe('Transaction API', () => {
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
    // Limpiar usuarios y transacciones de prueba
    await User.destroy({ where: { Email: 'testuser@example.com' } });
    await User.destroy({ where: { Email: 'newuser@example.com' } });
    await Transaction.destroy({ where: { UsuarioID: testUser.ID } });
  });

  it('should create a new transaction', async () => {
    const res = await request(app)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        Monto: 100.00,
        Tipo: 'Ingreso',
        Categoria: 'Salario',
        Fecha: '2023-08-01',
        UsuarioID: testUser.ID,
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('ID');
  });

  it('should get all transactions', async () => {
    const res = await request(app)
      .get('/transactions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should update an existing transaction', async () => {
    const newTransaction = await Transaction.create({
      Monto: 100.00,
      Tipo: 'Ingreso',
      Categoria: 'Salario',
      Fecha: '2023-08-01',
      UsuarioID: testUser.ID,
    });

    const res = await request(app)
      .put(`/transactions/${newTransaction.ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        Monto: 150.00,
        Tipo: 'Ingreso',
        Categoria: 'Salario',
        Fecha: '2023-08-01',
        UsuarioID: testUser.ID,
      });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Transaction updated successfully');
  });

  it('should delete an existing transaction', async () => {
    const newTransaction = await Transaction.create({
      Monto: 100.00,
      Tipo: 'Ingreso',
      Categoria: 'Salario',
      Fecha: '2023-08-01',
      UsuarioID: testUser.ID,
    });

    const res = await request(app)
      .delete(`/transactions/${newTransaction.ID}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Transaction deleted successfully');
  });
});
