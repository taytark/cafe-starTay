exports.up = function (knex) {
  return (
    knex.schema
      // Tabela para ingredientes (base e adicionais)
      .createTable("ingredients", function (table) {
        table.increments("id").primary(); // Chave primária auto-incrementável
        table.string("name").notNullable().unique(); // Nome do ingrediente, deve ser único
        table.string("type").notNullable(); // Tipo do ingrediente (ex: 'base', 'additional')
        table.decimal("price", 8, 2).notNullable().defaultTo(0.0); // Preço do ingrediente (RN005.4 - Opcional)
        table.timestamps(true, true); // created_at e updated_at
      })
      // Tabela para os cafés clássicos (RN002.1)
      .createTable("classic_coffees", function (table) {
        table.increments("id").primary();
        table.string("name").notNullable().unique();
        table.text("description"); // Descrição opcional
        table.timestamps(true, true);
      })
      // Tabela de junção para a relação N:N entre classic_coffees e ingredients (RN002.1)
      .createTable("classic_coffee_ingredients", function (table) {
        table.increments("id").primary();
        table
          .integer("classic_coffee_id")
          .unsigned()
          .references("id")
          .inTable("classic_coffees")
          .onDelete("CASCADE");
        table
          .integer("ingredient_id")
          .unsigned()
          .references("id")
          .inTable("ingredients")
          .onDelete("CASCADE");
        table.unique(["classic_coffee_id", "ingredient_id"]); // Garante que a combinação é única
      })
  );
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("classic_coffee_ingredients")
    .dropTableIfExists("classic_coffees")
    .dropTableIfExists("ingredients");
};
