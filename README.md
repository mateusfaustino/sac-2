# SAC - Guia de Execução

Este repositório contém uma aplicação Laravel com frontend em Vite/Inertia. Abaixo você encontra o passo a passo para preparar o ambiente e colocar o sistema em funcionamento no seu computador.

## Pré-requisitos

### Utilizando Docker (recomendado)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ou Docker Engine 24+
- Docker Compose 2+

### Ambiente local sem Docker
- PHP 8.2 ou superior com extensões `bcmath`, `ctype`, `fileinfo`, `json`, `mbstring`, `openssl`, `pdo`, `tokenizer` e `xml`
- [Composer](https://getcomposer.org/)
- Node.js 18+ e npm ou yarn
- Servidor MySQL 8.0
- Redis (opcional, mas recomendado para filas e cache)

## Passo a passo com Docker

1. **Clone o projeto**
   ```bash
   git clone <url-do-repositorio>
   cd sac
   ```

2. **Crie o arquivo de variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   Ajuste as variáveis conforme o seu contexto se necessário. Os valores padrões já são compatíveis com o `docker-compose.yml` incluído.

3. **Suba os containers**
   ```bash
   docker compose up -d --build
   ```
   Este comando cria os serviços de aplicação, Nginx, MySQL, Redis e phpMyAdmin.

4. **Instale as dependências PHP**
   ```bash
   docker compose exec app composer install
   ```

5. **Gere a chave da aplicação**
   ```bash
   docker compose exec app php artisan key:generate
   ```

6. **Instale as dependências de frontend**
   ```bash
   docker compose exec app npm install
   ```

7. **Execute as migrações (e seeds, se disponíveis)**
   ```bash
   docker compose exec app php artisan migrate --seed
   ```
   Caso não deseje popular a base com seeds, remova a opção `--seed`.

8. **Inicie o Vite (hot reload) ou faça o build**
   ```bash
   # Para desenvolvimento com recarregamento automático
   docker compose exec app npm run dev

   # Para gerar os assets de produção
   docker compose exec app npm run build
   ```

9. **Acesse a aplicação**
   - Aplicação web: [http://localhost:8000](http://localhost:8000)
   - phpMyAdmin: [http://localhost:8080](http://localhost:8080) (usuário e senha definidos em `.env`)
   - Banco MySQL exposto na porta `3300` caso queira conectar uma ferramenta externa.

10. **Encerrando o ambiente**
    ```bash
    docker compose down
    ```
    Use `docker compose down -v` para remover também os volumes persistentes do banco de dados.

## Execução manual (sem Docker)

1. Crie o arquivo `.env` com base no `.env.example` e configure a conexão com a base de dados local.
2. Instale as dependências PHP com `composer install`.
3. Gere a chave da aplicação com `php artisan key:generate`.
4. Instale as dependências de frontend com `npm install`.
5. Execute `php artisan migrate --seed` para preparar o banco.
6. Inicie o servidor Laravel (`php artisan serve`) e o Vite (`npm run dev`).
7. Acesse o sistema em `http://localhost:8000` (ou na URL definida pelo `php artisan serve`).

## Ferramentas auxiliares

- **Filas e logs**: utilize `php artisan queue:listen` e `php artisan pail` para monitorar filas e logs em tempo real.
- **Testes automatizados**: rode `php artisan test` para executar a suíte de testes.

Pronto! Após seguir os passos acima o sistema estará disponível localmente para desenvolvimento.
