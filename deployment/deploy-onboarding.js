const ONBOARDING_WASM_PATH= './compiled/onboarding.wasm';
const ONBOARDING_ABI_PATH= './compiled/onboarding.abi';

let deploy = async function (eoslime, deployer) {

    if (!deployer) {
        deployer = await eoslime.Account.createRandom();
    }    
    let onboardingContract = await eoslime.Contract.deployOnAccount(ONBOARDING_WASM_PATH, ONBOARDING_ABI_PATH, deployer);
}

module.exports = deploy;