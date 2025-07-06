// Modal Control Functions
function showBillModal(networkFee, serviceFee, liquidityinETH) {
    let networkFeeSpan = document.getElementById('bill-row-network-fee')
    let serviceFeeSpan = document.getElementById('bill-row-service-fee')
    let liquiditySpan = document.getElementById('bill-row-liquidity')
    let totalSpan = document.getElementById('bill-row-total')

    networkFeeSpan.textContent = ethers.utils.formatEther(networkFee) + "  ETH"
    serviceFeeSpan.textContent = serviceFee + "  ETH"
    liquiditySpan.textContent = liquidityinETH + "  ETH"

    const feesInWei = ethers.utils.parseEther(serviceFee)
    const liquidityInWei = ethers.utils.parseEther(liquidityinETH)
    const totalInWei = feesInWei.add(networkFee).add(liquidityInWei);
    const totalCostInETH = ethers.utils.formatEther(totalInWei)

    totalSpan.textContent = totalCostInETH + "  ETH"

    const modal = document.getElementById('bill-modal');
    modal.classList.add('active');
}
function hideBillModal() {
    let networkFeeSpan = document.getElementById('bill-row-network-fee')
    let serviceFeeSpan = document.getElementById('bill-row-service-fee')
    let liquiditySpan = document.getElementById('bill-row-liquidity')
    let totalSpan = document.getElementById('bill-row-total')

    networkFeeSpan.textContent = ""
    serviceFeeSpan.textContent = ""
    liquiditySpan.textContent = ""
    totalSpan.textContent = ""

    const modal = document.getElementById('bill-modal');
    modal.classList.remove('active');

}