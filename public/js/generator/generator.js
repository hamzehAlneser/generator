import { validateWalletAndGetFormData, prepare } from './validate.js';
import { getDeployTxDetails } from './deploy/deployTX.js';
import { deploy } from './deploy/deploy.js';
import { verifyContract } from './verify.js';
import { verifyManual } from './verify.js';
import { addLiquidity } from './openTrading.js';

const tokenGeneratorLink = document.getElementById('token-generator-link');
const deployBtn = document.getElementById('deploy-btn');
const deploymentModal = document.getElementById('deployment-modal');
const closeModal = document.getElementById('close-modal');
const progressBar = document.getElementById('progress-bar');
const deploymentLinks = document.getElementById('deployment-links');

document.getElementById('deploy-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    try {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        const validData = await validateWalletAndGetFormData(e.target)

        showDeplymentModel()

        const prepareResponse = await prepareContract(validData)
        const contractAddress = await startDeploy(prepareResponse.contractData, validData.liquidity, prepareResponse.validatedData);

        const verifyPromise = verifyContract(prepareResponse.validatedData, contractAddress)
            .catch(err => console.error('verifyContract failed:', err));

        await openTrading(contractAddress, prepareResponse.validatedData.liquidity, prepareResponse.contractData.abi)
        await complete()
        await verifyPromise;
        await finalize(contractAddress, prepareResponse.validatedData.isOptimization, prepareResponse.validatedData.tokenName);
    }
    catch (error) {
        showNotification(error.reason || error.message, 'error');
        hideBillModal()
        resetDeploymentModel()
    }
})

function resetDeploymentModel() {
    deploymentModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showDeplymentModel() {
    deploymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset progress
    progressBar.style.width = '0%';
    deploymentLinks.style.display = 'none';
    closeModal.style.display = 'none'
    // Reset steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('completed', 'in-progress');
        step.querySelector('.step-icon i').className = 'fas fa-spinner';
    });
}
document.addEventListener('DOMContentLoaded', (e) => {
    // Token economics elements
    const marketCapEl = document.getElementById('market-cap');
    const tokenPriceEl = document.getElementById('token-price');
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    tokenGeneratorLink.classList.add('active');

    // Update token preview
    function updateTokenPreview() {
        const tokenName = document.getElementById('tokenName').value || 'CryptoGem';
        const tokenSymbol = document.getElementById('tokenSymbol').value || 'GEM';
        const supply = document.getElementById('totalSupply').value || '1000000';
        const buyTax = document.getElementById('buyTax').value || '5';
        const sellTax = document.getElementById('sellTax').value || '5';
        const liquidity = document.getElementById('liquidity').value || '0.5';
        const decimals = document.getElementById('tokenDecimal').value || '9';

        const tokenPreview = document.querySelector('.token-preview');
        tokenPreview.querySelector('h3').textContent = `${tokenName} (${tokenSymbol})`;

        const details = tokenPreview.querySelector('.token-details');
        details.innerHTML = `
            <div class="token-detail">
                <span class="token-label">Supply:</span>
                <span class="token-value">${parseInt(supply).toLocaleString()}</span>
            </div>
            <div class="token-detail">
                <span class="token-label">Decimals:</span>
                <span class="token-value">${decimals}</span>
            </div>
            <div class="token-detail">
                <span class="token-label">Buy Tax:</span>
                <span class="token-value">${buyTax}%</span>
            </div>
            <div class="token-detail">
                <span class="token-label">Sell Tax:</span>
                <span class="token-value">${sellTax}%</span>
            </div>
            <div class="token-detail">
                <span class="token-label">Liquidity:</span>
                <span class="token-value">${liquidity} ETH</span>
            </div>
        `;
    }


    // Add event listeners to update preview and economics
    ['tokenName', 'tokenSymbol', 'totalSupply', 'buyTax',
        'sellTax', 'liquidity', 'tokenDecimal', 'totalSupply'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                updateTokenPreview();
            });
        });


    // Show notification


    // Initialize token preview and economics
    updateTokenPreview();
})
// Navigation elements

//#region Prepare
async function prepareContract(formData) {
    await activateStep(0)
    return await prepare(formData)
}
//#endregion

//#region Deploy
async function startDeploy(contractData, liquidity, formData) {
    await activateStep(1)
    const deployTxData = await getDeployTxDetails(contractData.abi, contractData.bytecode)

    showBillModal(deployTxData.costDetails.estimatedGas, deployTxData.serviceFeesData.fees, liquidity)

    document.querySelector('.bill-btn.cancel').addEventListener('click', function () {
        console.log('User clicked Cancel');
        hideBillModal()
        resetDeploymentModel()
    });

    await waitForClick('.bill-btn.proceed');

    hideBillModal()

    const contractAddress = await deploy(deployTxData.deployTX, deployTxData.costDetails.gasLimit, deployTxData.costDetails.gasPriceResult, formData)
    return contractAddress
}

function waitForClick(selector) {
    return new Promise((resolve) => {
        const el = document.querySelector(selector);
        if (!el) return resolve(null); // fallback if element not found
        const handler = () => {
            el.removeEventListener('click', handler);
            resolve(); // continue the flow
        };
        el.addEventListener('click', handler);
    });
}
//#endregion

//#region Steps Deployment Modal
async function activateStep(stepIndex) {
    const steps = document.querySelectorAll('.step');

    if (stepIndex === 5) {
        steps[4].classList.remove('in-progress');
        steps[4].classList.add('completed');
        steps[4].querySelector('.step-icon i').className = 'fas fa-check';
        return
    }
    const progress = (stepIndex + 1) * 20;


    if (stepIndex > 0) {
        steps[stepIndex - 1].classList.remove('in-progress');
        steps[stepIndex - 1].classList.add('completed');
        steps[stepIndex - 1].querySelector('.step-icon i').className = 'fas fa-check';
    }

    progressBar.style.width = `${progress}%`;
    steps[stepIndex].classList.add('in-progress');
    await new Promise(resolve => setTimeout(resolve, 1500));
}
//#endregion

//#region Open Trading
async function openTrading(contractAddress, liquidity, abi) {
    await activateStep(2)
    await addLiquidity(contractAddress, liquidity, abi)
    await new Promise(resolve => setTimeout(resolve, 2000));

}
//#endregion

//#region Completing
async function complete() {
    await activateStep(3)
    await new Promise(resolve => setTimeout(resolve, 2000));
}
//#endregion

//#region Finalize
async function finalize(contractAddress, isOptimization, tokenName) {
    await activateStep(4)

    var etherscanLink = document.getElementById('etherscan-link')
    etherscanLink.href = `https://etherscan.io/address/${contractAddress}`;

    var dextoolsLink = document.getElementById('dextools-link')
    dextoolsLink.href = `https://www.dextools.io/app/en/ether/pair-explorer/${contractAddress}`;

    // document.getElementById('verify-manual').addEventListener('click', async function () {
    //     await verifyManual(contractAddress, isOptimization, tokenName)
    // });

    await new Promise(resolve => setTimeout(resolve, 2000));

    deploymentLinks.style.display = 'flex';
    showCloseDeployModal()
    await activateStep(5)
}

function showCloseDeployModal() {
    closeModal.style.display = 'block'
    // Close modal
    closeModal.addEventListener('click', function () {
        deploymentModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        closeModal.style.display = 'none'

    });
}
//#endregion