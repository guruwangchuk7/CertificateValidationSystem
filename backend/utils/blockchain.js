const Web3 = require('web3');
const contractJson = require('../smart-contract/build/contracts/Certificate.json');
 // Adjust path if needed
require('dotenv').config();

// Connect to Ganache (or any Ethereum node)
const web3 = new Web3(process.env.GANACHE_URL);

// Extract contract address from deployed networks
const networkId = Object.keys(contractJson.networks)[0];
const contractAddress = contractJson.networks[networkId].address;

// Create contract instance using ABI and address
const certificateContract = new web3.eth.Contract(contractJson.abi, contractAddress);

// Export to use in routes
module.exports = { web3, certificateContract };
