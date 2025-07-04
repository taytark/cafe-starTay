# language: pt

Funcionalidade: Cliente monta um café clássico Macchiato

  Como um cliente da cafeteria
  Eu quero montar um café personalizado
  Para que eu possa escolher um Macchiato

  Cenário: Montar um Macchiato clássico com sucesso
    Dado o sistema de montagem de café está disponível
    E a lista de ingredientes base inclui "Espresso", "Leite" e "Espuma"
    Quando o cliente seleciona "Espresso", "Leite" e "Espuma" como ingredientes base
    E o cliente confirma a seleção de base
    Então o sistema deve reconhecer o "Macchiato" como sabor clássico
    E o nome final do café deve ser "Macchiato"
    E a descrição deve incluir os ingredientes "Espresso", "Leite" e "Espuma"