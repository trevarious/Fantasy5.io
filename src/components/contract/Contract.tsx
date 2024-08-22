import { web3 } from './web3Provider.js';
import { contractABI } from '../roll-six-win/abi.js';
import { contractAddress } from '../roll-six-win/address.js';

let contract;

let initializeContract = () => {
    contract = new web3.eth.Contract(contractABI, contractAddress);
    return contract;
}

export { initializeContract, contract };