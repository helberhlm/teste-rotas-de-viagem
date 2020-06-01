module.exports = class UserInput {
  constructor(routesManager) {
    this.routesManager = routesManager;
    const readline = require('readline');
    this.input = readline.createInterface(process.stdin, process.stdout);
  }

  printRouteResult({ origin, destination }) {
    console.log("Checking best route, wait...")
    const result = this.routesManager.findBestRoute({ origin, destination });
    if (result.success) {
      console.log(`best route: ${result.message} > $${result.totalCost}\n`);
    } else {
      console.error(result.message, '\n');
    }
  }

  parseInput(line) {
    const command = line.trim();
    switch (command) {
      case 'sair':
        console.log('Bye!');
        process.exit(0);
      default:
        const [origin, destination] = command.split('-');
        this.printRouteResult({ origin, destination });
        break;
    }
    this.input.prompt();
  }

  listen() {
    this.input.setPrompt(`Para calcular a menor rota, insira a origem e destino no seguinte formato:\nDE-PARA ou escreva 'sair' para finalizar o programa\n> `);
    this.input.prompt();

    this.input
      .on('line', line => this.parseInput(line))
      .on('close', function () {
        console.log('Bye!');
        process.exit(0);
      });
  }
}
