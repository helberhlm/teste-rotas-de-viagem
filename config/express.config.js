module.exports = (routesManager) => {
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();
  // app.set('port', process.env.PORT || 3000);
  app.use(bodyParser.json());
  require('../api/routes/findRoute')(app, routesManager);
  require('../api/routes/listRoutes')(app, routesManager);
  require('../api/routes/newRoute')(app, routesManager);
  return app;
};
