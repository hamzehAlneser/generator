import { Constants, Response } from './Classes.js';

export class WalletConnector {
    ethChainID = 1
    //#region Constructor % Getters
    constructor(options = {}) {
        // Default options
        this.options = {
            walletConnectedClass: 'wallet-connected',
            walletDisconnectedClass: 'wallet-disconnected',
            ...options
        };

        // DOM elements
        this.connectBtn = document.querySelector('.connect-wallet');
        this.walletDropdown = document.querySelector('.wallet-dropdown');
        this.walletAddress = document.querySelector('.wallet-address');
        this.addressText = document.querySelector('.address-text');
        this.disconnectBtn = document.querySelector('.disconnect-wallet');

        // Ethers.js objects
        this.provider = null;
        this.signer = null;
        this.ethers = ethers;

        // Initialize
        this.init();
    }

    async init() {
        // Check for saved wallet connection
        if (!window.ethereum) {
            localStorage.removeItem('walletAddress');
        }
        const savedAddress = localStorage.getItem('walletAddress');
        if (savedAddress) {
            await this.initEthers();
            this.updateUI(savedAddress);
        }

        // Set up event listeners
        this.setupEventListeners();
    }

    async getSigner() {
        if (!this.signer) {
            throw new Error('No wallet connected');
        }
        return this.signer;
    }

    getProvider() {
        if (!this.provider) {
            throw new Error('No provider available');
        }
        return this.provider;
    }

    async getNetworkID() {
        if (!this.provider) {
            throw new Error('No provider available');
        }
        const network = await this.provider.getNetwork()
        return network.chainId
    }

    async getAddress() {
        if (!this.signer) {
            throw new Error('No wallet connected');
        }
        return this.signer.getAddress();
    }

    async initEthers() {
        this.provider = new this.ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
    }
    //#endregion

    //#region Wallet Connect
    setupEventListeners() {
        // Toggle wallet dropdown
        this.connectBtn?.addEventListener('click', () => {
            this.walletDropdown.style.display =
                this.walletDropdown.style.display === 'flex' ? 'none' : 'flex';
        });

        // MetaMask connection
        document.querySelector('[data-wallet="metamask"]')
            ?.addEventListener('click', () => this.connectWallet('metamask'));

        // Disconnect wallet
        this.disconnectBtn?.addEventListener('click', () => this.disconnectWallet());

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.wallet-container')) {
                this.walletDropdown.style.display = 'none';
            }
        });

        // Handle chain/account changes if MetaMask is installed
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                accounts.length > 0
                    ? this.updateUI(accounts[0])
                    : this.disconnectWallet();
            });

            window.ethereum.on('chainChanged', () => window.location.reload());
        }
    }

    async connectWallet(walletType) {
        try {
            if (walletType !== 'metamask') {
                throw new Error('Only MetaMask is currently supported');
            }

            const address = await this.connectMetaMask();
            this.updateUI(address);
            showNotification('Wallet connected successfully!', 'success');

        } catch (error) {
            console.error('Connection error:', error);
            this.showNotification(error.message, 'error');
        }
    }

    async connectMetaMask() {
        if (!window.ethereum) {
            window.open('https://metamask.io/download.html', '_blank');
            throw new Error('MetaMask not installed');
        }

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        await this.initEthers();
        return accounts[0];
    }
    async validateWalletConnection() {
        try {
            // Check basic connection
            if (!this.provider || !this.signer) {
                return Response.error(Constants.metamaskError)
            }

            // Get address and chain ID in parallel
            const [address, network] = await Promise.all([
                this.signer.getAddress(),
                this.provider.getNetwork()
            ]);

            // Validate chain if required
            if (network.chainId !== this.ethChainID) {
                return Response.error(`Please switch to Ethereum Mainnet `)
            }

            return Response.success()
        } catch (error) {
            console.error('Validation error:', error);
            return Response.error('Contract verification failed');
        }
    }

    async ensureWalletConnected() {
        const { isConnected, error } = await this.validateWalletConnection();

        if (!isConnected) {
            this.showNotification(error || 'Please connect your wallet', 'error');
            this.walletDropdown.style.display = 'flex'; // Open wallet selector
            return false;
        }

        return true;
    }
    disconnectWallet() {
        // Clear storage and reset variables
        localStorage.removeItem('walletAddress');
        this.provider = null;
        this.signer = null;

        // Reset UI
        if (this.connectBtn) this.connectBtn.style.display = 'flex';
        if (this.walletAddress) this.walletAddress.style.display = 'none';

        // Update body classes
        document.body.classList.add(this.options.walletDisconnectedClass);
        document.body.classList.remove(this.options.walletConnectedClass);

        // Dispatch disconnection event
        document.dispatchEvent(new Event('walletDisconnected'));

        showNotification('Wallet disconnected');
    }
    //#endregion

    //#region UI Handle
    updateUI(address) {
        if (!address) return;

        // Save to localStorage
        localStorage.setItem('walletAddress', address);

        // Update UI elements
        if (this.connectBtn) this.connectBtn.style.display = 'none';
        if (this.walletDropdown) this.walletDropdown.style.display = 'none';
        if (this.walletAddress) this.walletAddress.style.display = 'flex';

        // Shorten address for display
        const shortenedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
        if (this.addressText) this.addressText.textContent = shortenedAddress;

        // Add connected class to body
        document.body.classList.add(this.options.walletConnectedClass);
        document.body.classList.remove(this.options.walletDisconnectedClass);

        // Dispatch connection event
        document.dispatchEvent(new CustomEvent('walletConnected', {
            detail: { address, provider: this.provider, signer: this.signer }
        }));
    }
    //#endregion
}