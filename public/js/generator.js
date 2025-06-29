const tokenGeneratorLink = document.getElementById('token-generator-link');
const deployBtn = document.getElementById('deploy-btn');
const deploymentModal = document.getElementById('deployment-modal');
const closeModal = document.getElementById('close-modal');
const progressBar = document.getElementById('progress-bar');
const deploymentLinks = document.getElementById('deployment-links');

document.addEventListener('DOMContentLoaded', (e) => {
    // Token economics elements
    const marketCapEl = document.getElementById('market-cap');
    const tokenPriceEl = document.getElementById('token-price');
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    tokenGeneratorLink.classList.add('active');
});

// Navigation elements

