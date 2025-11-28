import axios from 'axios';

const API_BASE_URL = '/api';

export interface User {
    id: string;
    name: string;
    company: string;
    plan: 'Premium' | 'Pro' | 'Free' | 'Enterprise';
    status: 'Active' | 'Inactive';
    revenue: number;
    usage_count: number;
    usage_trend: 'Stable' | 'Increasing' | 'Decreasing';
    signup_date: string;
    industry: 'Ecommerce' | 'EdTech' | 'Health Tech' | 'BFSI' | 'Hospitality';
    stack_config: {
        llm: string;
        tts: string;
        telephony: string;
    };
    cost_per_min: number;
    price_per_min: number;
    margin_percent: number;
    tags: string[];
    is_whale?: boolean;
}

export const api = {
    // Get all users
    async getUsers(): Promise<User[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`);
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    // Analytics endpoints
    async getAnalyticsPulse() {
        const response = await axios.get(`${API_BASE_URL}/analytics/pulse`);
        return response.data;
    },

    async getAnalyticsFunnel() {
        const response = await axios.get(`${API_BASE_URL}/analytics/funnel`);
        return response.data;
    },

    async getAnalyticsSectors() {
        const response = await axios.get(`${API_BASE_URL}/analytics/sectors`);
        return response.data;
    },

    async getUsersAtRisk() {
        const response = await axios.get(`${API_BASE_URL}/users/risk`);
        return response.data;
    },

    // Simulate traffic
    async simulateTraffic() {
        const response = await axios.post(`${API_BASE_URL}/simulate-traffic`);
        return response.data;
    },
};
