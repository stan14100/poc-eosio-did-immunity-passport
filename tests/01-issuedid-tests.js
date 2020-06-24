const assert = require('assert');

const ISSUE_DID_WASM_PATH = './compiled/issuedid.wasm';
const ISSUE_DID_ABI_PATH = './compiled/issuedid.abi';

describe("Test DID contract", function (eoslime) {

    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(150000);
    let individual1;
    let individual2;
    let issueDidContract;

    const userprofile1 = {
        name : 'individual1',
        id : 'did:eos:EOS75ofK3LWeH7uReyjz3BrF44p9p1SUYQRDctXg8M3PcHqB5XXKV',
        controllerId : 'did:eos:EOS75ofK3LWeH7uReyjz3BrF44p9p1SUYQRDctXg8M3PcHqB5XXKV',
        publicKey : 'EOS75ofK3LWeH7uReyjz3BrF44p9p1SUYQRDctXg8M3PcHqB5XXKV',
        keyType: 'RsaVerificationKey',
        hash: ''
    };

    const userprofile2 = {
        name : 'individual2',
        id : 'did:eos:EOS8kg5yjPVYkwMrqbddRjDViy5GiRyBvZvp3kavVeL5ePoCbQDnq',
        controllerId : 'did:eos:EOS8kg5yjPVYkwMrqbddRjDViy5GiRyBvZvp3kavVeL5ePoCbQDnq',
        publicKey : 'EOS8kg5yjPVYkwMrqbddRjDViy5GiRyBvZvp3kavVeL5ePoCbQDnq',
        keyType: 'RsaVerificationKey',
        hash: ''
    };

    const healthorgProfile1={
        name : 'healthorg1',
        id : 'did:eos:EOS8axLLpFh9da7mpBvTvUJ964HS6dMk1kaH39iLmr6CoQfkbCzij',
        controllerId : 'did:eos:EOS8axLLpFh9da7mpBvTvUJ964HS6dMk1kaH39iLmr6CoQfkbCzij',
        publicKey : 'EOS8axLLpFh9da7mpBvTvUJ964HS6dMk1kaH39iLmr6CoQfkbCzij',
        keyType: 'RsaVerificationKey',
        hash: ''
    };

    const healthorgProfile2={
        name : 'healthorg2',
        id : 'did:eos:EOS6LrK9kMBvqM2msM5mBkf54B8dsk37FZVmeE9dLjrYoRbDFkkkK',
        controllerId : 'did:eos:EOS6LrK9kMBvqM2msM5mBkf54B8dsk37FZVmeE9dLjrYoRbDFkkkK',
        publicKey : 'EOS6LrK9kMBvqM2msM5mBkf54B8dsk37FZVmeE9dLjrYoRbDFkkkK',
        keyType: 'RsaVerificationKey',
        hash: ''
    };

    const workerProfile1={
        name : 'worker1',
        id : 'did:eos:EOS6c5QgEfGJwiMTUQnJ2nyw7kppKcK2ZBXzQwVsqM7tLM75VwZtT',
        controllerId : 'did:eos:EOS6c5QgEfGJwiMTUQnJ2nyw7kppKcK2ZBXzQwVsqM7tLM75VwZtT',
        publicKey : 'EOS6c5QgEfGJwiMTUQnJ2nyw7kppKcK2ZBXzQwVsqM7tLM75VwZtT',
        keyType: 'RsaVerificationKey',
        hash: ''
    };

    const workerProfile2={
        name : 'worker2',
        id : 'did:eos:EOS8SupEX69eDMZJQo2FQmoCAuxsn12L5GYyTnjWAFNihtRF29Nuk',
        controllerId : 'did:eos:EOS8SupEX69eDMZJQo2FQmoCAuxsn12L5GYyTnjWAFNihtRF29Nuk',
        publicKey : 'EOS8SupEX69eDMZJQo2FQmoCAuxsn12L5GYyTnjWAFNihtRF29Nuk',
        keyType: 'RsaVerificationKey',
        hash: ''
    };
    
    before(async () => {
        contractAccount = await eoslime.Account.load('issuedid','5JaVpzSKgfVcmxbyzWN4Vq5FNokMuBGeMEoTLRGSN6Y5fNtHQpr');
        individual1= await eoslime.Account.load('individual1','5KizW4BGEo1hzjLJS5YZPCMwiPALKrQPqBkVHzv3kVzRimMKbBF');
        individual2= await eoslime.Account.load('individual2','5K5dZPm63DFT4Afofpf2tm8jNHfmVJta2T2PmTbtXCYiCgT5Fzt');
        healthorg1= await eoslime.Account.load('healthorg1','5HsWbyvg3gFzY2Hmggz8xRgZya39Z2WXbFE76FXMT33KZ8obaxR');
        healthorg2= await eoslime.Account.load('healthorg2','5JtSzuqcv3S834aqk7jxRoS9a1JcRwBx1jreJ5zvFcHy7sYvef2');
        worker1= await eoslime.Account.load('worker1','5JXzVj5kk2zTpBtrq4LJmjbr582BYjzW4JHhwaVjzr1GvmHiyr6');
        worker2= await eoslime.Account.load('worker2','5Hz6Qh7HYDZD1GnNk7udLnF5Zb6zh8MEgCD97Nf8438QMkNXfg5');
        issueDidContract = await eoslime.Contract.deployOnAccount(ISSUE_DID_WASM_PATH,ISSUE_DID_ABI_PATH,contractAccount);

    });
    
    it("Issues Individual1 DID", async () => {
        await issueDidContract.upsert(individual1.name, "EOS75ofK3LWeH7uReyjz3BrF44p9p1SUYQRDctXg8M3PcHqB5XXKV", {from: individual1});

        let didData = await issueDidContract.dids.equal(individual1.name).find();

        assert.equal(didData[0].key, individual1.name, "Incorrect user");
        assert.equal(didData[0].id, userprofile1.id, "Incorrect DID");
        assert.equal(didData[0].controllerId, userprofile1.controllerId, "Incorrect controller ID");
        assert.equal(didData[0].keyType,userprofile1.keyType,"Incorrect Key Type");
        assert.equal(didData[0].publicKey,userprofile1.publicKey,"Incorrect Public key");
        assert.equal(didData[0].hash,userprofile1.hash,"Incorrect Hash");
    });
    
    it("Issues Individual2 DID", async () => {
        await issueDidContract.upsert(individual2.name, "EOS8kg5yjPVYkwMrqbddRjDViy5GiRyBvZvp3kavVeL5ePoCbQDnq", {from: individual2});

        let didData = await issueDidContract.dids.equal(individual2.name).find();

        assert.equal(didData[0].key, individual2.name, "Incorrect user");
        assert.equal(didData[0].id, userprofile2.id, "Incorrect DID");
        assert.equal(didData[0].controllerId, userprofile2.controllerId, "Incorrect controller ID");
        assert.equal(didData[0].keyType,userprofile2.keyType,"Incorrect Key Type");
        assert.equal(didData[0].publicKey,userprofile2.publicKey,"Incorrect Public key");
        assert.equal(didData[0].hash,userprofile2.hash,"Incorrect Hash");
    });

    it("Issues Healthorg1 DID", async () => {
        await issueDidContract.upsert(healthorg1.name, "EOS8axLLpFh9da7mpBvTvUJ964HS6dMk1kaH39iLmr6CoQfkbCzij", {from: healthorg1});

        let didData = await issueDidContract.dids.equal(healthorg1.name).find();

        assert.equal(didData[0].key, healthorg1.name, "Incorrect user");
        assert.equal(didData[0].id, healthorgProfile1.id, "Incorrect DID");
        assert.equal(didData[0].controllerId, healthorgProfile1.controllerId, "Incorrect controller ID");
        assert.equal(didData[0].keyType,healthorgProfile1.keyType,"Incorrect Key Type");
        assert.equal(didData[0].publicKey,healthorgProfile1.publicKey,"Incorrect Public key");
        assert.equal(didData[0].hash,healthorgProfile1.hash,"Incorrect Hash");
    });

    it("Issues Healthorg2 DID", async () => {
        await issueDidContract.upsert(healthorg2.name, "EOS6LrK9kMBvqM2msM5mBkf54B8dsk37FZVmeE9dLjrYoRbDFkkkK", {from: healthorg2});

        let didData = await issueDidContract.dids.equal(healthorg2.name).find();

        assert.equal(didData[0].key, healthorg2.name, "Incorrect user");
        assert.equal(didData[0].id, healthorgProfile2.id, "Incorrect DID");
        assert.equal(didData[0].controllerId, healthorgProfile2.controllerId, "Incorrect controller ID");
        assert.equal(didData[0].keyType,healthorgProfile2.keyType,"Incorrect Key Type");
        assert.equal(didData[0].publicKey,healthorgProfile2.publicKey,"Incorrect Public key");
        assert.equal(didData[0].hash,healthorgProfile2.hash,"Incorrect Hash");
    });
    
    it("Issues Worker1 DID", async () => {
        await issueDidContract.upsert(worker1.name, "EOS6c5QgEfGJwiMTUQnJ2nyw7kppKcK2ZBXzQwVsqM7tLM75VwZtT", {from: worker1});

        let didData = await issueDidContract.dids.equal(worker1.name).find();

        assert.equal(didData[0].key, worker1.name, "Incorrect user");
        assert.equal(didData[0].id, workerProfile1.id, "Incorrect DID");
        assert.equal(didData[0].controllerId, workerProfile1.controllerId, "Incorrect controller ID");
        assert.equal(didData[0].keyType,workerProfile1.keyType,"Incorrect Key Type");
        assert.equal(didData[0].publicKey,workerProfile1.publicKey,"Incorrect Public key");
        assert.equal(didData[0].hash,workerProfile1.hash,"Incorrect Hash");
    });

    it("Issues Worker2 DID", async () => {
        await issueDidContract.upsert(worker2.name, "EOS8SupEX69eDMZJQo2FQmoCAuxsn12L5GYyTnjWAFNihtRF29Nuk", {from: worker2});

        let didData = await issueDidContract.dids.equal(worker2.name).find();

        assert.equal(didData[0].key, worker2.name, "Incorrect user");
        assert.equal(didData[0].id, workerProfile2.id, "Incorrect DID");
        assert.equal(didData[0].controllerId, workerProfile2.controllerId, "Incorrect controller ID");
        assert.equal(didData[0].keyType,workerProfile2.keyType,"Incorrect Key Type");
        assert.equal(didData[0].publicKey,workerProfile2.publicKey,"Incorrect Public key");
        assert.equal(didData[0].hash,workerProfile2.hash,"Incorrect Hash");
    });

    
});
