***Settings***
Library    SeleniumLibrary    timeout=${EXPLICIT_WAIT}    # Usa SeleniumLibrary para automação de navegador
# Importe webdriver_manager diretamente nas keywords ou use `SeleniumLibrary.Set Selenium Speed` se tiver problemas de sincronização.

***Keywords***
# ==============================================================================
# Keywords de Setup/Teardown Comuns para Testes E2E
# ==============================================================================
Abrir Aplicacao Construtor De Cafe
    [Arguments]    ${url}
    # Garante que o driver do navegador seja baixado e configurado automaticamente
    # Isso exige que webdriver_manager esteja instalado no ambiente do Robot
    ${driver_path}=    Evaluate    sys.path.append(os.path.join(os.getcwd(), 'node_modules', '.bin')) and ChromeDriverManager().install()    modules=sys,os,webdriver_manager.chrome
    # Inicia o navegador Chrome. Pode ser 'firefox', 'headlesschrome' etc.
    Open Browser    ${url}    browser=${BROWSER_NAME}
    Maximize Browser Window
    Set Selenium Implicit Wait    ${IMPLICIT_WAIT} # RN-G02.1: Feedback visual imediato

Fechar Navegador
    Close Browser

# ==============================================================================
# Keywords de Interação com a UI
# ==============================================================================
Selecionar Ingrediente
    [Arguments]    ${ingredient_name}
    Click Button    ${ingredient_name}    # Assumindo que o nome do ingrediente é o texto visível do botão

Confirmar Selecao De Base
    Click Button    Confirmar Seleção

Limpar Selecao De Cafe
    Click Button    Limpar Seleção

# ==============================================================================
# Keywords de Verificação da UI
# ==============================================================================
Verificar Reconhecimento Cafe Classico
    [Arguments]    ${coffee_name}
    Wait Until Page Contains    Sabor clássico reconhecido: Você criou um ${coffee_name}!
    Page Should Contain    Sabor clássico reconhecido: Você criou um ${coffee_name}!

Verificar Indicacao Cafe Personalizado
    Wait Until Page Contains    Combinação Personalizada: Este é um café único!
    Page Should Contain    Combinação Personalizada: Este é um café único!

Verificar Nome Final Cafe
    [Arguments]    ${expected_name}
    Wait Until Page Contains Element    xpath=//h4[contains(@class, 'final-coffee-name') and contains(text(), '${expected_name}')]
    Element Should Contain    xpath=//h4[contains(@class, 'final-coffee-name')]    ${expected_name}

Verificar Lista Completa Ingredientes
    [Arguments]    ${expected_list}
    Wait Until Page Contains Element    xpath=//p[contains(@class, 'ingredients-list') and contains(text(), 'Ingredientes: ${expected_list}')]
    Element Should Contain    xpath=//p[contains(@class, 'ingredients-list')]    ${expected_list}

Verificar Mensagem De Erro Exibida
    [Arguments]    ${expected_message}
    Wait Until Page Contains Element    class:error-message
    Element Should Contain    class:error-message    ${expected_message}
    # RN-G02.2: Verificar se a mensagem está clara e concisa

Verificar Botao Desabilitado
    [Arguments]    ${button_text}
    Element Should Be Disabled    xpath=//button[text()='${button_text}']

Verificar Botao Habilitado
    [Arguments]    ${button_text}
    Element Should Be Enabled    xpath=//button[text()='${button_text}']

Verificar Nao Contem Texto
    [Arguments]    ${text}
    Page Should Not Contain    ${text}