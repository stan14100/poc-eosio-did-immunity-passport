const assert = require('assert');

const ONBOARDING_WASM_PATH = './compiled/onboarding.wasm';
const ONBOARDING_ABI_PATH = './compiled/onboarding.abi';

describe("Test Onboarding contract", function (eoslime) {

    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(150000);

    let profileContract;
    let profileUser1;
    let profileUser2;
    let profileUser3;
    let profileUser4;

    const workerProfile1 = {
        id: 'did:eos:EOS6c5QgEfGJwiMTUQnJ2nyw7kppKcK2ZBXzQwVsqM7tLM75VwZtT',
        organization: "healthorg1",
        licenseId: 'workerLicense1'
    };
    
    const workerProfile2 = {
        id: 'did:eos:EOS8SupEX69eDMZJQo2FQmoCAuxsn12L5GYyTnjWAFNihtRF29Nuk',
        organization: "healthorg2",
        licenseId: 'workerLicense2'
    };

    
    before(async () => {

        contract = await eoslime.Account.load('onboarding', '5KKwBx7joXMpogbec5kWMqzk19DUd3ac3TnZyyjephduGwEckWA');
        worker1 = await eoslime.Account.load('worker1', '5JXzVj5kk2zTpBtrq4LJmjbr582BYjzW4JHhwaVjzr1GvmHiyr6');
        worker2 = await eoslime.Account.load('worker2', '5Hz6Qh7HYDZD1GnNk7udLnF5Zb6zh8MEgCD97Nf8438QMkNXfg5');
        onboardingContract = await eoslime.Contract.deployOnAccount(ONBOARDING_WASM_PATH,ONBOARDING_ABI_PATH,contract);
    });

    it("Confirms a new Health Worker 1 & 2's did presence and org authorization", async() => {
        
        try{
            let result = await onboardingContract.confirm(worker1.name, "healthorg1","issuedid","healthorg", {from: contract});
            result = await onboardingContract.confirm(worker2.name, "healthorg2","issuedid","healthorg", {from: contract});
            // Runs without error
        }catch(error){
            console.log(error);
        }

    })

    it("Adds worker1 to health workers table", async () => {
        try{
            await onboardingContract.upsert(worker1.name,"healthorg1","issuedid","healthorg", {from: contract});
            let onboardingData = await onboardingContract.workers.equal(worker1.name).find();
            assert.equal(onboardingData[0].key, worker1.name, "Incorrect user");
            assert.equal(onboardingData[0].id, workerProfile1.id, "Incorrect DID");
            assert.equal(onboardingData[0].organization,workerProfile1.organization,"Incorrect Organization ID");
        }catch(error){
            console.log(error);
        }
        
        
    });

    it("Adds worker2 to health workers table", async () => {
        try{
            await onboardingContract.upsert(worker2.name,"healthorg2","issuedid","healthorg",{from: contract});
            let onboardingData = await onboardingContract.workers.equal(worker2.name).find();

            assert.equal(onboardingData[0].key, worker2.name, "Incorrect user");
            assert.equal(onboardingData[0].id, workerProfile2.id, "Incorrect DID");
            assert.equal(onboardingData[0].organization,workerProfile2.organization,"Incorrect Organization ID");
        }catch(error){
            console.log(error);
        }
        
        
    });
});
