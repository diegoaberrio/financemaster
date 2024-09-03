const request = require('supertest');
const { expect } = require('chai');
const app = require('../index'); // Asegúrate de que exportas app en index.js
const User = require('../models/user');
const Notification = require('../models/notification');

describe('Notification API', () => {
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
    // Limpiar usuarios y notificaciones de prueba
    await User.destroy({ where: { Email: 'testuser@example.com' } });
    await User.destroy({ where: { Email: 'newuser@example.com' } });
    await Notification.destroy({ where: { UsuarioID: testUser.ID } });
  });

  it('should create a new notification', async () => {
    const res = await request(app)
      .post('/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        TipoDeNotificacion: 'Recordatorio',
        Mensaje: 'Revisa tu presupuesto mensual',
        Fecha: '2023-08-01',
        Estado: 'No leído',
        UsuarioID: testUser.ID,
      });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('ID');
  });

  it('should get all notifications', async () => {
    const res = await request(app)
      .get('/notifications')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should update an existing notification', async () => {
    const newNotification = await Notification.create({
      TipoDeNotificacion: 'Recordatorio',
      Mensaje: 'Revisa tu presupuesto mensual',
      Fecha: '2023-08-01',
      Estado: 'No leído',
      UsuarioID: testUser.ID,
    });

    const res = await request(app)
      .put(`/notifications/${newNotification.ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        TipoDeNotificacion: 'Recordatorio',
        Mensaje: 'Actualiza tu presupuesto',
        Fecha: '2023-08-02',
        Estado: 'Leído',
        UsuarioID: testUser.ID,
      });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Notification updated successfully');
  });

  it('should delete an existing notification', async () => {
    const newNotification = await Notification.create({
      TipoDeNotificacion: 'Recordatorio',
      Mensaje: 'Revisa tu presupuesto mensual',
      Fecha: '2023-08-01',
      Estado: 'No leído',
      UsuarioID: testUser.ID,
    });

    const res = await request(app)
      .delete(`/notifications/${newNotification.ID}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Notification deleted successfully');
  });
});
