const request = require('supertest');
const { expect } = require('chai');
const app = require('../index'); // Asegúrate de que exportas app en index.js
const User = require('../models/user');
const Recommendation = require('../models/recommendation');

describe('Recommendation API', () => {
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
    // Limpiar usuarios y recomendaciones de prueba
    await User.destroy({ where: { Email: 'testuser@example.com' } });
    await User.destroy({ where: { Email: 'newuser@example.com' } });
    await Recommendation.destroy({ where: { UsuarioID: testUser.ID } });
  });

  it('should create a new recommendation', async () => {
    const res = await request(app)
      .post('/recommendations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        Mensaje: 'Ahorrar 10% de tus ingresos cada mes',
        TipoDeRecomendacion: 'Ahorro',
        UsuarioID: testUser.ID,
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('ID');
  });

  it('should get all recommendations', async () => {
    const res = await request(app)
      .get('/recommendations')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should update an existing recommendation', async () => {
    const newRecommendation = await Recommendation.create({
      Mensaje: 'Ahorrar 10% de tus ingresos cada mes',
      TipoDeRecomendacion: 'Ahorro',
      UsuarioID: testUser.ID,
    });

    const res = await request(app)
      .put(`/recommendations/${newRecommendation.ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        Mensaje: 'Invertir en fondos mutuos',
        TipoDeRecomendacion: 'Inversión',
        UsuarioID: testUser.ID,
      });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Recommendation updated successfully');
  });

  it('should delete an existing recommendation', async () => {
    const newRecommendation = await Recommendation.create({
      Mensaje: 'Ahorrar 10% de tus ingresos cada mes',
      TipoDeRecomendacion: 'Ahorro',
      UsuarioID: testUser.ID,
    });

    const res = await request(app)
      .delete(`/recommendations/${newRecommendation.ID}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Recommendation deleted successfully');
  });
});
