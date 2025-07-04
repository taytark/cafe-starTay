exports.seed = async function (knex) {
  await knex("classic_coffee_ingredients").del();
  await knex("classic_coffees").del();
  await knex("ingredients").del();

  // Insere ingredientes
  const [
    espressoId,
    milkId,
    chocolateId,
    iceCreamId,
    foamId,
    caramelId,
    whippedCreamId,
    cinnamonId,
  ] = await knex("ingredients")
    .insert([
      { name: "Espresso", type: "base", price: 5.0 },
      { name: "Leite", type: "base", price: 2.5 },
      { name: "Chocolate", type: "base", price: 3.0 },
      { name: "Sorvete", type: "base", price: 4.0 },
      { name: "Espuma", type: "base", price: 1.0 },
      { name: "Caramelo", type: "additional", price: 1.5 },
      { name: "Chantilly", type: "additional", price: 2.0 },
      { name: "Canela", type: "additional", price: 0.5 },
    ])
    .returning("id");

  // Insere cafés clássicos
  const [macchiatoId, latteId, mochaId, affogatoId] = await knex(
    "classic_coffees"
  )
    .insert([
      {
        name: "Macchiato",
        description: "Espresso com um toque de leite e espuma.",
      },
      {
        name: "Latte",
        description: "Uma mistura suave de espresso e leite vaporizado.",
      },
      {
        name: "Mocha",
        description: "Combinação de espresso, leite e chocolate.",
      },
      {
        name: "Affogato",
        description: "Sorvete de creme afogado em espresso quente.",
      },
    ])
    .returning("id");

  // Relaciona ingredientes a cafés clássicos
  await knex("classic_coffee_ingredients").insert([
    // Macchiato: Espresso, Leite, Espuma
    { classic_coffee_id: macchiatoId.id, ingredient_id: espressoId.id },
    { classic_coffee_id: macchiatoId.id, ingredient_id: milkId.id },
    { classic_coffee_id: macchiatoId.id, ingredient_id: foamId.id },

    // Latte: Espresso, Leite
    { classic_coffee_id: latteId.id, ingredient_id: espressoId.id },
    { classic_coffee_id: latteId.id, ingredient_id: milkId.id },

    // Mocha: Espresso, Leite, Chocolate
    { classic_coffee_id: mochaId.id, ingredient_id: espressoId.id },
    { classic_coffee_id: mochaId.id, ingredient_id: milkId.id },
    { classic_coffee_id: mochaId.id, ingredient_id: chocolateId.id },

    // Affogato: Sorvete, Espresso
    { classic_coffee_id: affogatoId.id, ingredient_id: iceCreamId.id },
    { classic_coffee_id: affogatoId.id, ingredient_id: espressoId.id },
  ]);
};
