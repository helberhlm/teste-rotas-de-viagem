module.exports = (app, routesManager) => {
  const controller = require('../controllers/findRoute')(routesManager);
  app.route('/api/v1/findRoute')
    .post(controller.getRoute);
}
