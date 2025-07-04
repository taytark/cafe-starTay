***Settings***
Resource    ../resources/common_variables.robot
Resource    keywords.robot
Test Setup    Abrir Aplicacao Construtor De Cafe    ${FRONTEND_BASE_URL}
Test Teardown    Fechar Navegador

***Test Cases***
Cenario: Deve Adicionar Ingredientes Adicionais E Atualizar Resumo
    [Documentation]    Verifica a adição de ingredientes adicionais e a atualização do resumo (RF003, RF005).
    [Tags]    E2E    UI    Adicionais    RF003    RF005

    Selecionar Ingrediente    Espresso
    Confirmar Selecao De Base
    Verificar Nome Final Cafe    Café Personalizado # Inicialmente sem adicionais

    Selecionar Ingrediente    Caramelo
    Verificar Nome Final Cafe    Café Personalizado com Caramelo
    Verificar Lista Completa Ingredientes    Espresso, Caramelo

    Selecionar Ingrediente    Chantilly
    Verificar Nome Final Cafe    Café Personalizado com Caramelo, Chantilly
    Verificar Lista Completa Ingredientes    Espresso, Caramelo, Chantilly

Cenario: Deve Exibir Erro E Impedir Selecao De Terceiro Adicional
    [Documentation]    Verifica a validação de limite de 2 adicionais na UI (RN003.3).
    [Tags]    E2E    UI    Validacao    Adicionais    RN003.3    RN-G02.2

    Selecionar Ingrediente    Espresso
    Confirmar Selecao De Base

    Selecionar Ingrediente    Caramelo    # 1º adicional
    Selecionar Ingrediente    Chantilly   # 2º adicional

    # Tenta selecionar o 3º adicional
    Selecionar Ingrediente    Canela # Canela é um ingrediente adicional cadastrado no seed

    # Verifica se a mensagem de erro é exibida
    Verificar Mensagem De Erro Exibida    Você pode adicionar no máximo 2 ingredientes adicionais.
    # Verifica se o ingrediente não foi realmente adicionado no nome final
    Verificar Nao Contem Texto    com Caramelo, Chantilly, Canela
    Verificar Nome Final Cafe    Café Personalizado com Caramelo, Chantilly