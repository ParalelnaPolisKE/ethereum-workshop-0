const { expect } = require('chai');
const Box = artifacts.require('Box');

contract('Box', function () {
  beforeEach(async function () {
    // Deploy a new Box contract for each test
    this.box = await Box.new();
  });

  it('retrieve returns a value previously stored', async function () {
    await this.box.store(42);

    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await this.box.retrieve()).toString()).to.equal('42');
  });
});