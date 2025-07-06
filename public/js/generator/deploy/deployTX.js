import { getGasCostDetails } from './gasCalculator.js';

export async function getDeployTxDetails(abi, bytecode) {
    const serviceFeesData = await getServiceFees()
    const deployTX = await generateDeployTX(abi, bytecode, serviceFeesData.feesWallet, serviceFeesData.fees)
    const costDetails = (await getGasCostDetails(deployTX)).data
    return { deployTX, costDetails, serviceFeesData }
}

async function getServiceFees() {
    const feesResponse = await window.app.apiClient.get("lookups/fees")
    if (feesResponse.hasErrors()) throw new Error(feesResponse.firstError())
    return feesResponse.data
}

async function generateDeployTX(abi, bytecode, serviceWallet, feesInETH) {
    const feesInWei = ethers.utils.parseEther(feesInETH)
    const signer = await window.app.walletConnector.getSigner()
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const deployTx = await factory.getDeployTransaction(serviceWallet, feesInWei, { value: feesInWei });

    return deployTx
}