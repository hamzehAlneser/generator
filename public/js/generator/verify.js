export async function verifyContract(postData, contractAddress) {
    postData.contractAddress = contractAddress;
    var verifyResponse = await window.app.apiClient.post("verify", postData)
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (verifyResponse.hasErrors()) throw new Error(verifyResponse.firstError())
    return verifyResponse.data
}

export async function verifyManual(contractAddress, isOptimization, tokenName) {
    var verifyData = {
        isOptimization: isOptimization,
        contractAddress: contractAddress,
        tokenName: tokenName
    }
    var verifyManualResponse = await window.app.apiClient.post("verify/manual", verifyData)

    const result = await verifyManualResponse.blob()

    const url = window.URL.createObjectURL(result);
    // Create a link element
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // Set the download name
    a.download = `${verifyData.tokenName}_verify.zip`;
    // Append the link to the body
    document.body.appendChild(a);
    // Force download
    a.click();
    // Clean up by removing the link and revoking the URL
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}