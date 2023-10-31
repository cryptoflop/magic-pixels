require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    }
  },
  compilers: {
    solc: {
      version: '0.8.18'    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
}
