module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost 
      port: 7545,            // Ethereum port 
      network_id: "*",       // Any network 
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.11",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
};
