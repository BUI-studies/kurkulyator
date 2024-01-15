TransactionForm.prototype.makeSecondWalletInput = async function (inputName, existingWalletDOMElementValue) {
  const wallets = await getWallets()
  const walletsOptions = wallets.map((item) => item.name)
  wallets.splice(wallets.indexOf(existingWalletDOMElementValue), 1)
  // wallets.splice(wallets.indexOf(this.elements.wallets.from.value), 1)
  console.log(wallets)
  const walletsInput = document.createElement('select')
  walletsInput.name = inputName
  walletsInput.classList.add('transactionForm__wallet')
  walletsInput.innerHTML = makeOptions(walletsOptions, 'transactionForm__wallet-option')
  return walletsInput
}