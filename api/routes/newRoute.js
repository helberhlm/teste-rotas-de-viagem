module.exports = (app, routesManager) => {
  const controller = require('../controllers/newRoute')(routesManager);
  app.route('/api/v1/newRoute')
    .post(controller.newRoute);
}
