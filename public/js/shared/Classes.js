export class Constants {
    constructor({
        success = false,
        data = null,
        errors = null,
    } = {}) {
        this.success = success;
        this.data = data;
        this.errors = errors;
    }
    static metamaskError = "Please check your metamask connection and try again"
    static generalError = "Internal server error, Please check your metamask connection and try again"
}

export class Response {
    constructor({
        success = false,
        data = null,
        errors = null,
    } = {}) {
        this.success = success;
        this.data = data;
        this.errors = errors;
    }
    static success(data) {
        return new Response({ success: true, data });
    }
    static error(errors) {
        return new Response({ success: false, errors });
    }

    hasData() {
        return this.success && this.data !== null;
    }
    hasErrors() {
        return !this.success && this.errors !== null;
    }
    firstError() {
        if (!this.errors) return null;
        if (Array.isArray(this.errors)) return this.errors[0];
        if (this.errors instanceof Error) return this.errors.message;
        return String(this.errors);
    }
}