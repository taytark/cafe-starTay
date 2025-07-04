## 1. Visão Geral da Aplicação

O "cafe-StarTay" é uma aplicação web que permite aos clientes de uma cafeteria escolherem e personalizarem seus cafés. O sistema oferece um menu de ingredientes base e adicionais, identifica se a combinação resulta em um "sabor clássico" e gera um nome e uma descrição para a bebida final. A aplicação é composta por um frontend React.js, um backend Node.js com Express.js, e utiliza PostgreSQL como banco de dados. Toda a infraestrutura é orquestrada via Docker.

## 2. Tecnologias Utilizadas

* **Frontend:** JavaScript (React.js)
* **Backend:** JavaScript (Node.js, Express.js)
* **Banco de Dados:** PostgreSQL
* **Containerização:** Docker, Docker Compose (RQNF2)
* **Testes Automatizados:** Robot Framework (RQNF8, RQNF9)
    * `RequestsLibrary` para testes de API (RQNF8)
    * `SeleniumLibrary` para testes E2E (RQNF9)
* **Testes Unitários (Backend):** Jest, Supertest (RQNF3)
* **Migrations de Banco de Dados:** \backend\src\config\knexfile.js (RQNF7)

## 3. Estrutura do Projeto

A estrutura de diretórios do projeto é organizada para separar as responsabilidades de cada parte da aplicação:
```
cafe-StarTay/qa-pleno-01517-2025-182.483.137-43/
├── backend/                  # Serviço de Backend
├── frontend/                 # Serviço de Frontend
├── tests/                    # Testes Automatizados (Robot Framework)
│   ├── api/                  # Testes de API
│   ├── e2e/                  # Testes End-to-End
│   └── resources/            # Recursos compartilhados (Gherkin features, variáveis)
├── docs/                     # Documentação adicional
├── .env.example              # Exemplo de variáveis de ambiente para Docker Compose
├── docker-compose.yml        # Configuração Docker para desenvolvimento
├── docker-compose.test.yml   # Configuração Docker para ambiente de testes
├── README.md                 # Documentação principal
├── .gitignore                # Arquivos/pastas ignorados pelo Git
```

## 4. Como Executar a Aplicação (Ambiente de Desenvolvimento)

### Pré-requisitos

* Docker Desktop (inclui Docker Engine e Docker Compose) instalado.
* Conexão à internet para baixar as imagens Docker e dependências.

### Passos

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/SENAI-SD/qa-pleno-01517-2025-182.483.137-43.git
    ```

2.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` na **raiz** do projeto e preencha-o com base no `.env.example`

3.  **Construir e Iniciar os Serviços Docker:**
    ```bash
    # Acesse a pasta /qa-pleno-01517-2025-182.483.137-43 e execute o comando:

    docker-compose up --build -d
    ```
    * O `--build` garante que as imagens sejam construídas (ou reconstruídas se houver mudanças).
    * O `-d` executa os serviços em segundo plano (detached mode).

4.  **Executar Migrations e Seeds do Banco de Dados:** (RQNF7)
    Após os contêineres estarem em execução, você precisa aplicar as migrations para criar as tabelas e popular o banco de dados com dados iniciais.
    ```bash
    # Acesse o Docker Desktop, abra o terminal e execute os comandos:

    docker-compose exec backend bash

    # Ainda no terminal do docker desktop, execute as migrations e seeds:
    knex migrate:latest
    knex seed:run

    # Saia do contêiner
    exit
    ```
    * **Importante:** Este passo só precisa ser feito uma vez

5.  **Acessar a Aplicação:**
    * **Frontend (UI):** Abra seu navegador e acesse `http://localhost:8080`

    * **Backend API (Exemplo):** Para testar o backend diretamente, acesse `http://localhost:3001/api/ingredients` em seu navegador ou ferramenta API (Postman/Insomnia).

## 5. Documentação de Testes e Qualidade

### 5.1. Testes Unitários (Backend)

* **Localização:** `backend/tests/` (Arquivo como `coffeeController.test.js`)
* **Descrição:** Os testes unitários focam na validação das regras de negócio críticas do backend. Eles verificam a lógica de identificação de sabores clássicos, a validação de limites de ingredientes e a composição final do café, garantindo que as funções individuais operem conforme o esperado.
* **Tecnologias:** Jest, Supertest.
* **Execução:**
    ```bash
    # Para rodar os testes unitários do backend (fora do Docker, localmente)
    cd backend
    npm install
    npm test
    ```

