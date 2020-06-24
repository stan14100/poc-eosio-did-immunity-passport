const assert = require('assert');
const eoslime = require('eoslime');
//const eoslime = require('eoslime').init('jungle', { url: 'https://jungle2.eosio.cr:443', chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473' });
/*
const Networks = {
    bos: {
        name: 'bos',
        url: 'https://hapi.bos.eosrio.io',
        chainId: 'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86'
    },
    local: {
        name: 'local',
        url: 'http://127.0.0.1:8888',
        chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
    },
    worbli: {
        name: 'main',
        url: 'https://eos.greymass.com',
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    },
    jungle: {
        name: 'jungle',
        url: 'https://jungle2.cryptolions.io',
        chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'
    },
    main: {
        name: 'main',
        url: 'https://eos.greymass.com',
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    },
    kylin: {
        name: 'kylin',
        url: 'https://kylin.eoscanada.com',
        chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
    },
    custom: {
        name: 'custom',
        url: 'https://custom.com',
        chainId: '123'
    },
}
*/
const IMM_PASS_WASM_PATH = './compiled/immunity-passport.wasm';
const IMM_PASS_ABI_PATH = './compiled/immunity-passport.abi';

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

describe("Test Immunity Passport contract", function (eoslime) {

    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(1500000);

    let myDefaultAccount;
    let newaccount;
    let immunityPassportContract;
    let sanjaysahu;
    let individual1;

    /*
    before(async() => {
        // TestNet setup
        //myDefaultAccount = eoslime.Account.load('immunitypass','5JXjBf62YZfU3fjoLJTLmTbxJ8iTS6DphFN8FbFzsYCw4VuEHAb');
        //myDefaultAccount = await eoslime.Account.load('evadikiekuva', '5JCb1vJ5rHnchSyGeoVmcuQwQwCDwaALwF6QNs9YNPAySWinBKE');
        //myDefaultAccount = await eoslime.Account.load('imlorduhtred','5KQhU377ey8DtQVAjKTrq4fqb5AquxTnRrWCAUHYaPA1WGPYGfM');
        //sanjaysahu = await eoslime.Account.load('imsanjaysahu','5K5xBev8rt1hB8a1oTQc6gdrcWtBuRAUMBohdFqfrgXxcUkJKKR')
        //eoslime.Provider.defaultAccount.privateKey = myDefaultAccount.privateKey;
        //eoslime.Provider.defaultAccount.name = myDefaultAccount.name;
        //const jungleProvider = new eoslime.Provider('jungle');
        //eoslime.Provider.reset(jungleProvider);
        //assert(JSON.stringify(eoslime.Provider.network) == JSON.stringify(Networks.jungle));
        //await myDefaultAccount.buyRam(2000, myDefaultAccount);
        //await sanjaysahu.send(myDefaultAccount, `2.0000`, 'EOS');
        //await myDefaultAccount.buyBandwidth('2.0000 EOS', '2.0000 EOS', myDefaultAccount);

        //contractAccount = await eoslime.Account.createRandom(myDefaultAccount);
        //individual  = await eoslime.Account.createRandom(myDefaultAccount);
        //healthworker  = await eoslime.Account.createRandom(myDefaultAccount);

        // await contractAccount.buyRam(1000000, myDefaultAccount);
        // await myDefaultAccount.send(contractAccount, `2.0000`, 'EOS');
        // await contractAccount.buyBandwidth('2.0000 EOS', '2.0000 EOS', sanjaysahu);
        //immunityPassportContract = await eoslime.Contract.fromFile(IMM_PASS_ABI_PATH,individual.name,sanjaysahu);
        // await individual.buyRam(1000, sanjaysahu);
        // await sanjaysahu.send(individual, `1.0000`, 'EOS');
        // await individual.buyBandwidth('1.0000 EOS', '1.0000 EOS', sanjaysahu);

        individual = await eoslime.Account.load('immunitypass','5JXjBf62YZfU3fjoLJTLmTbxJ8iTS6DphFN8FbFzsYCw4VuEHAb');
        sanjaysahu = await eoslime.Account.load('imsanjaysahu','5K5xBev8rt1hB8a1oTQc6gdrcWtBuRAUMBohdFqfrgXxcUkJKKR')
        healthworker = await eoslime.Account.load('amsanjaysahu', '5KKgMuK5KoCWjVm1spMzYqpDWaeKvQ9LCQ1wYjDfEWLBQ4Eu6o2');

        // TODO: Deploy contract if not yet deployed
        //immunityPassportContract = await eoslime.Contract.fromFile(IMM_PASS_ABI_PATH,individual.name,sanjaysahu);

        newaccount = await eoslime.Account.createRandom(sanjaysahu);
        await newaccount.buyRam(1000, sanjaysahu);
        await sanjaysahu.send(newaccount, `1.0000`, 'EOS');
        await newaccount.buyBandwidth('1.0000 EOS', '1.0000 EOS', sanjaysahu);

    });
    */

    before(async () => {
        /*
        const localProvider = new eoslime.Provider('local');
        eoslime.Provider.reset(localProvider);
        assert(JSON.stringify(eoslime.Provider.network) == JSON.stringify(Networks.local));

        myDefaultAccount = eoslime.Account.createRandom();
        sanjaysahu = eoslime.Account.createRandom();

        console.log('bought');
        contractAccount = await eoslime.Account.createRandom();

        individual  = await eoslime.Account.createRandom();
        healthworker  = await eoslime.Account.createRandom();
        console.log('created random accounts');

        immunityPassportContract = await eoslime.Contract.deployOnAccount(IMM_PASS_WASM_PATH,IMM_PASS_ABI_PATH,contractAccount);
        console.log('deployed')
        */
        contractAccount = await eoslime.Account.load('immpass','5JQuzojmXPZ4waW5RWWkfUmB5AABPEpwveWw7inYEpWk5cjMs45');
        individual1= await eoslime.Account.load('individual1','5KizW4BGEo1hzjLJS5YZPCMwiPALKrQPqBkVHzv3kVzRimMKbBF');
        worker1= await eoslime.Account.load('worker1','5JXzVj5kk2zTpBtrq4LJmjbr582BYjzW4JHhwaVjzr1GvmHiyr6');
        immunityPassportContract = await eoslime.Contract.deployOnAccount(IMM_PASS_WASM_PATH,IMM_PASS_ABI_PATH,contractAccount);
    });

    it("Accepts a new request and adds it to requests_table", async() => {

        try{
            await immunityPassportContract.initiate(individual1.name, worker1.name, "issuedid", "onboarding", {from: individual1});
            let requestsTable = immunityPassportContract.listinit;
            let requests = await requestsTable.equal(individual1.name).find();
            assert(requests[0].requester_name==individual1.name);
        }catch(error){
            console.log(error);
        }

    });

    it("Accepts a correct validation request, adds to pendings_table and deletes from requests_table", async() => {

        try{
            let requestsTable = immunityPassportContract.listinit;
            let pendingsTable = immunityPassportContract.listpdg;
            
            const govtIdString = makeid(10);//Math.random().toString(9);
            await immunityPassportContract.validate(individual1.name,worker1.name,govtIdString,{from: worker1});
            let pendings = await pendingsTable.equal(individual1.name).find();
            assert.equal(pendings[0].requester_name,individual1.name);
            assert.equal(pendings[0].healthworker_name,worker1.name);
            assert.equal(pendings[0].individual_govt_id,govtIdString);
            let requests = await requestsTable.equal(individual1.name).find();
            assert.equal(requests.length,0,"Should not exist in the table anymore");
        } catch(error){
            console.log(error);
        }

    });

    it("Accepts an issue request, generates an Immunity Passport and adds it to Immunity Passport table", async() => {

        try{
            let pendingsTable = immunityPassportContract.listpdg;
            let immpassTable = immunityPassportContract.imntypass;
            
            await immunityPassportContract.issue(individual1.name,worker1.name,123456,{from: worker1});
            let immpassResults = await immpassTable.equal(individual1.name).find();
            assert.equal(immpassResults[0].individual,individual1.name);
            let pendings = await pendingsTable.equal(individual1.name).find();
            assert.equal(pendings.length,0,"Should not exist in the table anymore");
        } catch(error){
            console.log(error);
        }

    });

    it("Verifies an immunity passport for an individual1", async() => {
        try{
            await immunityPassportContract.verify(individual1.name, {from: individual1});
        } catch(error){
            console.log(error);
        }
    })

});