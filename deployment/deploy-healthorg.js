const HEALTHORG_WASM_PATH= './compiled/healthorg.wasm';
const HEALTHORG_ABI_PATH= './compiled/healthorg.abi';

let deploy = async function (eoslime, deployer) {

    if (!deployer) {
        deployer = await eoslime.Account.createRandom();
    }    
    let healthOrgContract = await eoslime.Contract.deployOnAccount(HEALTHORG_WASM_PATH, HEALTHORG_ABI_PATH, deployer);
}

module.exports = deploy;