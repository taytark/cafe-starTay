***Settings***
Library    RequestsLibrary    # Biblioteca para fazer requisições HTTP
Library    Collections      # Biblioteca para manipulação de coleções (listas, dicionários)
Library    OperatingSystem  # Para interagir com o sistema operacional (ex: logar variáveis de ambiente)

***Keywords***
# ==============================================================================
# Keywords de Setup/Teardown Comuns para Testes de API
# ==============================================================================
Criar Sessao Para API do Backend
    [Arguments]    ${host}    ${alias}=backend_api
    Log To Console    Conectando à API em: ${host}
    Create Session    ${alias}    ${host}    verify=${False}  # verify=False para HTTPS em ambiente de teste se precisar

# ==============================================================================
# Keywords para o Endpoint /api/ingredients
# ==============================================================================
Obter Todos os Ingredientes da API
    [Arguments]    ${alias}=backend_api
    ${response}=    GET On Session    ${alias}    /ingredients
    # RQNF5 - Verificar código HTTP de sucesso
    Should Be Equal As Strings    ${response.status_code}    200    msg=Esperado status code 200, mas obteve ${response.status_code}
    ${ingredients}=    Convert To Json    ${response.content}
    Log    Ingredientes obtidos: ${ingredients}
    [Return]    ${ingredients}

Verificar Ingredientes Nao Vazios
    [Arguments]    ${ingredients}
    Should Not Be Empty    ${ingredients}
    Dictionary Should Contain Key    ${ingredients}[0]    id
    Dictionary Should Contain Key    ${ingredients}[0]    name
    Dictionary Should Contain Key    ${ingredients}[0]    type
    Dictionary Should Contain Key    ${ingredients}[0]    price

# ==============================================================================
# Keywords para o Endpoint /api/build-coffee
# ==============================================================================
Enviar Requisicao Construir Cafe
    [Arguments]    ${base_ingredients}    ${additional_ingredients}=${EMPTY}    ${alias}=backend_api
    ${body}=    Create Dictionary    baseIngredients=${base_ingredients}
    IF    '${additional_ingredients}' != '${EMPTY}'
        Set To Dictionary    ${body}    additionalIngredients=${additional_ingredients}
    END
    Log To Console    Enviando corpo da requisição: ${body}
    ${response}=    POST On Session    ${alias}    /build-coffee    json=${body}
    Log To Console    Resposta da API: Status=${response.status_code}, Corpo=${response.content}
    [Return]    ${response}

Verificar Construcao Cafe Sucesso
    [Arguments]    ${response}    ${expected_classic_name}=${EMPTY}    ${expected_is_classic_recognized}=${TRUE}    ${expected_final_name}    ${expected_ingredients}
    Should Be Equal As Strings    ${response.status_code}    200
    ${response_body}=    Convert To Json    ${response.content}
    Log    Corpo da resposta de sucesso: ${response_body}

    # RQNF5 - Validação de campos na resposta de sucesso
    Should Contain    ${response_body}    classicCoffeeName
    Should Contain    ${response_body}    isClassicRecognized
    Should Contain    ${response_body}    finalCoffeeName
    Should Contain    ${response_body}    fullIngredientsList
    Should Contain    ${response_body}    message
    Should Contain    ${response_body}    totalPrice

    # Validação dos valores específicos (RF002, RF004)
    Should Be Equal    ${response_body}[isClassicRecognized]    ${expected_is_classic_recognized}
    Should Contain    ${response_body}[finalCoffeeName]    ${expected_final_name}
    Should Contain    ${response_body}[fullIngredientsList]    ${expected_ingredients}

    IF    '${expected_classic_name}' != '${EMPTY}'
        Should Be Equal    ${response_body}[classicCoffeeName]    ${expected_classic_name}
        Should Contain    ${response_body}[message]    ${expected_classic_name}
    ELSE
        Should Be Equal    ${response_body}[classicCoffeeName]    ${None}
        Should Contain    ${response_body}[message]    Combinação personalizada
    END


Verificar Construcao Cafe Falha
    [Arguments]    ${response}    ${expected_status_code}    ${expected_message_part}
    Should Be Equal As Strings    ${response.status_code}    ${expected_status_code}
    ${response_body}=    Convert To Json    ${response.content}
    Log    Corpo da resposta de falha: ${response_body}
    # RQNF6 - O frontend deve tratar todos os erros retornados pelo backend.
    # Verifica se a mensagem de erro esperada está contida na resposta.
    Dictionary Should Contain Key    ${response_body}    message
    Should Contain    ${response_body}[message]    ${expected_message_part}