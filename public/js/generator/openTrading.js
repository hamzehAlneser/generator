export async function addLiquidity(contractAddress, liquidity, abi) {

    const signer = await window.app.walletConnector.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const options = { value: ethers.utils.parseEther(liquidity) };

    const tx = await contract.openTrading(options);

    await tx.wait();
    await new Promise(resolve => setTimeout(resolve, 2000));

}