const request = require('supertest');
const RoutesManager = require('../services/routesManager.service');
const INPUT_FILE_TEST = "./input-file-test.txt"
const OUTPUT_FILE_TEST = "./output-file-test.txt"

describe('GET /listRoutes', () => {
  it('should list all routes', async (done) => {
    const routes = await RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
    const routesManager = new RoutesManager(routes, OUTPUT_FILE_TEST);
    const app = require('./express.config')(routesManager);

    request(app)
      .get('/api/v1/listRoutes')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should throw a error on list undefined routes', async (done) => {
    const routesManager = new RoutesManager(undefined, OUTPUT_FILE_TEST);
    const app = require('./express.config')(routesManager);

    request(app)
      .get('/api/v1/listRoutes')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});

describe('POST /findRoute', () => {
  it('should find the route', async (done) => {
    const routes = await RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
    const routesManager = new RoutesManager(routes, OUTPUT_FILE_TEST);
    const app = require('./express.config')(routesManager);

    request(app)
      .post('/api/v1/findRoute')
      .send({ origin: "GRU", destination: "CDG" })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should do not find the route', async (done) => {
    const routes = await RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
    const routesManager = new RoutesManager(routes, OUTPUT_FILE_TEST);
    const app = require('./express.config')(routesManager);

    request(app)
      .post('/api/v1/findRoute')
      .send({ origin: "GRU", destination: "ZZZ" })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});

describe('GET /newRoute', () => {
  it('should add a new route', async (done) => {
    const routes = await RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
    const routesManager = new RoutesManager(routes, OUTPUT_FILE_TEST);
    const app = require('./express.config')(routesManager);

    request(app)
      .post('/api/v1/newRoute')
      .send({ origin: "SCL", destination: "CDG", cost: 10 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should throw a error on adding a existent route', async (done) => {
    const routes = await RoutesManager.readRoutesFromFileAsync(INPUT_FILE_TEST);
    const routesManager = new RoutesManager(routes, OUTPUT_FILE_TEST);
    const app = require('./express.config')(routesManager);

    request(app)
      .post('/api/v1/newRoute')
      .send({ origin: "GRU", destination: "CDG", cost: 10 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });
});

