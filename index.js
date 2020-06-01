const RoutesManager = require('./services/routesManager.service');
const UserInput = require('./services/userInput.service');
const routesFileName = process.argv[2];
let routesManager;

function startApi(routesManager) {
  const app = require('./config/express.config')(routesManager);
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  });
}

if (!routesFileName) {
  console.error('Você deve informar o nome do arquivo de rotas que será carregado pelo sistema.');
  console.error('$ node index.js inputFile.txt');
  process.exit(0);
}

RoutesManager.readRoutesFromFileAsync(routesFileName)
  .then(routes => {
    routesManager = new RoutesManager(routes, routesFileName);
    startApi(routesManager);
    const userInput = new UserInput(routesManager);
    userInput.listen();
  })
  .catch(error => console.log(error));
