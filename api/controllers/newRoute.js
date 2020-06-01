module.exports = (routesManager) => {
  const routes = {};
  routes.newRoute = (req, res) => {
    const result = routesManager.newRoute(req.body);
    return res.status(result.success ? 200 : 400).json(result);
  }
  return routes;
}
