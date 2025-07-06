export async function deploy(deployTx, gasLimit, gasPrice, formData) {
    const contractAddress = await sendDeployTX(deployTx, gasLimit, gasPrice)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const addToLivePairsResponse = await addToLivePairs(contractAddress, formData.tokenName, formData.tokenSymbol);
    await new Promise(resolve => setTimeout(resolve, 1500));

    return contractAddress
}

async function sendDeployTX(deployTx, gasLimit, gasPrice) {
    const signer = await window.app.walletConnector.getSigner();

    const txResponse = await signer.sendTransaction({
        ...deployTx,
        gasLimit: gasLimit,
        gasPrice: gasPrice
    });
    const receipt = await txResponse.wait(1);

    return receipt.contractAddress
}

async function addToLivePairs(contractAddress, name, symbol) {
    let logData = {
        address: contractAddress,
        name: name,
        symbol: symbol
    }
    var addToLivePairsResponse = await window.app.apiClient.post("livePairs", logData)
    if (addToLivePairsResponse.hasErrors()) throw new Error(addToLivePairsResponse.firstError())
    return addToLivePairsResponse
}