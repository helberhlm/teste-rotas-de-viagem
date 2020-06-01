module.exports = class RoutesManager {
  constructor(routes, filename) {
    this.filename = filename;
    this.routes = routes;
  }

  static async readRoutesFromFileAsync(fileName) {
    const csv = require('fast-csv');
    const fs = require('fs');
    return new Promise(function (resolve, reject) {
      const result = []
      fs.createReadStream(fileName)
        .pipe(csv.parse({ headers: ['origin', 'destination', 'cost'] }))
        .on('data', (conexao) => result.push(conexao))
        .on('end', () => {
          resolve(result);
        });
    });
  }

  routeAlreadyExists({ origin, destination, routes = this.routes }) {
    return !!routes.filter(
      query => query.origin === origin && query.destination === destination
    ).length;
  }

  updateFileRoutes({ success = true, routes, filename = this.filename }) {
    if (success) {
      const csv = require('fast-csv');
      const fs = require('fs');
      const ws = fs.createWriteStream(filename);
      csv
        .write(routes, { headers: false })
        .pipe(ws);
      return true;
    }
    return false;
  }

  newRoute(route) {
    if (this.routeAlreadyExists(route)) {
      return {
        success: false,
        message: "This route already exists, please check!",
      }
    }
    this.routes.push(route);
    this.updateFileRoutes({ routes: this.routes });
    return {
      success: true,
      message: "Route created successfully!",
      routes: this.routes,
    }
  }

  findBestRoute({ origin, destination, routes = this.routes }) {
    if (routes.length > 0 && origin !== destination) {
      const adjacentRoutes = routes.filter(query => query.origin === origin);
      let bestRouteFound = {
        success: false,
        origin,
        destination,
        totalCost: undefined,
        message: "No routes",
      }
      adjacentRoutes.map(adjacentRoute => {
        const partialResult = this.findBestRoute({
          origin: adjacentRoute.destination,
          destination,
          routes: routes.filter(query => query.origin !== origin)
        });
        const partialCost = partialResult.totalCost + parseFloat(adjacentRoute.cost)
        if (partialResult.success && (bestRouteFound.totalCost === undefined || bestRouteFound.totalCost > partialCost)) {
          bestRouteFound = {
            ...partialResult,
            origin,
            destination,
            message: `${adjacentRoute.origin} - ${partialResult.message}`,
            totalCost: partialCost,
          }
        }
      })
      return bestRouteFound;
    }
    return origin === destination
      ? {
        success: true,
        message: origin,
        totalCost: 0,
      } : {
        success: false,
        message: "No routes",
      }
  }

  listRoutes() {
    return {
      success: !!this.routes,
      routes: this.routes,
    }
  }
}
