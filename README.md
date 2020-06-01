# Rota de Viagem

Esta aplicação tem por objetivo resolver o problema para encontrar a menor rota, ao menor custo, entre dois pontos de uma lista de conexões dada.

A resolução do problema foi desenvolvida em NodeJS. Portanto, é necessário o gerenciador de pacotes *npm*, para instalação de dependências e o NodeJS versão 12 ou superior, para sua execução. Por padrão, a API HTTP através do endereço local http://127.0.0.1:3000.

### Execução do programa

Para executar o programa, primeiro deve-se instalar as suas dependências com o comando

    npm install

Após a instalação, pode-se executar o programa, a partir de seu diretório raiz, com o comando:

    node index.js <input-file>
Ou apenas com

    npm start <input-file>

> Você pode parar a execução do programa a qualquer momento pressionando
> `CTRL+C` ou escrevendo `sair` seguido da tecla `Enter`.

### Execução dos testes

Os testes podem ser executados com o comando:

    npm test

> Você pode parar a execução dos testes a qualquer momento pressionando `CTRL+C`

### Estrutura dos arquivos

O arquivo principal para execução de todo o programa se encontra na raiz do projeto: `index.js`.
A partir deste arquivo, serão carregados os outros módulos/classes. Em seguida, a classe que gerencia a busca, listagem e adição de rotas está localizada em services (`routesManager.service`) e é carregada a partir do `index.js` principal.
A interface console do usuário, é carregado a partir do arquivo `userInput.service.js` na pasta `services`.
Dentro das pastas `config` e `api` temos os módulos responsáveis pela disponibilização de serviços da API Web Rest. Ficando os *controllers* e *router* dentro da pasta API para cada rota e o serviço principal de servidor http em *config*.

### Solução

Para a resolução do problema foi utilizado uma abordagem baseada no Algoritmo de [Dijkstra](https://pt.wikipedia.org/wiki/Algoritmo_de_Dijkstra), em que, fazendo da proposta deste teste análogo a um sistema de grafos, é realizada a *busca em profundidade* procurando pelo menor custo para o destino solicitado, independentemente da quantidade de conexões necessárias. Este algoritmo de busca e as funcionalidades para manutenção do grafo foram centralizadas na classe `RoutesManager`. Dessa forma, as interfaces API Rest e Console do usuário utilizam da `RoutesManager` para realizar as buscas e gerência das rotas de viagem.

### API Rest

As consultas pela API Rest foram implementadas para serem realizadas de forma simples. São ao todo 3 rotas implementadas:

 - Nova Rota: `POST /api/v1/newRoute`
	 - Content-Type: `application/json`
	 - Corpo: `{ "origin": string, "destination": string, "cost": number }`
 - Listar Rotas: `GET /api/v1/listRoutes`
 - Encontrar Rota: `POST /api/v1/findRoute`
	 - Content-Type: `application/json`
	 - Corpo: `{ "origin": string, "destination": string }`

Para `Nova Rota` temos um POST com um JSON contendo as propriedades `origin`, `destination` e `cost` que denominam o ponto de partida, ponto de destino e o custo da rota, respectivamente. O retorno desta solicitação, quando bem sucedida, será um objeto JSON com a propriedade `success: true` e as rotas com a nova rota inserida. Em caso de erro, será retornado o código de erro HTTP 400, com o corpo da mensagem contendo as propriedades `success: false` e `message` contendo o motivo do erro.
Em `Listar Rotas` é realizado apenas um GET que irá retornar um JSON com a propriedade `success: true`e o *array* de rotas, quando bem sucedido, ou irá retornar o código de erro HTTP 400 e as propriedades `success: false` e `message` contendo o motivo do erro.
Por fim, em `Encontrar Rota` também é realizado um POST, com um JSON contendo `origin` e `destination` para informar o caminho a ser buscado. Esta rota, quando bem sucedida, irá retornar um JSON com as propriedades `success: true`, `message` contendo o caminho com menor custo encontrado, `totalCost` com a soma total do percurso, `origin` e `destination` que serão os mesmos informados durante a solicitação. Quando a rota não é encontrada, o JSON de resposta irá conter `success: false`, `message` informando que não existem rotas para esta solicitação, e `origin` e `destination` contém os mesmos dados da solicitação.

