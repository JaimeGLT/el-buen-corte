import axiosApi from '../utlis/axiosApi';

export const aiService = {
    askAI: async (question: string) => {
        try {
            const response = await axiosApi.post('/ai/chat', { question });
            return response.data;
        } catch (error) {
            throw new Error('Error al comunicarse con la IA');
        }
    }
};
