const IMMPASS_WASM_PATH= './compiled/healthorg.wasm';
const IMMPASS_ABI_PATH= './compiled/healthorg.abi';

let deploy = async function (eoslime, deployer) {

    if (!deployer) {
        deployer = await eoslime.Account.createRandom();
    }    
    let immunityPassportContract = await eoslime.Contract.deployOnAccount(IMMPASS_WASM_PATH, IMMPASS_ABI_PATH, deployer);
}

module.exports = deploy;