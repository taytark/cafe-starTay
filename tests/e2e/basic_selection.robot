***Settings***
Resource    ../resources/common_variables.robot
Resource    keywords.robot
Test Setup    Abrir Aplicacao Construtor De Cafe    ${FRONTEND_BASE_URL}
Test Teardown    Fechar Navegador

***Test Cases***
Cenario: Deve Permitir Selecionar Ingredientes Base
    [Documentation]    Verifica a capacidade de selecionar e deselecionar ingredientes base.
    [Tags]    E2E    UI    Selecao    RF001    RN001.2    RN001.4

    Verificar Botao Habilitado    Confirmar Seleção
    Selecionar Ingrediente    Espresso
    Selecionar Ingrediente    Leite
    Page Should Contain    Espresso
    Page Should Contain    Leite
    # Deselecionar um ingrediente
    Selecionar Ingrediente    Espresso
    Page Should Not Contain    Espresso

Cenario: Deve Exibir Mensagem De Erro Ao Tentar Confirmar Sem Ingredientes Base
    [Documentation]    Verifica a validação da interface para a seleção mínima de ingredientes base (RN001.3).
    [Tags]    E2E    UI    Validacao    RN001.3    RN-G02.2

    Confirmar Selecao De Base
    Verificar Mensagem De Erro Exibida    Selecione pelo menos um ingrediente base para montar seu café.
    # O botão permanece habilitado conforme o bug reportado no README.md
    Verificar Botao Habilitado    Confirmar Seleção

Cenario: Deve Limpar A Selecao De Cafe Ao Clicar Em Limpar Selecao
    [Documentation]    Verifica a funcionalidade de reset da aplicação (RN-G03.2).
    [Tags]    E2E    UI    Reset    RN-G03.2

    Selecionar Ingrediente    Espresso
    Selecionar Ingrediente    Leite
    Selecionar Ingrediente    Caramelo
    Confirmar Selecao De Base # Opcional para preencher o resumo

    Limpar Selecao De Cafe

    Verificar Nao Contem Texto    Espresso
    Verificar Nao Contem Texto    Leite
    Verificar Nao Contem Texto    Caramelo
    Verificar Nao Contem Texto    Sabor clássico reconhecido
    Verificar Nao Contem Texto    Ingredientes: