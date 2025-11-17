import axiosApi from '../utlis/axiosApi';

export const aiService = {
  askAI: async (question: string) => {
    try {
      const response = await axiosApi.post('/ai/chat', { question });
      // Retorna solo la respuesta del bot
      return response.data.answer;
    } catch (error) {
      console.error("Error al comunicarse con la IA", error);
      throw new Error('Error al comunicarse con la IA');
    }
  }
};
