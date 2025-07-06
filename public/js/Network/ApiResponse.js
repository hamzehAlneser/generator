// api/Response.js
export class ApiResponse {
    constructor({
        success = false,
        data = null,
        message = '',
        status = 0,
        errors = null,
        headers = {},
    } = {}) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.status = status;
        this.errors = errors;
        this.headers = headers;
        this.timestamp = new Date();
    }

    static async fromFetchResponse(response) {
        const contentType = response.headers.get('content-type');
        let data = null;

        try {
            data = contentType?.includes('application/json')
                ? await response.json()
                : await response.text();
        } catch (error) {
            console.error('Failed to parse response:', error);
        }

        return new ApiResponse({
            success: response.ok,
            data,
            message: response.statusText,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
        });
    }

    get isError() {
        return !this.success;
    }

    get isSuccess() {
        return this.success;
    }

    toJSON() {
        return {
            success: this.success,
            data: this.data,
            message: this.message,
            status: this.status,
            errors: this.errors,
            timestamp: this.timestamp.toISOString(),
        };
    }
}