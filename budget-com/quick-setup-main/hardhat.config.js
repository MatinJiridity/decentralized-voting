require("@nomiclabs/hardhat-waffle")
require("@semaphore-protocol/hardhat")
require("./tasks/deploy") // Your deploy task.

module.exports = {
    solidity: "0.8.4",
    hardhat: {
        chainId: 1337
    },
    
    networks: {

        sepolia: {
            url: `https://sepolia.infura.io/v3/69922510a01a4a12a85dbbbeab69bdf4`,
            accounts: ["23949ef3213f4423ea5a50089be9de2d714f385ed269eeb557b3323528cf0f63"]
        },
        
    //     // goerli : {
    //     //     url: ``,
    //     //     accounts: [""]
    //     // }
    }
}
