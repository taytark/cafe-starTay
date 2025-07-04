#!/bin/bash
set -e

DB_WAIT_HOST=${DB_HOST}
DB_WAIT_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_NAME=${DB_NAME}
DB_PASSWORD=${DB_PASSWORD} # 

export PGPASSWORD="${DB_PASSWORD}"

# 1. Aguardar o serviço do PostgreSQL (servidor) estar disponível
echo "Aguardando o serviço de banco de dados ${DB_WAIT_HOST}:${DB_WAIT_PORT}..."
/usr/local/bin/wait-for-it.sh "${DB_WAIT_HOST}:${DB_WAIT_PORT}" --timeout=60 --strict -- echo "Servidor de banco de dados está disponível."

# 2. Criar o banco de dados específico da aplicação se ele não existir
echo "Verificando e criando o banco de dados '${DB_NAME}' se necessário..."
sleep 5 # Pequeno atraso para garantir que o DB esteja pronto para conexões psql
/usr/bin/psql -h "${DB_WAIT_HOST}" -p "${DB_WAIT_PORT}" -U "${DB_USER}" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || \
/usr/bin/psql -h "${DB_WAIT_HOST}" -p "${DB_WAIT_PORT}" -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${DB_NAME}"
echo "Banco de dados '${DB_NAME}' assegurado."

# 3. Agora, aguardar o banco de dados específico da aplicação estar pronto para conexões
echo "Aguardando o banco de dados '${DB_NAME}' estar pronto para conexões..."
/usr/local/bin/wait-for-it.sh "${DB_WAIT_HOST}:${DB_WAIT_PORT}" -t 30 -- /usr/bin/psql -h "${DB_WAIT_HOST}" -p "${DB_WAIT_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "\q"
echo "Banco de dados '${DB_NAME}' está pronto."

# Remover PGPASSWORD do ambiente para não vazar para processos futuros (boa prática de segurança)
unset PGPASSWORD

echo "Navegando para o diretório raiz da aplicação..."
cd /app/

echo "Executando migrations do banco de dados..."
knex --knexfile knexfile.js migrate:latest --env $NODE_ENV

echo "Executando seeds do banco de dados..."
knex --knexfile knexfile.js seed:run --env $NODE_ENV

echo "Iniciando a aplicação Node.js..."
exec npm start