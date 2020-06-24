const ISSUE_DID_WASM_PATH= './compiled/issuedid.wasm';
const ISSUE_DID_ABI_PATH= './compiled/issuedid.abi';

let deploy = async function (eoslime, deployer) {

    if (!deployer) {
        deployer = await eoslime.Account.createRandom();
    }    
    let issueDidContract = await eoslime.Contract.deployOnAccount(ISSUE_DID_WASM_PATH, ISSUE_DID_ABI_PATH, deployer);
}

module.exports = deploy;