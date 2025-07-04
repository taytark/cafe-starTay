# language: pt

Funcionalidade: Cliente monta um café personalizado com adicionais

  Como um cliente da cafeteria
  Eu quero montar um café do meu jeito
  Para que eu possa adicionar ingredientes extras

  Cenário: Montar um café personalizado com adicionais
    Dado o sistema de montagem de café está disponível
    E a lista de ingredientes base inclui "Espresso" e "Leite"
    E a lista de ingredientes adicionais inclui "Caramelo"
    Quando o cliente seleciona "Espresso" e "Leite" como ingredientes base
    E o cliente confirma a seleção de base
    E o cliente seleciona "Caramelo" como ingrediente adicional
    Então o sistema deve reconhecer o "Latte" como sabor clássico
    E o nome final do café deve ser "Latte com Caramelo"
    E a descrição deve incluir os ingredientes "Espresso", "Leite" e "Caramelo"