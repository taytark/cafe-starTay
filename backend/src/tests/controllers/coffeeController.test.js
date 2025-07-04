// backend/src/controllers/coffeeController.test.js

// Mock do módulo 'knex' para evitar conexão real com o banco de dados
// Isso deve ser feito ANTES de importar o coffeeController para que a versão mockada do knex seja usada.
const mockDbQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  whereIn: jest.fn().mockReturnThis(),
  then: jest.fn(), // Será sobrescrito em beforeEach ou nos testes específicos
  first: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
};

// mockKnex agora retorna uma função que simula db("tableName")
const mockKnexInstance = jest.fn(() => (tableName) => {
  // Retorna o query builder mockado para qualquer chamada de tabela
  return mockDbQueryBuilder;
});

// Mocka o knexfile e process.env.NODE_ENV para a configuração do Knex
// No teste, podemos mockar 'knex' para retornar diretamente a função que simula db(tableName)
jest.mock('knex', () => mockKnexInstance);

// O coffeeController importa o db depois de configurar knex
const coffeeController = require('../../controllers/coffeeController');

// Dados de mock para simular o banco de dados
const mockIngredientsData = [
  { id: 1, name: "Espresso", type: "base", price: "5.00" },
  { id: 2, name: "Leite", type: "base", price: "2.00" },
  { id: 3, name: "Chocolate", type: "additional", price: "1.50" },
  { id: 4, name: "Sorvete", type: "additional", price: "3.00" },
  { id: 5, name: "Espuma", type: "additional", price: "0.50" },
];

