import { ethers, Contract } from 'ethers';
import { abi as contractAbi } from '../quick-setup-main/artifacts/contracts/Greeter.sol/Greeter.json';
import Web3 from 'web3';            

const contractAddress = '0xBeDbE83c4fF923ac7c4477D9423581d42C0516E9';
var web3 = null;

const getBlockchain = () =>
    new Promise((resolve, reject) => {
        window.addEventListener('load', async () => {
            if (window.ethereum) {

                window.web3 = new Web3(window.ethereum);
                web3 = await window.web3;

                const networkId = await web3.eth.net.getId();

                console.log("getBlockNumber: ", web3.eth.getBlockNumber())
                console.log('networkId', networkId)

                const contract = new web3.eth.Contract(contractAbi, contractAddress);

                resolve({ contract });
            }
            resolve({ contract: undefined});
        });
    });

export default getBlockchain;