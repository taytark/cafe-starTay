#!/bin/bash

echo "Aguardando o banco de dados de teste ficar disponível..."
/usr/bin/wait-for-it.sh db-test:5432 --timeout=60 --strict -- echo "Banco de dados de teste está disponível."

# Navega para o diretório onde o knexfile.js está copiado
cd /app/backend/

echo "Executando migrations do banco de dados de teste..."
# KNEX_ENV=test garante que o ambiente 'test' do knexfile.js seja usado
knex --knexfile knexfile.js migrate:latest --env test

echo "Executando seeds do banco de dados de teste..."
knex --knexfile knexfile.js seed:run --env test

# Retorna ao diretório de trabalho original para rodar os testes
cd /app/

echo "Iniciando execução dos testes Robot Framework..."
# Executa todos os testes dentro da pasta 'tests'
robot tests/

echo "Execução de testes finalizada."