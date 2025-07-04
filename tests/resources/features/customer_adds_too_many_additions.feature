# language: pt

Funcionalidade: Cliente não consegue adicionar mais de 2 ingredientes adicionais

  Como um cliente da cafeteria
  Eu quero adicionar ingredientes extras ao meu café
  Mas eu não quero ter a opção de adicionar mais do que o limite permitido

  Cenário: Tentar adicionar mais de 2 ingredientes adicionais
    Dado o sistema de montagem de café está disponível
    E a lista de ingredientes base inclui "Espresso"
    E a lista de ingredientes adicionais inclui "Caramelo", "Chantilly" e "Canela"
    Quando o cliente seleciona "Espresso" como ingrediente base
    E o cliente confirma a seleção de base
    E o cliente seleciona "Caramelo" como ingrediente adicional
    E o cliente seleciona "Chantilly" como ingrediente adicional
    E o cliente tenta selecionar "Canela" como ingrediente adicional
    Então o sistema deve impedir a seleção do terceiro adicional
    E uma mensagem de erro "Você pode adicionar no máximo 2 ingredientes adicionais." deve ser exibida