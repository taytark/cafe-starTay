***Settings***
Resource    ../resources/common_variables.robot
Resource    keywords.robot
Test Setup    Abrir Aplicacao Construtor De Cafe    ${FRONTEND_BASE_URL}
Test Teardown    Fechar Navegador

***Test Cases***
Cenario: Deve Montar Um Macchiato Classico Com Sucesso E Reconhecer Na UI
    [Documentation]    Verifica o fluxo completo de seleção de Macchiato e reconhecimento na UI.
    [Tags]    E2E    UI    Classico    Macchiato    RF002    RF004    RF005

    Selecionar Ingrediente    Espresso
    Selecionar Ingrediente    Leite
    Selecionar Ingrediente    Espuma
    Confirmar Selecao De Base

    Verificar Reconhecimento Cafe Classico    Macchiato
    Verificar Nome Final Cafe    Macchiato
    Verificar Lista Completa Ingredientes    Espresso, Leite, Espuma

Cenario: Deve Montar Um Latte Classico Com Sucesso E Reconhecer Na UI
    [Documentation]    Verifica o fluxo completo de seleção de Latte e reconhecimento na UI.
    [Tags]    E2E    UI    Classico    Latte    RF002    RF004    RF005

    Selecionar Ingrediente    Espresso
    Selecionar Ingrediente    Leite
    Confirmar Selecao De Base

    Verificar Reconhecimento Cafe Classico    Latte
    Verificar Nome Final Cafe    Latte
    Verificar Lista Completa Ingredientes    Espresso, Leite

Cenario: Deve Montar Um Cafe Personalizado E Indicar Nao Classico Na UI
    [Documentation]    Verifica o fluxo de montagem de um café não clássico.
    [Tags]    E2E    UI    Personalizado    RF002    RN002.4

    Selecionar Ingrediente    Espresso
    Selecionar Ingrediente    Sorvete
    Confirmar Selecao De Base

    Verificar Indicacao Cafe Personalizado
    Verificar Nome Final Cafe    Café Personalizado
    Verificar Lista Completa Ingredientes    Espresso, Sorvete