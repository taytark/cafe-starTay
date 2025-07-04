const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRoutes);

// RQNF5 - Todo retorno do backend deverá retornar um código HTTP de acordo com a resposta do servidor.
// RQNF6 - O frontend deve tratar todos os erros retornados pelo backend.
app.use((err, req, res, next) => {
  console.error("Erro no backend:", err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Ocorreu um erro interno no servidor.";

  res.status(statusCode).json({
    success: false,
    message: message,
    details: process.env.NODE_ENV ? err.stack : undefined,
  });
});

module.exports = app;
