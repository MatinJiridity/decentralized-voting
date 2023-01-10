import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import { Contract, Signer, providers, utils, Wallet, ethers } from "ethers";
import * as dotenv from 'dotenv';
import CommitmentsModal from "../models/commitment.js";
import { Identity } from '@semaphore-protocol/identity';
import { Group } from '@semaphore-protocol/group';
import { generateProof, packToSolidityProof, verifyProof } from '@semaphore-protocol/proof'

dotenv.config();

const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "semaphoreAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_groupId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "greeting",
        "type": "bytes32"
      }
    ],
    "name": "NewGreeting",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "identityCommitment",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "username",
        "type": "bytes32"
      }
    ],
    "name": "NewUser",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ballotBox",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGroupId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getResult",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "greeting",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "merkleTreeRoot",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "nullifierHash",
        "type": "uint256"
      },
      {
        "internalType": "uint256[8]",
        "name": "proof",
        "type": "uint256[8]"
      }
    ],
    "name": "greet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "groupId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "identityCommitment",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "username",
        "type": "bytes32"
      }
    ],
    "name": "joinGroup",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "semaphore",
    "outputs": [
      {
        "internalType": "contract ISemaphore",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const group = new Group();
const users = [];

const ethereumPrivateKey = process.env.ACCOUNT_KEY;
const ethereumURL = process.env.PROVIDER_URL;
const greeterAddress = process.env.Contract_Address;
const provider = new providers.JsonRpcProvider(ethereumURL);
const signer = new Wallet(ethereumPrivateKey, provider);
const contract = new Contract(greeterAddress, abi, signer);


export const listenToEvent = async () => {
  contract.on('NewUser', async (identityCommitment, username) => {

    console.log(`
    event:
    identityCommitment: ${identityCommitment.toString()} 
    username: ${username} 
    `);
    
    await CommitmentsModal.find({});
  
    await CommitmentsModal.updateOne({"groupId": 42},{ $push: {group : identityCommitment.toString()} })

});

}

export const addVoter = async (commitment, username) => {

  group.addMember(commitment);

  // console.log('group.members[0]:',group.members[0]);
  // console.log(group.members[0]);
  // console.log(group);

  // To Do: handle transaction error

  try {
    await contract.joinGroup(commitment, ethers.utils.formatBytes32String(username)).then(function (Instance) {
      console.log(Instance)
    })
  } catch (error) {
    var msg = error.message;
    console.log(msg)
  }

  // await contract.joinGroup(commitment, ethers.utils.formatBytes32String(username)).then(function (Instance) {
  //   console.log(Instance)
  // }).catch(function (error) {
  //   var msg = error.message;
  //   console.log(msg)
  // });
 
  // const groupId = await contract.groupId();
  // console.log(groupId.toString());
}


