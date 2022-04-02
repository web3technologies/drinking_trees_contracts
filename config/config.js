

const deployConfig = {
    tokenName: "Drinking Trees",
    tokenSymbol: "DRT",
    maxAmountPerTransaction: 1,
    hiddenMetaDataURI: "ipfs://QmPvgdkcXHVEqgL9427bEKef18GW92XR8zpvPW1NKmnefu/hidden.json",
    uriPrefix: "ipfs://Qmbk6yP3XSUwaXNTYkghsg53MBEy4yUxTCPiDdFaUo3jki"
}

export const deployArgs = [
    deployConfig.tokenName,
    deployConfig.tokenSymbol,
    deployConfig.maxAmountPerTransaction,
    deployConfig.hiddenMetaDataURI,
    deployConfig.uriPrefix
]