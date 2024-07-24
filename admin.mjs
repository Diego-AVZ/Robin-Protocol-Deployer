import Web3 from 'web3';
import * as rpc from "./constants/rpc.mjs"
import * as keys from "./constants/keys.mjs"
import * as contracts from "./constants/contracts.mjs"
import * as abis from "./constants/abis.mjs"

/*
const funds = new web3.eth.Contract(abis.fundsAbi, contracts.funds);
const metaTxs = new web3.eth.Contract(abis.metaAbi, contracts.meta);


async function setPrice() {
    try{
        const data = funds.methods.setPrice(5000000000000000).encodeABI();
        const nonce = await web3.eth.getTransactionCount(keys.address, "latest");
        const gasLimit = 300000;//await web3.eth.estimateGas();
        const gasPrice = 4500000000;//await web3.eth.getGasPrice();
        console.log(gasLimit);
        const tx = {
            nonce : nonce,
            to: contracts.funds,
            gas: gasLimit,
            gasPrice: gasPrice,
            data: data
        }
        var signedTx = await web3.eth.accounts.signTransaction(tx, keys.priv);
        console.log("Signed transaction");
        var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Transaction receipt");
    } catch(error){console.error(error);}
}
*/

export async function verifyTokenJs(token, boolean, rpc, address) {
    try{
        const web3 = new Web3(rpc);
        const rTokens = new web3.eth.Contract(contracts.tokensContract.abi, address);
        const nonce = await web3.eth.getTransactionCount(keys.owner, "latest");
        const data = rTokens.methods.verifyToken(token,true).encodeABI();
        const gasLimit = await rTokens.methods.verifyToken(token,true).estimateGas({ from: keys.owner });
        const gasPrice = await web3.eth.getGasPrice();
        const tx = {
            nonce : nonce,
            to: address,
            gas: gasLimit,
            gasPrice: gasPrice,
            data: data
        }
        var signedTx = await web3.eth.accounts.signTransaction(tx, keys.ownerPriv);
        var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Token Verified ··· TX HASH => " + txReceipt.transactionHash);
    } catch(error){console.error("Error, token not verified " + error);}
}

export async function registerTokenJs(token, rpc, address) {
    try{
        const web3 = new Web3(rpc);
        const rTokens = new web3.eth.Contract(contracts.tokensContract.abi, address);
        const nonce = await web3.eth.getTransactionCount(keys.owner, "latest");
        const data = rTokens.methods.registerToken(token).encodeABI();
        const gasLimit = await rTokens.methods.registerToken(token).estimateGas({ from: keys.owner });
        const gasPrice = await web3.eth.getGasPrice();
        const tx = {
            nonce : nonce,
            to: address,
            gas: gasLimit,
            gasPrice: gasPrice,
            data: data
        }
        var signedTx = await web3.eth.accounts.signTransaction(tx, keys.ownerPriv);
        var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Token Registered ··· TX HASH => " + txReceipt.transactionHash);
    } catch(error){console.error("Error, token not registered " + error);}
}

export async function setFundsJs(aMeta, rpc, address) {
    try{
        const web3 = new Web3(rpc);
        const meta = new web3.eth.Contract(contracts.metaContract.abi, aMeta);
        const nonce = await web3.eth.getTransactionCount(keys.owner, "latest");
        const data = meta.methods.setFunds(address).encodeABI();
        const gasLimit = await meta.methods.setFunds(address).estimateGas({ from: keys.owner });
        const gasPrice = await web3.eth.getGasPrice();
        const tx = {
            nonce : nonce,
            to: aMeta,
            gas: gasLimit,
            gasPrice: gasPrice,
            data: data
        }
        var signedTx = await web3.eth.accounts.signTransaction(tx, keys.ownerPriv);
        var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Funds Set ··· TX HASH => " + txReceipt.transactionHash);
    } catch(error){console.error("Error,  Funds not registered " + error);}
}
/*
registerTokenJs(

);
verifyTokenJs(
    "0xA7A414AEa71D0f19d3001cf507c30d37ddE9b602", 
    false, 
    "https://endpoints.omniatech.io/v1/zksync-era/sepolia/public",
    "0xe083aa50f6da2f98927ebbf79465ffbb0a185235"
);


async function sendMetaTxs(
            userAddress,
            functionSignature,
            r,
            s,
            v,
            token
) {
    try{
        const data = metaTxs.methods.executeMetaTransaction(
            userAddress,
            functionSignature,
            r,
            s,
            v,
            token
        ).encodeABI();
        const nonce = await web3.eth.getTransactionCount(keys.address, "latest");
        const gasLimit = 300000;//await web3.eth.estimateGas();
        const gasPrice = 4500000000;//await web3.eth.getGasPrice();
        console.log(gasLimit);
        const tx = {
            nonce : nonce,
            to: contracts.meta,
            gas: gasLimit,
            gasPrice: gasPrice,
            data: data
        }
        var signedTx = await web3.eth.accounts.signTransaction(tx, keys.relayerPriv);
        console.log("Signed transaction");
        var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Transaction receipt");
    } catch(error){console.error(error);}
}

async function setFunds(){
    try{
        const nonce = await web3.eth.getTransactionCount(keys.owner, "latest");
        const data = metaTxs.methods.setFunds("0x18926C42a2Dec9810A34fdb3793ebF72Fa331efb").encodeABI();
        const gasLimit = 300000;//await web3.eth.estimateGas();
        const gasPrice = 4500000000;//await web3.eth.getGasPrice();
        console.log(gasLimit);
        const tx = {
            nonce : nonce,
            to: contracts.meta,
            gas: gasLimit,
            gasPrice: gasPrice,
            data: data
        }
        var signedTx = await web3.eth.accounts.signTransaction(tx, keys.ownerPriv);
        console.log("Signed transaction");
        var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Transaction receipt");
    } catch(error){
        console.error(error);
    }
}

async function setRobin(){
    try{
        const nonce = await web3.eth.getTransactionCount(keys.owner, "latest");
        const data = funds.methods.setRobin("0x25cb62915b6b970c1A5a8be669218028c7940a18").encodeABI();
        const gasLimit = 300000;//await web3.eth.estimateGas();
        const gasPrice = 4500000000;//await web3.eth.getGasPrice();
        console.log(gasLimit);
        const tx = {
            nonce : nonce,
            to: contracts.funds,
            gas: gasLimit,
            gasPrice: gasPrice,
            data: data
        }
        var signedTx = await web3.eth.accounts.signTransaction(tx, keys.ownerPriv);
        console.log("Signed transaction");
        var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Transaction receipt");
    } catch(error){
        console.error(error);
    }
}



/*
sendMetaTxs(
    "0x8a8D39d9CB8458E98B570Fc58652112A090fe44D",
    "0x68155ec10000000000000000000000008200c08299b2f04f3d4b1148b3696941ce02ea6e0000000000000000000000003ba9f06119610c895fd639f53eae12cdeea9cda30000000000000000000000008a8d39d9cb8458e98b570fc58652112a090fe44d0000000000000000000000000000000000000000000000003782dace9d900000",
    "0x32a5be10635f0a72e27079311a1d68932a757ad5f2f72247606e233b180a7b6d",
    "0x6c67d7b734c86396097a9840ca5d161b7e096cecb19090cab11b4f96b5dfe568",
    28,
    "0x8200c08299B2f04f3d4b1148B3696941CE02ea6e"
);
*/