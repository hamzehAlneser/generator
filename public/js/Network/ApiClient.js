import { Constants, Response } from "../shared/Classes.js";
export class ApiClient {
    constructor(baseURL) {
        // this.baseURL = "https://api.dexil.io/api/"
        this.baseURL = "http://localhost:8081/api/"
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = { ...this.defaultHeaders, ...options.headers };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                return Response.error(Constants.generalError)
            }

            const result = await response.json()

            if (!result.success) return Response.error(result.errors)
            return Response.success(result.data)

        } catch (error) {
            console.error('API request failed:', error);
            return Response.error(Constants.generalError)
        }
    }

    async get(endpoint, options = {}) {
        const response = await this.request(endpoint, {
            ...options,
            credentials: 'include',
            method: 'GET',
        });
        return response;
    }

    async post(endpoint, body, options = {}) {
        const response = await this.request(endpoint, {
            ...options,
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(body),
        });
        return response;
    }

    // Add other methods (put, delete, etc.) as needed
}