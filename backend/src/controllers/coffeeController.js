const knex = require("knex");
const knexConfig = require("../../knexfile");
const db = knex(knexConfig[process.env.NODE_ENV]);

// RN002.1: Definição de sabores clássicos
const CLASSIC_COFFEE_RECIPES = [
  { name: "Macchiato", baseIngredients: ["Espresso", "Leite", "Espuma"] },
  { name: "Latte", baseIngredients: ["Espresso", "Leite"] },
  { name: "Mocha", baseIngredients: ["Espresso", "Leite", "Chocolate"] },
  { name: "Affogato", baseIngredients: ["Sorvete", "Espresso"] },
];
exports.getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await db("ingredients").select(
      "id",
      "name",
      "type",
      "price"
    );
    // RQNF5 - Retorna um código HTTP de acordo com a resposta do servidor.
    res.status(200).json(ingredients);
  } catch (error) {
    console.error("Erro ao buscar ingredientes:", error);
    // RQNF6 - O frontend deve tratar todos os erros retornados pelo backend.
    next({
      statusCode: 500,
      message: "Não foi possível carregar os ingredientes no momento.",
    });
  }
};
exports.buildCoffee = async (req, res, next) => {
  const { baseIngredients, additionalIngredients } = req.body;

  // RN001.3: Deve haver um limite mínimo de ingredientes básicos.
  if (
    !baseIngredients ||
    !Array.isArray(baseIngredients) ||
    baseIngredients.length === 0
  ) {
    return next({
      statusCode: 400,
      message:
        "Por favor, selecione pelo menos um ingrediente base para montar seu café.",
    });
  }

  // RN003.3: Deve haver um limite de 2 adicionais no máximo por pedido.
  if (additionalIngredients && additionalIngredients.length > 2) {
    return next({
      statusCode: 400,
      message: "Você pode adicionar no máximo 2 ingredientes adicionais.",
    });
  }

  try {
    const allSelectedIngredientNames = [
      ...baseIngredients,
      ...(additionalIngredients || []),
    ];
    const selectedIngredientsDetails = await db("ingredients")
      .whereIn("name", allSelectedIngredientNames)
      .select("name", "type", "price");
    if (
      selectedIngredientsDetails.length !== allSelectedIngredientNames.length
    ) {
      return next({
        statusCode: 400,
        message:
          "Um ou mais ingredientes selecionados são inválidos ou não estão disponíveis.",
      });
    }

    const baseDetails = selectedIngredientsDetails.filter((ing) =>
      baseIngredients.includes(ing.name)
    );
    const additionalDetails = selectedIngredientsDetails.filter(
      (ing) => additionalIngredients && additionalIngredients.includes(ing.name)
    );

    let classicCoffeeName = null;
    let isClassicRecognized = false;
    const baseNamesSorted = baseDetails.map((ing) => ing.name).sort(); // Garante ordem para comparação

    // RN002.2: Compara a combinação selecionada com as receitas de sabores clássicos.
    for (const recipe of CLASSIC_COFFEE_RECIPES) {
      const recipeIngredientsSorted = [...recipe.baseIngredients].sort();
      if (
        JSON.stringify(baseNamesSorted) ===
        JSON.stringify(recipeIngredientsSorted)
      ) {
        classicCoffeeName = recipe.name;
        isClassicRecognized = true;
        break;
      }
    }

    // RN004.1: O nome do café final deve ser gerado com base no sabor clássico e adicionais.
    let finalCoffeeName = classicCoffeeName
      ? classicCoffeeName
      : "Café Personalizado";
    if (additionalDetails.length > 0) {
      const additionalNames = additionalDetails
        .map((ing) => ing.name)
        .join(", ");
      finalCoffeeName += ` com ${additionalNames}`;
    }

    // RN004.2: A descrição do café final deve listar todos os ingredientes.
    const allIngredientsList = selectedIngredientsDetails
      .map((ing) => ing.name)
      .join(", ");

    // RN005.4 (Opcional): Calcular o preço total do café.
    const totalPrice = selectedIngredientsDetails.reduce(
      (sum, ing) => sum + parseFloat(ing.price),
      0
    );

    // RN002.5: A identificação (ou não identificação) do sabor clássico deve ser comunicada.
    const feedbackMessage = isClassicRecognized
      ? `Sabor clássico reconhecido: Você criou um ${classicCoffeeName}!`
      : "Combinação personalizada: Café único sujeito a verificação de disponibilidade.";

    // RQNF5 - Retorna um código HTTP de acordo com a resposta do servidor.
    res.status(200).json({
      classicCoffeeName: classicCoffeeName,
      isClassicRecognized: isClassicRecognized,
      finalCoffeeName: finalCoffeeName,
      fullIngredientsList: allIngredientsList,
      totalPrice: totalPrice.toFixed(2),
      message: feedbackMessage,
    });
  } catch (error) {
    console.error("Erro ao construir café:", error);
    // RQNF6 - O frontend deve tratar todos os erros retornados pelo backend.
    next({
      statusCode: 500,
      message: "Não foi possível montar seu café no momento.",
    });
  }
};
