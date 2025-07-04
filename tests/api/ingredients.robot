***Settings***
Resource    ../resources/common_variables.robot
Resource    keywords.robot
Test Setup    Criar Sessao Para API do Backend    ${API_BASE_URL}

***Test Cases***
Cenario: Deve Retornar Todos os Ingredientes Disponiveis
    [Documentation]    Este teste verifica se o endpoint /api/ingredients retorna a lista completa de ingredientes.
    [Tags]    API    GET    Ingredientes    RF001    RN001.1    RN003.1

    ${ingredients}=    Obter Todos os Ingredientes da API
    Verificar Ingredientes Nao Vazios    ${ingredients}
    # Exemplo de verificação de alguns ingredientes específicos que devem existir
    List Should Contain Value    ${ingredients}    name=Espresso
    List Should Contain Value    ${ingredients}    name=Leite
    List Should Contain Value    ${ingredients}    name=Caramelo
    # Validar tipos e preços, se desejado, pode-se criar mais keywords de validação
    # Exemplo: Should Be Equal    ${ingredients}[0][type]    base