### 5.2. Testes Automatizados (Robot Framework)

Os testes automatizados são divididos em testes de API e testes E2E, utilizando o Robot Framework.

#### 5.2.1. Configuração do Ambiente de Testes Docker

Para executar os testes automatizados, utilize um ambiente Docker Compose separado para testes:

1.  **Certifique-se de que o ambiente de desenvolvimento não está rodando:**
    ```bash
    # Acesse a pasta /qa-pleno-01517-2025-182.483.137-43 e execute o comando: 

    docker-compose down
    ```
2.  **Inicie o ambiente de teste:**
    ```bash
    # Acesse a pasta /qa-pleno-01517-2025-182.483.137-43 e execute o comando:
    
    docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
    ```
    * Este comando construirá as imagens de teste (`backend-test`, `frontend-test`, `db-test`, `robot-tests`).
    * O serviço `robot-tests` executará o `entrypoint.sh` ao iniciar, que por sua vez, aplicará as migrations e seeds no banco de dados de teste e, então, executará a suíte de testes Robot Framework.
    * O `--abort-on-container-exit` fará com que o Docker Compose pare todos os serviços se o contêiner de testes falhar (indicando falhas nos testes).

3.  **Visualizar os Resultados:**
    Após a execução, os relatórios de teste do Robot Framework (html, log, xml) estarão disponíveis na pasta `tests/`.

#### 5.2.2. Testes de API (RQNF8)

* **Localização:** `tests/api/`
    * `keywords.robot`: Contém as palavras-chave reutilizáveis para interações com a API.
    * `ingredients.robot`: Testes para o endpoint `GET /api/ingredients`.
    * `build_coffee.robot`: Testes para o endpoint `POST /api/build-coffee`.
* **Descrição:** Validam os endpoints do backend, verificando respostas HTTP (RQNF5), validações de requisição e a lógica de negócio de forma isolada, sem depender da interface do usuário.
* **Tecnologias:** Robot Framework, `RequestsLibrary`.

#### 5.2.3. Testes End-to-End (E2E) (RQNF9)

* **Localização:** `tests/e2e/`

    * `keywords.robot`: Contém as palavras-chave reutilizáveis para interações com a UI.
    * `basic_selection.robot`: Testes para o fluxo básico de seleção de ingredientes.
    * `classic_identification.robot`: Testes para a identificação de cafés clássicos na UI.
    * `additional_ingredients.robot`: Testes para a adição de ingredientes extras e validações.
* **Descrição:** Simulam as interações do usuário com a interface do frontend, verificando o fluxo completo da aplicação (da seleção à confirmação), integrando backend e frontend.
* **Tecnologias:** Robot Framework, `SeleniumLibrary`.

### 5.3. Especificações de Uso (Gherkin) (RQNF13)

* **Localização:** `tests/resources/features/`

    * `customer_builds_macchiato.feature`
    * `customer_builds_custom_coffee.feature`
    * `customer_adds_too_many_additions.feature`
* **Descrição:** As funcionalidades e cenários-chave da aplicação são descritos em Gherkin, uma linguagem de domínio específico (DSL) que permite a colaboração entre as partes interessadas (negócio, desenvolvimento, QA). Isso garante que todos tenham um entendimento comum do comportamento esperado do sistema.

### 5.4. Plano de Testes (RQNF14, RQNF15, RQNF16)

* **Localização:** `docs/TestPlan.md`
* **Descrição:** Um plano de testes detalhado que descreve a abordagem, escopo, tipos de testes e estratégia para garantir a qualidade da aplicação "cafe-StarTay".

### 5.5. Relatório de Bug Identificado (Funcional Manual) (RQNF17)

* **Título:** Botão "Confirmar Seleção" não desabilita visualmente quando não há ingredientes base selecionados.
* **Descrição:** Durante testes funcionais manuais, foi observado que o botão "Confirmar Seleção" permanece clicável mesmo quando nenhum ingrediente base foi selecionado, contrariando a expectativa de feedback visual imediato para ações inválidas (RN-G02.2). Embora a validação no backend impeça a requisição e exiba uma mensagem de erro, a interface não impede proativamente a tentativa do usuário.
* **Passos para Reproduzir:**
    1.  Acesse a aplicação "cafe-StarTay" pelo frontend.
    2.  Não selecione nenhum ingrediente base na seção "Selecione os ingredientes base".
    3.  Observe o estado do botão "Confirmar Seleção". Ele estará habilitado.
    4.  Clique no botão "Confirmar Seleção".
