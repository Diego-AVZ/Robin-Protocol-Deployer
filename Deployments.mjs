import Web3 from 'web3';
//import { Wallet, Provider } from 'zksync';
import { Provider, Wallet, types } from "zksync-web3"; 
import { ethers } from 'ethers';
import * as rpc from "./constants/rpc.mjs"
import * as keys from "./constants/keys.mjs"
import * as contracts from "./constants/contracts.mjs"
import * as functions from "./admin.mjs";


const rpcs = [rpc.urlArb, rpc.urlScroll, rpc.urlBnb, rpc.urlLinea];

let contractAddresses = {
    aData : "",
    aReferral: "",
    aTokens: "",
    aMonitors: "",
    aAuth: "",
    aFunds: "",
    aMain: "",
    aMetaTxs: ""
};

let contractList = [
    {
        contract : contracts.dataContract,
        inputs : [],
        address : "aData"
    },
    {
        contract : contracts.referralContract,
        inputs : [],
        address : "aReferral" 
    },
    {
        contract : contracts.authContract,
        inputs : [],
        address : "aAuth"
    },
    {
        contract : contracts.tokensContract,
        inputs : [contractAddresses.aData],
        address : "aTokens"
    },
    {
        contract : contracts.monitorsContract,
        inputs : [contractAddresses.aReferral,contractAddresses.aData],
        address : "aMonitors"
    },
    {
        contract : contracts.fundsContract,
        inputs : [keys.owner,contractAddresses.aReferral,contractAddresses.aMonitors, contractAddresses.aTokens,contractAddresses.aData],
        address : "aFunds"
    },
    {
        contract : contracts.metaContract,
        inputs : [contractAddresses.aFunds],
        address : "aMetaTxs"
    },
    {
        contract : contracts.mainContract,
        inputs : [contractAddresses.aAuth,contractAddresses.aReferral,contractAddresses.aTokens,contractAddresses.aMonitors,contractAddresses.aFunds],
        address : "aMain"
    }
]

async function deploy(_contract, inputs, _rpc, address){
    try{
        const web3 = new Web3(_rpc);
        const contract = new web3.eth.Contract(_contract.abi);
        const deployData = contract.deploy({
            data: _contract.bCode,
            arguments: inputs
        }).encodeABI();
        console.log("Deploying...");
        const gasLimit = await contract.deploy({ data: _contract.bCode, arguments: inputs }).estimateGas({ from: keys.owner });
        const gasPrice = await web3.eth.getGasPrice();
        const nonce = await web3.eth.getTransactionCount(keys.owner, "latest");
        const tx = {
            nonce: nonce,
            from: keys.owner,
            data: deployData,
            gas: gasLimit,
            gasPrice: gasPrice,
        };
        var signedTx = await web3.eth.accounts.signTransaction(tx, keys.ownerPriv);
        var txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        contractAddresses[address] = txReceipt.contractAddress;
        rebuildContractList();
        console.log(_contract.name + " DEPLOYED ··· Contract Address => " + txReceipt.contractAddress);
    } catch(error){
        console.log(error);
    }
} 

async function deployAll() {
    for(var j = 0; j < rpcs.length; j++){
        console.log(" ### ### ### ");
        console.log("CURRENT NETWORK RPC => " + rpcs[j]);
        for(var i = 0; i < contractList.length; i++){
            var contract = contractList[i];
            await deploy(contract.contract, contract.inputs, rpcs[j], contract.address);
        }
        console.log("");
        await functions.registerTokenJs(contracts.tokens[j].token, contracts.tokens[j].rpc, contractAddresses.aTokens);
        await functions.verifyTokenJs(contracts.tokens[j].token, true, contracts.tokens[j].rpc, contractAddresses.aTokens);
        await functions.setFundsJs(contractAddresses.aMetaTxs, rpcs[j], contractAddresses.aFunds);
    }
}

deployAll();

function rebuildContractList(){
    contractList = [
        {
            contract : contracts.dataContract,
            inputs : [],
            address : "aData"
        },
        {
            contract : contracts.referralContract,
            inputs : [],
            address : "aReferral" 
        },
        {
            contract : contracts.authContract,
            inputs : [],
            address : "aAuth"
        },
        {
            contract : contracts.tokensContract,
            inputs : [contractAddresses.aData],
            address : "aTokens"
        },
        {
            contract : contracts.monitorsContract,
            inputs : [contractAddresses.aReferral,contractAddresses.aData],
            address : "aMonitors"
        },
        {
            contract : contracts.fundsContract,
            inputs : [keys.owner,contractAddresses.aReferral,contractAddresses.aMonitors, contractAddresses.aTokens,contractAddresses.aData],
            address : "aFunds"
        },
        {
            contract : contracts.metaContract,
            inputs : [contractAddresses.aFunds],
            address : "aMetaTxs"
        },
        {
            contract : contracts.mainContract,
            inputs : [contractAddresses.aAuth,contractAddresses.aReferral,contractAddresses.aTokens,contractAddresses.aMonitors,contractAddresses.aFunds],
            address : "aMain"
        }
    ];
}









/*

const zkSyncProvider = new Provider(rpc.urlZk); // URL del proveedor de zkSync
const zkSyncWallet = new Wallet(keys.ownerPriv, zkSyncProvider);

const web3Provider = new Web3(rpc.urlZk); // URL del proveedor de Ethereum

// ABI y Bytecode del contrato a desplegar
const contractABI = contracts.dataContract.abi; // Reemplaza con el ABI del contrato
const contractBytecode = contracts.dataContract.bCode; // Reemplaza con el bytecode del contrato

async function deployContract() {
    try {
        // Crear una instancia del contrato
        const contract = new web3Provider.eth.Contract(contractABI);

        // Obtener las opciones de despliegue del contrato
        const deployOptions = {
            data: contractBytecode,
            arguments: []
        };

        // Crear la transacción de despliegue
        const deployTransaction = contract.deploy(deployOptions);

        // Estimar el gas necesario para el despliegue
        const gasEstimate = await deployTransaction.estimateGas({ from: zkSyncWallet.address });
        const gasPrice = await web3Provider.eth.getGasPrice();

        // Obtener el nonce para la transacción
        const nonce = await zkSyncProvider.getTransactionCount(zkSyncWallet.address);

        // Crear el objeto de transacción
        const tx = {
            from: zkSyncWallet.address,
            data: deployTransaction.encodeABI(),
            gas: gasEstimate,
            gasPrice: gasPrice,
            nonce: nonce,
        };

        // Firmar la transacción
        const signedTx = await zkSyncWallet.signTransaction(tx);

        // Enviar la transacción firmada
        const txHash = await zkSyncProvider.sendTransaction(signedTx);
        const receipt = await zkSyncProvider.waitForTransaction(txHash);

        console.log('Contrato desplegado en:', receipt.contractAddress);
    } catch (error) {
        console.error('Error al desplegar el contrato:', error);
    }
}

deployContract();
*/