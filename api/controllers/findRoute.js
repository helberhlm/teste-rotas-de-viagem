module.exports = (routesManager) => {
  const routes = {};
  routes.getRoute = (req, res) => {
    const result = routesManager.findBestRoute(req.body);
    return res.status(result.success ? 200 : 400).json(result);
  }
  return routes;
}
