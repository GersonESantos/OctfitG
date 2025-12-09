# OctfitG

### Visão Geral

A pasta `C:\Repo2024\OctfitG\02` contém um projeto full-stack, dividido em duas partes principais: `client` (o frontend) e `server` (o backend).

### `client/` (Frontend)

O cliente é### Visão Geral

A pasta `C:\Repo2024\OctfitG\02` contém um projeto full-stack, dividido em duas partes principais: `client` (o frontend) e `server` (o backend).

### `client/` (Frontend)

O cliente é uma aplicação web moderna construída com **React** e **Vite**.

*   ****: Define as dependências do projeto, que incluem `react` e `react-dom`. As dependências de desenvolvimento incluem `@vitejs/plugin-react` para a integração com o React, `typescript` para o suporte a TypeScript e `vite` como a ferramenta de build e servidor de desenvolvimento.
*   ****: É o componente principal da aplicação React. Ele é responsável por buscar o status de saúde da API do backend no endpoint  e exibir o resultado na tela.
*   ****: Este é o ponto de entrada da aplicação React. Ele renderiza o componente  na página HTML.
*   **`index.html`**: O arquivo HTML principal que serve como a base para a aplicação React.

### `server/` (Backend)

O servidor é uma API RESTful construída com **Node.js** e o framework **Express**.

*   ****: Lista as dependências do servidor, como  para criar o servidor web e  para permitir requisições de origens diferentes (como o cliente React rodando em outra porta). As dependências de desenvolvimento incluem `ts-node-dev` para reiniciar o servidor automaticamente durante o desenvolvimento e `typescript`.
*   ****: O arquivo principal do servidor. Ele configura um servidor Express, habilita o CORS e define as seguintes rotas da API:
    *   : Retorna o status atual e a hora do servidor.
    *   `GET /api/hello`: Retorna uma mensagem de saudação.
    *   **CRUD de Treinos**: Um conjunto completo de rotas (GET, POST, PUT, DELETE) em `/api/workouts` para criar, ler, atualizar e deletar registros de treinos.
*   ****: Este arquivo atua como uma camada de acesso a dados. Ele gerencia a leitura e a escrita dos dados dos treinos em um arquivo JSON (). Ele exporta funções para realizar as operações de CRUD: , , , , e .
*   ****: O "banco de dados" da aplicação. É um arquivo JSON simples que armazena a lista de treinos.

### 

Um arquivo de documentação simples com o título do projeto, "OctfitG".

### Resumo

Em suma, o diretório  contém uma aplicação web completa e funcional. O frontend em React consome os dados de uma API de backend em Express. O backend, por sua vez, gerencia uma lista de treinos armazenada em um arquivo JSON, implementando todas as operações básicas de um CRUD.