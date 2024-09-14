import apiClient from "../lib/api-client.ts";

export const getSocketResponse = async (room) => {
    try {
        const res = await apiClient.get('/api/v1/Conversation/' + room);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}