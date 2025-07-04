import React from "react";
import CoffeeBuilder from "./components/CoffeeBuilder";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Café StarTay</h1>
        <h2>Monte Seu Café</h2>
        <p>
          Descubra como criar a bebida perfeita para você! Escolha seus
          ingredientes e personalize seu café de forma simples e divertida.
        </p>
      </header>

      <main>
        <CoffeeBuilder />{" "}
      </main>

      {/* INÍCIO DO CÓDIGO COMENTADO - RQNF17 */}
      {/*
      <section className="bug-report-section">
        <h3>Relatório de Bug Identificado (Exemplo - RQNF17)</h3>
        <p>
          **Título:** Botão "Confirmar Seleção" não desabilita visualmente
          quando não há ingredientes base selecionados.
        </p>
        <p>
          **Descrição:** Atualmente, o botão "Confirmar Seleção" está habilitado
          mesmo sem a seleção de ingredientes base, embora a lógica interna
          impeça a requisição e exiba uma mensagem de erro. Esperava-se que o
          botão ficasse desabilitado (cinza e não clicável) quando nenhum
          ingrediente base fosse selecionado.
        </p>
        <p>
          **Passos para Reproduzir:**
          <ol>
            <li>Acesse a aplicação do frontend.</li>
            <li>Não selecione nenhum ingrediente base.</li>
            <li>Observe que o botão "Confirmar Seleção" está clicável.</li>
            <li>Clique no botão.</li>
          </ol>
        </p>
        <p>
          **Resultado Esperado:** O botão "Confirmar Seleção" deveria estar
          desabilitado (cinza e não clicável) se nenhum ingrediente base for
          selecionado.
        </p>
        <p>
          **Resultado Atual:** O botão está habilitado e, ao clicar, exibe uma
          mensagem de erro abaixo, mas não impede a interação inicial.
        </p>
        <p>
          **Prioridade:** Média (Impacta a usabilidade, mas a validação de
          back-end previne dados incorretos).
        </p>
      </section>
      */}
      {/* FIM DO CÓDIGO COMENTADO - RQNF17 */}

      {/* INÍCIO DO CÓDIGO COMENTADO - RQNF18 */}
      {/*
      <section className="unmet-requirements-section">
        <h3>Requisitos Não Atendidos (Exemplo - RQNF18)</h3>
        <ul>
          <li>
            **RQNF12 - Diferencial (SonarQube):** Não foi possível integrar a
            ferramenta SonarQube para análise estática de código e geração de
            relatório. Isso se deveu a restrições de tempo e à complexidade de
            configuração de um ambiente SonarQube completo para um estudo de
            caso prático. Em um projeto real, esta seria uma ferramenta valiosa
            para garantir a qualidade contínua do código.
          </li>
          <li>
            **RN005.4 - Opcional (Cálculo de Preço Dinâmico na UI):** Embora o
            backend retorne o preço total do café, a interface do usuário não
            exibe o preço sendo calculado dinamicamente em tempo real a cada
            seleção de ingrediente (atualizando o preço parcial). A exibição do
            preço está presente apenas no resumo final após a confirmação dos
            ingredientes base.
          </li>
        </ul>
      </section>
      */}
      {/* FIM DO CÓDIGO COMENTADO - RQNF18 */}
    </div>
  );
}

export default App;