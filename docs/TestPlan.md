# Plano de Testes - Projeto cafe-StarTay

## 1. Introdução

Este documento detalha o plano de testes para a aplicação "cafe-StarTay", um sistema de customização de cafés. O objetivo principal deste plano é descrever a abordagem de testes, o escopo, os tipos de testes a serem executados e as prioridades para garantir a qualidade do software entregue.

## 2. Escopo do Teste

O escopo dos testes abrange as funcionalidades do backend (API) e do frontend (UI), conforme os Requisitos Funcionais (RF) e Requisitos Não Funcionais (RQNF) definidos no estudo de caso.

### 2.1. Funcionalidades a Serem Testadas

* **RF001: Selecionar Ingredientes Base**: Testar a capacidade do usuário de escolher um ou mais ingredientes base e as validações mínimas (RN001.3).
* **RF002: Identificar Sabor Clássico de Café**: Verificar se o sistema compara corretamente a combinação de ingredientes base com as receitas clássicas (RN002.1, RN002.2) e comunica o reconhecimento (RN002.3, RN002.4, RN002.5).
* **RF003: Selecionar Ingredientes Adicionais**: Testar a adição de ingredientes extras e as validações de limite (RN003.3).
* **RF004: Gerar Nome e Descrição do Café Final**: Validar a correta geração do nome descritivo e da lista completa de ingredientes.
* **RF005: Visualizar Resumo do Café Personalizado**: Verificar a atualização dinâmica e a exibição correta do resumo do café, incluindo nome, ingredientes e preço (RN005.1, RN005.2, RN005.3, RN005.4 - opcional).
* **RF006: Confirmar Pedido do Café**: Testar a disponibilidade e funcionalidade do botão de confirmação do pedido.

### 2.2. Requisitos Não Funcionais a Serem Verificados

* **RQNF1: Linguagem Orientada a Objeto**: Verificação da implementação em Java, PHP ou Javascript (verificado por revisão de código).
* **RQNF2: Execução via Docker**: Verificação da correta configuração e execução em contêineres Docker distintos.
* **RQNF3: Testes Unitários**: Verificação da existência e cobertura de testes unitários para regras de negócio no backend.
* **RQNF4: Acesso ao Backend**: Verificação de que o acesso ao backend não permite acesso público direto e é feito via API controlada.
* **RQNF5: Retorno HTTP do Backend**: Verificação de que o backend retorna códigos HTTP apropriados.
* **RQNF6: Tratamento de Erros Frontend**: Verificação de que o frontend trata e exibe erros retornados pelo backend.
* **RQNF7: Migrations de Banco de Dados**: Verificação da utilização de migrations para a estrutura do DB.
* **RQNF8: Testes de API Automatizados**: Verificação da existência e execução de testes de API.
* **RQNF9: Testes E2E Automatizados**: Verificação da existência e execução de testes E2E.
* **RQNF10: Arquivo README**: Verificação da existência e conteúdo adequado do README.
* **RQNF11: Revisão de Código e Melhorias**: Verificação da documentação de revisão e melhorias no README.
* **RQNF13: Gherkin Specifications**: Verificação da existência e localização das especificações Gherkin.
* **RQNF14: Plano de Testes**: Este próprio documento.
* **RQNF17: Relatório de Bug Funcional**: Verificação da inclusão de um relatório de bug funcional manual no README.
* **RQNF18: Requisitos Não Atendidos**: Verificação da documentação de requisitos não atendidos no README.
* **RN-G02: Feedback ao Usuário**: Verificação de mensagens claras e não intrusivas, e impedimento de ações inválidas na UI.
* **RN-G03: Estado da Aplicação**: Verificação da manutenção do estado e da opção de limpar seleção.

## 3. Estratégia de Testes

A estratégia de testes será baseada em uma abordagem em pirâmide, com ênfase em testes automatizados e complementada por testes manuais.

### 3.1. Testes de Caixa Branca (RQNF15)

* **Testes Unitários (Backend)**:
    * **Onde:** `backend/tests/` (Jest/Supertest).
    * **Foco:** Testar isoladamente as funções e métodos do backend que implementam as regras de negócio críticas (ex: lógica de identificação de sabor clássico, validação de limite de ingredientes). Garantir que cada unidade de código funcione conforme o esperado.
    * **Cobertura:** Priorizar a cobertura de código para a lógica central do `coffeeController`.

* **Revisão de Código (RQNF11)**:
    * **Onde:** Processo contínuo de revisão durante o desenvolvimento.
    * **Foco:** Análise da complexidade ciclomática e cognitiva, divisão de responsabilidades das classes, reutilização de código e aderência a boas práticas de segurança e versionamento. Os resultados são reportados no `README.md`.

### 3.2. Testes de Caixa Preta (RQNF15)

