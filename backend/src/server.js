// backend/src/server.js
require("dotenv").config(); // Carrega as variáveis de ambiente do .env

const app = require("./app");
const knex = require("knex");
const knexConfig = require("../knexfile");

// Determina o ambiente atual (desenvolvimento, teste, produção)
// Adicionado fallback para 'development' caso NODE_ENV não esteja definido
const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

// Adicionado fallback para 3001 caso PORT não esteja definido
const PORT = process.env.PORT || 3001;

// Verifica a conexão com o banco de dados antes de iniciar o servidor
db.raw("SELECT 1")
  .then(() => {
    console.log(
      `Conexão com o banco de dados PostgreSQL (${environment}) estabelecida com sucesso!`
    );
    app.listen(PORT, () => {
      console.log(`Backend cafe-StarTay rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar com o banco de dados:", err.message);
    // Adicionado err.stack para depuração em ambiente de desenvolvimento
    console.error("Detalhes do erro:", err.stack);
    console.error(
      "Verifique suas configurações de banco de dados e se o serviço está ativo."
    );
    process.exit(1); // Encerra o processo se não conseguir conectar ao DB
  });