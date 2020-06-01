module.exports = (app, routesManager) => {
  const controller = require('../controllers/listRoutes')(routesManager);
  app.route('/api/v1/listRoutes')
    .get(controller.listRoutes);
}
