import { WalletConnector } from "./WalletConnector.js";

function initWalletConnector() {
    if (typeof ethers === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.ethers.io/lib/ethers-5.6.umd.min.js';
        script.integrity = 'sha256-pmO4jZRmN0PZ3eYI5XJNzjG4QvZnI1wXvQyN+Jk7O8=';
        script.crossOrigin = 'anonymous';
        script.onload = () => new WalletConnector();
        document.head.appendChild(script);
    } else {
        new WalletConnector();
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', (e) => {
    initWalletConnector()
});