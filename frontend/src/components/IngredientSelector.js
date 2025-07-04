import React from "react";
import "./IngredientSelector.css";

function IngredientSelector({
  ingredients,
  selectedIngredients,
  onToggle,
  type,
  maxSelection,
}) {
  return (
    <div className="ingredient-selector">
      {ingredients.map((ingredient) => {
        const isSelected = selectedIngredients.includes(ingredient.name);
        // RN-G02.2: Impedir a ação inválida (desabilitar seleção se o limite for atingido para adicionais)
        const isDisabled =
          type === "additional" &&
          !isSelected &&
          selectedIngredients.length >= maxSelection;

        return (
          <button
            key={ingredient.id}
            className={`ingredient-button ${isSelected ? "selected" : ""}`}
            onClick={() => onToggle(ingredient.name)}
            disabled={isDisabled}
          >
            {ingredient.name}
          </button>
        );
      })}
      {/* RN-G02.2: Mensagem de limite se for um seletor adicional e o limite for atingido */}
      {type === "additional" && selectedIngredients.length >= maxSelection && (
        <p className="limit-message">
          Máximo de {maxSelection} adicionais selecionados.
        </p>
      )}
    </div>
  );
}

export default IngredientSelector;
