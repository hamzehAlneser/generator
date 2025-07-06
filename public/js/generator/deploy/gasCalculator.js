import { Constants, Response } from '../../shared/Classes.js';

export async function getGasCostDetails(deployTX) {
    const gasPriceResult = await getGasPrice();
    const estimatedGas = await getEstimatedGas(deployTX);
    const gasLimit = calculateGasLimit(estimatedGas);
    return Response.success({ gasPriceResult, estimatedGas, gasLimit })
}

async function getEstimatedGas(deployTX) {
    const signer = await window.app.walletConnector.getSigner();
    const estimatedGas = await signer.provider.estimateGas({
        from: await signer.getAddress(),
        data: deployTX.data,
        value: deployTX.value || undefined
    });
    return estimatedGas
}

async function getGasPrice() {
    const optGasPrice = await getOptimalGasPrice()
    const bufferedGasPrice = optGasPrice.mul(ethers.BigNumber.from(120)).div(ethers.BigNumber.from(100));

    return bufferedGasPrice
}

async function getOptimalGasPrice() {
    const signer = await window.app.walletConnector.getSigner();
    if (!signer) throw new Error(Constants.generalError);

    const optimalGasPrice = await signer.getGasPrice()
    return optimalGasPrice
}

function calculateGasLimit(estimatedGas) {
    return ethers.BigNumber.from(estimatedGas).mul(ethers.BigNumber.from(120)).div(ethers.BigNumber.from(100));
}