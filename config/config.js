

const deployConfig = {
    tokenName: "Drinking Trees",
    tokenSymbol: "DRT",
    maxAmountPerTransaction: 5,
    hiddenMetaDataURI: "ipfs://QmPvgdkcXHVEqgL9427bEKef18GW92XR8zpvPW1NKmnefu/hidden.json"
}

const deployArgs = [
    deployConfig.tokenName,
    deployConfig.tokenSymbol,
    deployConfig.maxAmountPerTransaction,
    deployConfig.hiddenMetaDataURI
  ]


module.exports = {
    deployArgs: deployArgs,
    deployConfig: deployConfig
  }