import React from "react";
import "./CoffeeSummary.css";

function CoffeeSummary({ result }) {
  if (!result) {
    return null;
  }

  // RN006.1: Simula a confirmação do pedido
  const handleConfirmOrder = () => {
    alert("Seu pedido de café foi confirmado! Preparando...");
  };

  return (
    <div className="coffee-summary-card">
      <h3>Resumo do Seu Café:</h3>
      {/* RN002.5: Comunicação clara da identificação do sabor clássico */}
      {result.isClassicRecognized ? (
        <p className="classic-recognition">
          Sabor Clássico Reconhecido: Você criou um **{result.classicCoffeeName}
          **!
        </p> // RN002.3
      ) : (
        <p className="custom-recognition">
          Combinação Personalizada: Este é um café único!
        </p> // RN002.4
      )}

      {/* RN004.1: Exibe o nome gerado do café final */}
      <h4 className="final-coffee-name">{result.finalCoffeeName}</h4>

      {/* RN004.2 / RN005.3: Exibe a lista completa de ingredientes */}
      <p className="ingredients-list">
        Ingredientes: {result.fullIngredientsList}
      </p>

      {/* RN005.4 (Opcional): Exibe o preço total */}
      {result.totalPrice && (
        <p className="total-price">
          Preço Estimado: **R$ {result.totalPrice}**
        </p>
      )}

      {/* RN006.1: Botão de ação principal para confirmar o pedido. */}
      {/* RN006.2: A confirmação do pedido só deve ser possível se um café válido tiver sido montado. */}
      <button onClick={handleConfirmOrder} className="confirm-order-button">
        Confirmar Pedido
      </button>
    </div>
  );
}

export default CoffeeSummary;
