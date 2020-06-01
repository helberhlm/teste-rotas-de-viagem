const RoutesManager = require("./routesManager.service");
const INPUT_FILE_TEST = "./input-file-test.txt";
const OUTPUT_FILE_TEST = "./output-file-test.txt";
describe("The Routes Manager class", () => {
  it("should initialize with routes from JSON object", () => {
    const routesManager = new RoutesManager([], INPUT_FILE_TEST);

    expect(routesManager).toBeInstanceOf(RoutesManager);
  });

  describe("The readRoutesFromFileAsync method", () => {
    it("should load routes from CSV file and return a array in format [{ origin, destination, cost }]", async () => {
      const routesPromise = RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
      expect(routesPromise).resolves.toEqual([
        { origin: 'GRU', destination: 'BRC', cost: '10' },
        { origin: 'BRC', destination: 'SCL', cost: '5' },
        { origin: 'GRU', destination: 'CDG', cost: '75' },
        { origin: 'GRU', destination: 'SCL', cost: '20' },
        { origin: 'GRU', destination: 'ORL', cost: '56' },
        { origin: 'ORL', destination: 'CDG', cost: '5' },
        { origin: 'SCL', destination: 'ORL', cost: '20' }
      ]);
    });
  });

  describe("The routeAlreadyExists method", () => {
    it("should return true when adding a existent route", async () => {
      const routes = await RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
      const routesManager = new RoutesManager(routes, INPUT_FILE_TEST);
      const result = routesManager.routeAlreadyExists({ origin: "GRU", destination: "CDG" });
      expect(result).toEqual(true);
    });
  });

  describe("The updateFileRoutes method", () => {
    it("should update the disk file with the new routes", async () => {
      const routes = await RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
      const routesManager = new RoutesManager(routes, OUTPUT_FILE_TEST);
      routesManager.updateFileRoutes({ routes });
      const result = RoutesManager.readRoutesFromFileAsync(OUTPUT_FILE_TEST);
      expect(result).resolves.toEqual(routes);
    });

    it("should not update the disk file with the new routes", async () => {
      const routes = await RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
      const routesManager = new RoutesManager(routes, OUTPUT_FILE_TEST);
      routesManager.updateFileRoutes({ success: false });
      const result = RoutesManager.readRoutesFromFileAsync(OUTPUT_FILE_TEST);
      expect(result).resolves.toEqual(routes);
    });
  });

  describe("The newRoute method", () => {
    it("should add a new route on system and save it on file", async () => {
      const routes = await RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
      const routesManager = new RoutesManager(routes, OUTPUT_FILE_TEST);
      const result = routesManager.newRoute({ origin: "SCL", destination: "CDG", cost: 10 });
      expect(result).toEqual({
        success: true,
        message: "Route created successfully!",
        routes: [
          { origin: 'GRU', destination: 'BRC', cost: '10' },
          { origin: 'BRC', destination: 'SCL', cost: '5' },
          { origin: 'GRU', destination: 'CDG', cost: '75' },
          { origin: 'GRU', destination: 'SCL', cost: '20' },
          { origin: 'GRU', destination: 'ORL', cost: '56' },
          { origin: 'ORL', destination: 'CDG', cost: '5' },
          { origin: 'SCL', destination: 'ORL', cost: '20' },
          { origin: 'SCL', destination: 'CDG', cost: 10 },
        ],
      });
    });

    it("should return success = false when adding a existent route", async () => {
      const routes = await RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
      const routesManager = new RoutesManager(routes, OUTPUT_FILE_TEST);
      const result = routesManager.newRoute({ origin: "GRU", destination: "CDG", cost: 10 });
      expect(result).toEqual({
        success: false,
        message: "This route already exists, please check!",
      });
    })
  });

  describe("The findBestRoute method", () => {
    it("should find the shortest path between origin and destination points", async () => {
      const routes = await RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
      const routesManager = new RoutesManager(routes, OUTPUT_FILE_TEST);
      const result = routesManager.findBestRoute({ origin: "GRU", destination: "CDG" });
      expect(result).toEqual({
        success: true,
        message: 'GRU - BRC - SCL - ORL - CDG',
        totalCost: 40,
        origin: 'GRU',
        destination: 'CDG'
      })
    })
  });

  describe("The listRoutes method", () => {
    it("should return a JSON object with success = true and all routes loaded from file", async () => {
      const routes = await RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
      const routesManager = new RoutesManager(routes, INPUT_FILE_TEST);
      const result = routesManager.listRoutes();
      expect(result).toEqual({
        success: true,
        routes: [
          { origin: 'GRU', destination: 'BRC', cost: '10' },
          { origin: 'BRC', destination: 'SCL', cost: '5' },
          { origin: 'GRU', destination: 'CDG', cost: '75' },
          { origin: 'GRU', destination: 'SCL', cost: '20' },
          { origin: 'GRU', destination: 'ORL', cost: '56' },
          { origin: 'ORL', destination: 'CDG', cost: '5' },
          { origin: 'SCL', destination: 'ORL', cost: '20' }
        ]
      });
    });
  });
});