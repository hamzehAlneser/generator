
export async function prepare(formData) {
    const validatedData = await validateTokenParameters(formData)
    await new Promise(resolve => setTimeout(resolve, 1500));

    await validateWallet(formData.fromBot)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const contractData = await generateContract(validatedData)
    await new Promise(resolve => setTimeout(resolve, 1500));

    return { contractData, validatedData }
}

async function validateWallet(fromBot) {
    let logData = {
        fromBot: fromBot || false,
        wallet: await window.app.walletConnector.getAddress()
    }
    const authResponse = await window.app.apiClient.post("authenticate", logData)
}

async function validateTokenParameters(formData) {
    var validateResponse = await window.app.apiClient.post("validate", formData)
    if (validateResponse.hasErrors()) throw new Error(validateResponse.firstError())
    return validateResponse.data
}

async function generateContract(validatedData) {
    var generateResponse = await window.app.apiClient.post("contract", validatedData)
    if (generateResponse.hasErrors()) throw new Error(generateResponse.firstError())
    return generateResponse.data
}

//#region validate wallet connection
export async function validateWalletAndGetFormData(target) {
    var connectionResponse = await window.app.walletConnector.validateWalletConnection()
    if (connectionResponse.hasErrors()) throw new Error(connectionResponse.firstError())

    const form = target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.networkId = await window.app.walletConnector.getNetworkID();

    return data
}
//#endregion