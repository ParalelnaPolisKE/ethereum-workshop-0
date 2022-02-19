const PolisToken = artifacts.require('PolisToken');

module.exports = async function (deployer) {
  await deployer.deploy(PolisToken);
};