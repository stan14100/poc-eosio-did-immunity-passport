const assert = require('assert');


const HEALTHORG_WASM_PATH = './compiled/healthorg.wasm';
const HEALTHORG_ABI_PATH = './compiled/healthorg.abi';

describe("Test Healthorg contract", function (eoslime) {

    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(150000);

    let healthOrgContract;
    let healthOrg1;
    let healthOrg2;

    const orgprofile1 = {
        id: 'did:eos:EOS8axLLpFh9da7mpBvTvUJ964HS6dMk1kaH39iLmr6CoQfkbCzij',
        email: 'org1.com',
        organizationId: 1,
        licenseId: 'mylicense'
    };

    const orgprofile2 = {
        id: 'did:eos:EOS6LrK9kMBvqM2msM5mBkf54B8dsk37FZVmeE9dLjrYoRbDFkkkK',
        email: 'org2.com',
        organizationId: 2,
        licenseId: 'thisLicense'
    };

    before(async () => {

        contract = await eoslime.Account.load('healthorg', '5KkRbNHzu694gwx1BV7UMRvHZVVKmmLoRUmF5jkuDqoMYyJA3By');
        healthOrg1 = await eoslime.Account.load('healthorg1', '5HsWbyvg3gFzY2Hmggz8xRgZya39Z2WXbFE76FXMT33KZ8obaxR');
        healthOrg2 = await eoslime.Account.load('healthorg2', '5JtSzuqcv3S834aqk7jxRoS9a1JcRwBx1jreJ5zvFcHy7sYvef2');
        healthOrgContract = await eoslime.Contract.deployOnAccount(HEALTHORG_WASM_PATH,HEALTHORG_ABI_PATH,contract);

    });
    
    it("Adds org1 to health organization table", async () => {
        try{
        await healthOrgContract.upsert(healthorg1.name, "org1.com",1,"mylicense","issuedid",contract.name, {from: contract});
        
        let healthOrgData = await healthOrgContract.orgs.equal(healthOrg1.name).find();

        assert.equal(healthOrgData[0].key, healthOrg1.name, "Incorrect user");
        assert.equal(healthOrgData[0].id, orgprofile1.id, "Incorrect DID");
        assert.equal(healthOrgData[0].email, orgprofile1.email, "Incorrect Email");
        assert.equal(healthOrgData[0].organizationId,orgprofile1.organizationId,"Incorrect Organization ID");
        assert.equal(healthOrgData[0].licenseIssuedByGov,orgprofile1.licenseId,"Incorrect License");
        
        }catch(error){
            console.log(error);
        }
        
    });

    it("Adds org2 to health organization table", async () => {
        try{
        await healthOrgContract.upsert(healthOrg2.name, "org2.com",2,"thisLicense","issuedid",contract.name, {from: contract});
        
        let healthOrgData = await healthOrgContract.orgs.equal(healthOrg2.name).find();

        assert.equal(healthOrgData[0].key, healthOrg2.name, "Incorrect user");
        assert.equal(healthOrgData[0].id, orgprofile2.id, "Incorrect DID");
        assert.equal(healthOrgData[0].email, orgprofile2.email, "Incorrect Email");
        assert.equal(healthOrgData[0].organizationId,orgprofile2.organizationId,"Incorrect Organization ID");
        assert.equal(healthOrgData[0].licenseIssuedByGov,orgprofile2.licenseId,"Incorrect License");
        
        }catch(error){
            console.log(error);
        }
        
    });
    
});