* **Testes de API Automatizados (Integração/Componente)**:
    * **Onde:** `tests/api/` (Robot Framework com RequestsLibrary).
    * **Foco:** Validar a correta comunicação entre o cliente (neste caso, o próprio teste) e os endpoints do backend. Verificar os status HTTP retornados (RQNF5), a estrutura dos dados JSON, e se as regras de negócio (RNs) são aplicadas corretamente pela API.
    * **Casos:** Testar cenários de sucesso e falha para cada endpoint (ex: `GET /ingredients`, `POST /build-coffee`).

* **Testes E2E Automatizados (End-to-End)**:
    * **Onde:** `tests/e2e/` (Robot Framework com SeleniumLibrary).
    * **Foco:** Simular a jornada completa do usuário na interface do frontend, desde a seleção de ingredientes até a visualização do resumo do café. Validar a integração entre frontend e backend e a experiência geral do usuário (RQNF38).
    * **Casos:** Testar cenários de ponta a ponta que cobrem os requisitos funcionais principais.

* **Testes Funcionais Manuais (Exploratórios)**:
    * **Onde:** Execução manual na interface do usuário.
    * **Foco:** Complementar os testes automatizados, explorando cenários não previstos, validando a usabilidade e identificando bugs visuais ou de fluxo que podem ser difíceis de automatizar. O bug reportado no `README.md` (`RQNF17`) é um exemplo de resultado deste tipo de teste.

## 4. Categorias de Testes Executadas (RQNF16)

As seguintes categorias de testes foram (ou serão) executadas no projeto:

* **Testes Funcionais**:
    * Verificação da correta implementação de todas as funcionalidades de seleção, customização, reconhecimento e resumo do café. (RF001 a RF006).
* **Testes de Usabilidade**:
    * Foco na experiência do usuário na interface, clareza das mensagens de feedback e intuitividade (RN-G02, RN-G03, RQNF38).
* **Testes de Integração**:
    * Verificação da comunicação entre os módulos do sistema (frontend-backend, backend-database). Os testes de API e E2E atuam como testes de integração.
* **Testes de Regressão**:
    * Execução contínua dos testes automatizados (unitários, API, E2E) para garantir que novas funcionalidades ou alterações não introduzam bugs em funcionalidades existentes.
* **Testes de Segurança (Básicos)**:
    * Verificação de que o backend não permite acesso público direto a dados sensíveis (RQNF4) e que o tratamento de erros é adequado (RQNF5, RQNF6).
* **Testes de Banco de Dados**:
    * Verificação da correta aplicação das migrations e da integridade dos dados inseridos/consultados.

## 5. Prioridades e Estratégia de Curto Prazo (RQNF14)

Para entregar a aplicação com a maior cobertura possível a curto prazo, a seguinte estratégia foi adotada e priorizada:

1.  **Testes Automatizados (Unitários, API e E2E) - Prioridade Máxima:**
    * **Objetivo:** Garantir a estabilidade e a corretude das funcionalidades principais e das regras de negócio mais críticas.
    * **Execução:** Implementação robusta e contínua execução destes testes durante todo o ciclo de desenvolvimento. O ambiente Docker de testes facilita a execução rápida e confiável.
    * **Benefício:** Rápido feedback sobre a introdução de bugs, alta cobertura de regressão e validação da integração entre as camadas.

2.  **Validações de Requisitos Não Funcionais Críticos - Alta Prioridade:**
    * **Objetivo:** Assegurar que requisitos como Dockerização (RQNF2), uso de Migrations (RQNF7), tratamento de erros (RQNF5, RQNF6) e feedback ao usuário (RN-G02) sejam atendidos.
    * **Execução:** Verificação via testes automatizados (onde aplicável) e revisão de código.

3.  **Testes Exploratórios e Manuais de Usabilidade - Média Prioridade:**
    * **Objetivo:** Complementar os testes automatizados, focando na experiência do usuário, na intuitividade da interface e na descoberta de bugs que podem ser complexos de automatizar inicialmente.
    * **Execução:** Realizados por QA ou desenvolvedores, com registro de bugs identificados (RQNF17).

4.  **Otimização de Testes e Cobertura - Média a Baixa Prioridade Inicialmente:**
    * **Objetivo:** Aumentar a cobertura de testes para cenários de borda e otimizar a velocidade de execução dos testes.
    * **Execução:** Refinamento dos testes existentes e criação de novos testes após as funcionalidades principais estarem estáveis.

## 6. Ferramentas Utilizadas

* **Automação de Testes:** Robot Framework (com `RequestsLibrary` e `SeleniumLibrary`)
* **Testes Unitários:** Jest, Supertest
* **BDD:** Gherkin (`.feature` files)
* **Gerenciamento de DB:** Knex.js (para migrations e seeds)
* **Ambiente:** Docker, Docker Compose

---

Este plano de testes fornece um roteiro claro para a garantia da qualidade do projeto "cafe-StarTay".