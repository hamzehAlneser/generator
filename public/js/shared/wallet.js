const connectBtn = document.getElementById('connect-btn');
const walletAddressEl = document.getElementById('wallet-address');
const addressText = document.getElementById('address-text');

connectBtn.addEventListener('click', function () {
    if (!isConnected) {
        isConnected = true;
        connectBtn.style.display = 'none';
        walletAddressEl.style.display = 'flex';
        addressText.textContent = walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4);

        // Show connection success notification
        showNotification('Wallet connected successfully!', 'success');
    }
});