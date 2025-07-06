import { WalletConnector } from "./WalletConnector.js";
import { ApiClient } from "../Network/ApiClient.js";

function initWalletConnector() {
    if (typeof ethers === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.ethers.io/lib/ethers-5.6.umd.min.js';
        script.integrity = 'sha256-pmO4jZRmN0PZ3eYI5XJNzjG4QvZnI1wXvQyN+Jk7O8=';
        script.crossOrigin = 'anonymous';
        script.onload = () => {
            window.app.walletConnector = new WalletConnector(); // Assign to window
        };
        document.head.appendChild(script);
    } else {
        window.app.walletConnector = new WalletConnector(); // Assign to window
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', (e) => {
    window.app = window.app || {};
    const apiClient = new ApiClient()
    window.app.apiClient = apiClient;
    initWalletConnector()
});