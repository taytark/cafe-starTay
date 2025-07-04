***Settings***
Resource    ../resources/common_variables.robot
Resource    keywords.robot
Test Setup    Criar Sessao Para API do Backend    ${API_BASE_URL}

***Test Cases***
Cenario: Deve Construir Um Cafe Classico Macchiato Com Sucesso
    [Documentation]    Verifica se a API reconhece e constrói corretamente um Macchiato.
    [Tags]    API    POST    Cafe    Classico    RF002    RF004    RN002.1    RN002.3    RN004.1

    ${base_ingredients}=    Create List    Espresso    Leite    Espuma
    ${response}=    Enviar Requisicao Construir Cafe    ${base_ingredients}
    Verificar Construcao Cafe Sucesso
    ...    ${response}
    ...    Macchiato
    ...    ${TRUE}
    ...    Macchiato
    ...    Espresso, Leite, Espuma

Cenario: Deve Construir Um Latte Personalizado Com Caramelo
    [Documentation]    Verifica a construção de um café clássico com um adicional.
    [Tags]    API    POST    Cafe    Classico    Adicional    RF002    RF003    RF004    RN003.1

    ${base_ingredients}=    Create List    Espresso    Leite
    ${additional_ingredients}=    Create List    Caramelo
    ${response}=    Enviar Requisicao Construir Cafe    ${base_ingredients}    ${additional_ingredients}
    Verificar Construcao Cafe Sucesso
    ...    ${response}
    ...    Latte
    ...    ${TRUE}
    ...    Latte com Caramelo
    ...    Espresso, Leite, Caramelo

Cenario: Deve Falhar Ao Construir Cafe Sem Ingredientes Base
    [Documentation]    Verifica a validação de mínimo de ingredientes base (RN001.3).
    [Tags]    API    POST    Validacao    Falha    RN001.3

    ${base_ingredients}=    Create List
    ${response}=    Enviar Requisicao Construir Cafe    ${base_ingredients}
    Verificar Construcao Cafe Falha
    ...    ${response}
    ...    400
    ...    Selecione pelo menos um ingrediente base

Cenario: Deve Falhar Ao Construir Cafe Com Muitos Adicionais
    [Documentation]    Verifica a validação de limite de ingredientes adicionais (RN003.3).
    [Tags]    API    POST    Validacao    Falha    RN003.3

    ${base_ingredients}=    Create List    Espresso
    ${additional_ingredients}=    Create List    Caramelo    Chantilly    Canela
    ${response}=    Enviar Requisicao Construir Cafe    ${base_ingredients}    ${additional_ingredients}
    Verificar Construcao Cafe Falha
    ...    ${response}
    ...    400
    ...    Você pode adicionar no máximo 2 ingredientes adicionais.

Cenario: Deve Construir Um Cafe Personalizado Com Combinacao Desconhecida
    [Documentation]    Verifica a construção de um café que não corresponde a um clássico.
    [Tags]    API    POST    Cafe    Personalizado    RF002    RN002.4

    ${base_ingredients}=    Create List    Espresso    Sorvete    Chocolate    # Combinação não clássica
    ${response}=    Enviar Requisicao Construir Cafe    ${base_ingredients}
    Verificar Construcao Cafe Sucesso
    ...    ${response}
    ...    ${EMPTY}    # classic_name deve ser vazio
    ...    ${FALSE}    # is_classic_recognized deve ser falso
    ...    Café Personalizado
    ...    Espresso, Sorvete, Chocolate