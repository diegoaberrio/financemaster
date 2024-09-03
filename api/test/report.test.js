const request = require('supertest');
const { expect } = require('chai');
const app = require('../index'); // Asegúrate de que exportas app en index.js
const User = require('../models/user');
const Report = require('../models/report');

describe('Report API', () => {
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
    // Limpiar usuarios y reportes de prueba
    await User.destroy({ where: { Email: 'testuser@example.com' } });
    await User.destroy({ where: { Email: 'newuser@example.com' } });
    await Report.destroy({ where: { UsuarioID: testUser.ID } });
  });

  it('should create a new report', async () => {
    const res = await request(app)
      .post('/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        TipoDeReporte: 'Mensual',
        RangoDeFechas: '2023-08-01 - 2023-08-31',
        UsuarioID: testUser.ID,
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('ID');
  });

  it('should get all reports', async () => {
    const res = await request(app)
      .get('/reports')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should update an existing report', async () => {
    const newReport = await Report.create({
      TipoDeReporte: 'Mensual',
      RangoDeFechas: '2023-08-01 - 2023-08-31',
      UsuarioID: testUser.ID,
    });

    const res = await request(app)
      .put(`/reports/${newReport.ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        TipoDeReporte: 'Trimestral',
        RangoDeFechas: '2023-07-01 - 2023-09-30',
        UsuarioID: testUser.ID,
      });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Report updated successfully');
  });

  it('should delete an existing report', async () => {
    const newReport = await Report.create({
      TipoDeReporte: 'Mensual',
      RangoDeFechas: '2023-08-01 - 2023-08-31',
      UsuarioID: testUser.ID,
    });

    const res = await request(app)
      .delete(`/reports/${newReport.ID}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Report deleted successfully');
  });
});
