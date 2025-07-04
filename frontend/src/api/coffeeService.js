import axios from "axios";

const API_URL =
  process.env.REACT_APP_BACKEND_URL;
console.log("API_URL no frontend:", API_URL); // <-- ADICIONE ESTA LINHA

export const getIngredients = async () => {
  try {
    const response = await axios.get(`${API_URL}/ingredients`);
    return response.data;
  } catch (error) {
    // RQNF6 - O frontend deve tratar todos os erros retornados pelo backend.
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Erro desconhecido ao carregar ingredientes.";
    console.error("Erro ao buscar ingredientes:", error.response || error);
    throw new Error(errorMessage);
  }
};
export const buildCoffee = async (baseIngredients, additionalIngredients) => {
  try {
    const response = await axios.post(`${API_URL}/build-coffee`, {
      baseIngredients,
      additionalIngredients,
    });
    return response.data;
  } catch (error) {
    // RQNF6 - O frontend deve tratar todos os erros retornados pelo backend.
    const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Erro desconhecido ao montar o café.";
    console.error("Erro ao montar café:", error.response || error);
    throw new Error(errorMessage);
  }
};
