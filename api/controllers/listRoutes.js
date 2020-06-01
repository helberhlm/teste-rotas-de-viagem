module.exports = (routesManager) => {
  const routes = {};
  routes.listRoutes = (req, res) => {
    const result = routesManager.listRoutes(req.body);
    return res.status(result.success ? 200 : 400).json(result);
  }
  return routes;
}