describe('coffeeController', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    // Reseta os mocks antes de cada teste para isolamento
    mockRes = {
      status: jest.fn().mockReturnThis(), // Permite encadear .status().json()
      json: jest.fn(),
    };
    mockNext = jest.fn(); // Mock da função next para tratamento de erros do Express

    // Limpa os mocks do query builder
    mockDbQueryBuilder.select.mockClear();
    mockDbQueryBuilder.whereIn.mockClear();
    mockDbQueryBuilder.then.mockClear();
    mockDbQueryBuilder.first.mockClear();
    mockDbQueryBuilder.into.mockClear();
    mockDbQueryBuilder.insert.mockClear();
    mockDbQueryBuilder.update.mockClear();
    mockDbQueryBuilder.delete.mockClear();
    mockDbQueryBuilder.where.mockClear();

    // Resetar o mock para que o knex() retorne o mockDbQueryBuilder na próxima chamada
    mockKnexInstance.mockClear();
    // mockKnexInstance deve retornar a função que simula db(tableName)
    mockKnexInstance.mockReturnValue(jest.fn((tableName) => mockDbQueryBuilder));

    // Define o comportamento padrão de .then para simular uma Promise resolvida
    // Pode ser sobrescrito em testes específicos para simular falhas ou dados diferentes
    mockDbQueryBuilder.then.mockImplementation((callback) => {
      // Por padrão, simula que select ou whereIn retorna mockIngredientsData
      return Promise.resolve(callback(mockIngredientsData));
    });
  });

  // Testes para getAllIngredients
  describe('getAllIngredients', () => {
    test('should return all ingredients with status 200', async () => {
      // Configura o mock do banco de dados para retornar os dados de ingredientes
      mockDbQueryBuilder.select.mockResolvedValueOnce(mockIngredientsData);

      await coffeeController.getAllIngredients(mockReq, mockRes, mockNext);

      // Verifica se o status 200 foi chamado
      expect(mockRes.status).toHaveBeenCalledWith(200);
      // Verifica se os dados corretos foram retornados
      expect(mockRes.json).toHaveBeenCalledWith(mockIngredientsData);
      // Verifica se o next não foi chamado (nenhum erro)
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should call next with a 500 error on database error', async () => {
      // Configura o mock do banco de dados para rejeitar a promise
      mockDbQueryBuilder.select.mockRejectedValueOnce(new Error("Database error"));

      await coffeeController.getAllIngredients(mockReq, mockRes, mockNext);

      // Verifica se o status 500 não foi chamado diretamente em res (tratado por next)
      expect(mockRes.status).not.toHaveBeenCalled();
      // Verifica se next foi chamado com o erro correto
      expect(mockNext).toHaveBeenCalledWith({
        statusCode: 500,
        message: "Não foi possível carregar os ingredientes no momento.",
      });
    });
  });

  // Testes para buildCoffee
  describe('buildCoffee', () => {
    // Teste de validação: nenhum ingrediente base
    test('should return 400 if no base ingredients are provided', async () => {
      mockReq = { body: { baseIngredients: [], additionalIngredients: [] } };

      await coffeeController.buildCoffee(mockReq, mockRes, mockNext);

      expect(mockRes.status).not.toHaveBeenCalled(); // Erros de validação devem ir para next
      expect(mockNext).toHaveBeenCalledWith({
        statusCode: 400,
        message: "Por favor, selecione pelo menos um ingrediente base para montar seu café.",
      });
    });

    // Teste de validação: mais de 2 adicionais
    test('should return 400 if more than 2 additional ingredients are provided', async () => {
      mockReq = { body: { baseIngredients: ["Espresso"], additionalIngredients: ["Chocolate", "Sorvete", "Espuma"] } };

      await coffeeController.buildCoffee(mockReq, mockRes, mockNext);

      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith({
        statusCode: 400,
        message: "Você pode adicionar no máximo 2 ingredientes adicionais.",
      });
    });

    // Teste de sucesso: reconhecimento de café clássico (Latte)
    test('should recognize Latte and calculate price correctly', async () => {
      mockReq = { body: { baseIngredients: ["Espresso", "Leite"], additionalIngredients: [] } };

      // Configura o mock do Knex para retornar os ingredientes selecionados
      mockDbQueryBuilder.select.mockResolvedValueOnce([
        { name: "Espresso", type: "base", price: "5.00" },
        { name: "Leite", type: "base", price: "2.00" },
      ]);

      await coffeeController.buildCoffee(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        classicCoffeeName: "Latte",
        isClassicRecognized: true,
        finalCoffeeName: "Latte",
        fullIngredientsList: "Espresso, Leite",
        totalPrice: "7.00",
        message: "Sabor clássico reconhecido: Você criou um Latte!",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    // Teste de sucesso: café personalizado com adicionais
    test('should build a custom coffee with additional ingredients and calculate price', async () => {
      mockReq = { body: { baseIngredients: ["Espresso"], additionalIngredients: ["Chocolate", "Espuma"] } };

      // Configura o mock do Knex para retornar os ingredientes selecionados
      mockDbQueryBuilder.select.mockResolvedValueOnce([
        { name: "Espresso", type: "base", price: "5.00" },
        { name: "Chocolate", type: "additional", price: "1.50" },
        { name: "Espuma", type: "additional", price: "0.50" },
      ]);

      await coffeeController.buildCoffee(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        classicCoffeeName: null, // Não é um clássico base
        isClassicRecognized: false,
        finalCoffeeName: "Café Personalizado com Chocolate, Espuma",
        fullIngredientsList: "Espresso, Chocolate, Espuma",
        totalPrice: "7.00", // 5.00 + 1.50 + 0.50
        message: "Combinação personalizada: Café único sujeito a verificação de disponibilidade.",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    // Teste de erro: ingrediente não encontrado
    test('should return 400 if an ingredient is not found in the database', async () => {
      mockReq = { body: { baseIngredients: ["Café Inexistente"], additionalIngredients: [] } };

      // Simula que nenhum ingrediente foi encontrado no banco de dados para "Café Inexistente"
      mockDbQueryBuilder.select.mockResolvedValueOnce([]); // Retorna array vazio

      await coffeeController.buildCoffee(mockReq, mockRes, mockNext);

      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith({
        statusCode: 400,
        message: "Um ou mais ingredientes selecionados são inválidos ou não estão disponíveis.",
      });
    });

    // Teste de erro no banco de dados durante buildCoffee
    test('should call next with a 500 error on database error during buildCoffee', async () => {
        mockReq = { body: { baseIngredients: ["Espresso"], additionalIngredients: [] } };

        mockDbQueryBuilder.select.mockRejectedValueOnce(new Error("DB connection lost"));

        await coffeeController.buildCoffee(mockReq, mockRes, mockNext);

        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith({
            statusCode: 500,
            message: "Não foi possível montar seu café no momento.",
        });
    });
  });
});