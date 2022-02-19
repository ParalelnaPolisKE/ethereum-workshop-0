module.exports = async function main(callback) {
  try {
    // Retrieve accounts from the local node
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
};

// module.exports = async function main(callback) {
//   try {
//     const Box = artifacts.require("Box");
//     const box = await Box.deployed();
//     const value = await box.retrieve();
//     console.log("Box value is", value.toString());

//     await box.store(23);
//     // Call the retrieve() function of the deployed Box contract
//     const value2 = await box.retrieve();
//     console.log('new Box value is', value2.toString());
//     callback(0);
//   } catch (error) {
//     console.error(error);
//     callback(1);
//   }
// };
