***Settings***
# Importa bibliotecas para funcionalidades comuns ou extensões
Library    OperatingSystem    # Para interações com o sistema operacional

***Variables***
# Variáveis de URL para os serviços (backend e frontend)
# Estas variáveis serão sobrescritas pelo docker-compose.test.yml para o ambiente de teste
${API_BASE_URL}     http://backend-test:3001/api
${FRONTEND_BASE_URL} http://frontend-test:80

# Variáveis de navegador para testes E2E
${BROWSER_NAME}     Chrome
${IMPLICIT_WAIT}    5s
${EXPLICIT_WAIT}    10s