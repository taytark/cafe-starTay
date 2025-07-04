import React, { useState, useEffect } from "react";
import IngredientSelector from "./IngredientSelector";
import CoffeeSummary from "./CoffeeSummary";
import { getIngredients, buildCoffee } from "../api/coffeeService";
import "../App.css";

function CoffeeBuilder() {
  const [baseIngredients, setBaseIngredients] = useState([]);
  const [additionalIngredients, setAdditionalIngredients] = useState([]);
  const [availableBaseIngredients, setAvailableBaseIngredients] = useState([]);
  const [availableAdditionalIngredients, setAvailableAdditionalIngredients] =
    useState([]);
  const [coffeeResult, setCoffeeResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // RN-G03.1: O sistema deve manter o estado das seleções do cliente durante a sessão.
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const ingredients = await getIngredients();
        setAvailableBaseIngredients(
          ingredients.filter((ing) => ing.type === "base")
        );
        setAvailableAdditionalIngredients(
          ingredients.filter((ing) => ing.type === "additional")
        );
      } catch (error) {
        // RQNF6: O frontend deve tratar todos os erros retornados pelo backend.
        setErrorMessage(
          error.message ||
            "Falha ao carregar os ingredientes disponíveis. Tente novamente mais tarde."
        );
      }
    };
    fetchIngredients();
  }, []);

  const handleBaseIngredientToggle = (ingredientName) => {
    setBaseIngredients((prev) =>
      prev.includes(ingredientName)
        ? prev.filter((name) => name !== ingredientName)
        : [...prev, ingredientName]
    );
    setCoffeeResult(null);
    setErrorMessage(null);
  };

  const handleAdditionalIngredientToggle = (ingredientName) => {
    setAdditionalIngredients((prev) => {
      const isSelected = prev.includes(ingredientName);
      if (isSelected) {
        return prev.filter((name) => name !== ingredientName);
      } else {
        // RN003.3: Deve haver um limite de 2 adicionais no máximo por pedido.
        if (prev.length < 2) {
          setErrorMessage(null); // Limpa erro se a adição for válida
          return [...prev, ingredientName];
        } else {
          // RN-G02.2: Mensagens de erro claras, concisas e não intrusivas.
          setErrorMessage(
            "Você pode adicionar no máximo 2 ingredientes adicionais."
          );
          return prev;
        }
      }
    });
    setCoffeeResult(null);
  };

  // RF006, RN006.1: Permite que o cliente confirme seu café personalizado para finalizar o pedido.
  const handleBuildCoffee = async () => {
    // RN001.3: Deve haver um limite mínimo de ingredientes básicos.
    // RN-G02.2: Impedir a ação inválida e fornecer feedback.
    if (baseIngredients.length === 0) {
      setErrorMessage(
        "Selecione pelo menos um ingrediente base para montar seu café."
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Faz a chamada à API para construir o café (RF002, RF004, RF005)
      const result = await buildCoffee(baseIngredients, additionalIngredients);
      setCoffeeResult(result);
      // RN-G02.1: Fornece feedback visual imediato para todas as interações.
    } catch (error) {
      // RQNF6: O frontend deve tratar todos os erros retornados pelo backend.
      setErrorMessage(
        error.message || "Ocorreu um erro inesperado ao montar o café."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // RN-G03.2: Deve haver uma opção para "Limpar Seleção" ou "Começar de Novo".
  const handleClearSelection = () => {
    setBaseIngredients([]);
    setAdditionalIngredients([]);
    setCoffeeResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="coffee-builder-container">
      <section className="selection-section">
        <h3>Selecione os ingredientes base:</h3>
        <IngredientSelector
          ingredients={availableBaseIngredients}
          selectedIngredients={baseIngredients}
          onToggle={handleBaseIngredientToggle}
          type="base"
        />
        <button
          onClick={handleBuildCoffee}
          disabled={isLoading || baseIngredients.length === 0} // RN006.2: Confirmação do pedido só possível se café válido
          className="confirm-button"
        >
          {isLoading ? "Montando..." : "Confirmar Seleção"}
        </button>
        <h3>Selecione os ingredientes adicionais:</h3>
        <IngredientSelector
          ingredients={availableAdditionalIngredients}
          selectedIngredients={additionalIngredients}
          onToggle={handleAdditionalIngredientToggle}
          type="additional"
          maxSelection={2} // Informa o limite para o componente IngredientSelector (RN003.3)
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
        {/* RN-G02.2 */}
        {coffeeResult && <CoffeeSummary result={coffeeResult} />}
        <button onClick={handleClearSelection} className="clear-button">
          Limpar Seleção
        </button>
      </section>
    </div>
  );
}

export default CoffeeBuilder;
