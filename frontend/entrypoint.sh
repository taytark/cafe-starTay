#!/bin/bash
set -e
echo "Aguardando o serviço de backend backend:3001..."
/usr/local/bin/wait-for-it.sh backend:3001 --timeout=60 --strict -- echo "Serviço de backend está disponível."
echo "Iniciando Nginx..."
exec nginx -g "daemon off;"