* **Resultado Esperado:** O botão "Confirmar Seleção" deveria estar desabilitado (cinza e não clicável) se nenhum ingrediente base fosse selecionado, conforme o critério de impedir a ação inválida do RN-G02.2.
* **Resultado Atual:** O botão está habilitado e, ao ser clicado, a aplicação exibe uma mensagem de erro abaixo ("Selecione pelo menos um ingrediente base...") sem desabilitar o botão.
* **Prioridade:** Média. Afeta a usabilidade, mas a validação no backend previne o processamento de dados incorretos.

### 5.6. Requisitos Não Atendidos e Justificativa (RQNF18)

Apesar dos esforços para atender a todos os requisitos, alguns pontos não puderam ser totalmente implementados dentro do escopo e tempo do estudo de caso:

* **RQNF12 - Diferencial (Utilização de SonarQube):** Não foi possível integrar e fornecer um relatório do SonarQube. A configuração de um servidor SonarQube e sua integração em um pipeline de CI/CD para análise estática de código demandaria um tempo de setup considerável que extrapolaria o limite da avaliação prática. Em um projeto real, esta seria uma ferramenta prioritária para monitorar a qualidade do código a longo prazo, e os pontos de ajuste apontados pelo SonarQube seriam priorizados por maior benefício com menor risco.
* **RN005.4 - Opcional (Exibição Dinâmica do Preço Total na UI):** O backend calcula e retorna o `totalPrice`. No entanto, o frontend exibe o preço apenas na seção de resumo final do café. Não foi implementada uma atualização dinâmica do preço na interface do usuário a cada seleção de ingrediente (preço parcial), o que seria um diferencial de usabilidade.

## 6. Boas Práticas Adotadas

* **Versionamento:** Uso de Git para controle de versão, com commits descritivos.
* **Qualidade do Código:**
    * **Divisão de Responsabilidades:** Arquitetura clara entre frontend, backend e banco de dados. Componentes e módulos com responsabilidades únicas.

    * **Reutilização de Código:** Componentes React (`IngredientSelector`, `CoffeeSummary`) e palavras-chave do Robot Framework (`keywords.robot`) são reutilizáveis.

    * **Complexidade Ciclomática e Cognitiva:** Esforço para manter funções e métodos concisos e legíveis, evitando blocos de código excessivamente complexos.

* **Boas Práticas de Segurança (Básicas):** (RQNF4, RQNF5)
    * O backend não permite acesso público direto aos recursos sensíveis; o acesso é via endpoints da API.
    * Retorno de códigos HTTP apropriados para as respostas.
    * Tratamento de erros no frontend para respostas do backend.
    * Uso de variáveis de ambiente para credenciais de banco de dados, evitando hardcoding.

## 7. Possíveis Melhorias Futuras (RQNF11)

Com base na revisão do código e nas boas práticas, as seguintes melhorias poderiam ser implementadas:

1.  **Validação de Esquema (Backend):** Implementar bibliotecas de validação de esquema (ex: Joi, Yup) para validar o corpo das requisições recebidas pelo backend. Isso adicionaria uma camada robusta de segurança e garantiria que apenas dados bem-formados sejam processados.
2.  **Autenticação e Autorização:** Para um sistema de cafeteria mais complexo (ex: para funcionários ou gerenciamento de cardápio), seria essencial implementar autenticação (ex: JWT) e autorização (controle de acesso baseado em papéis).
3.  **Internacionalização (i18n):** Adicionar suporte a múltiplos idiomas no frontend e backend, permitindo que a aplicação seja utilizada por clientes de diferentes nacionalidades.
4.  **Testes de Performance e Carga:** Implementar testes de performance para avaliar a capacidade do backend de lidar com um grande número de requisições simultâneas e identificar gargalos.
5.  **Notificações ao Usuário:** Melhorar o feedback visual ao usuário com toasts ou modais para mensagens de sucesso, erro ou informações, além do texto simples.
6.  **Otimização de Imagens/Recursos no Frontend:** Para um aplicativo real, otimizar o carregamento de imagens e outros recursos para melhorar o desempenho e o tempo de carregamento da página.
7.  **CI/CD Pipeline:** Configurar um pipeline de Integração Contínua e Entrega Contínua (CI/CD) para automatizar o processo de build, testes (unitários, API, E2E) e deploy. Isso garantiria que cada alteração no código seja testada e integrada automaticamente, resultando em entregas mais rápidas e com menos erros.

---

Agradeço a oportunidade. Fico à disposição para quaisquer esclarecimentos.
