# COVID-19 Immunity Passport Infrastructure on EOS Blockchain

Smart Contracts for Immunity Passport Policy: Request, Issue, and Verify

This product was developed during participation in Coding for Change EOS Virtual Hackathon 2020

Authors: Lalith Medury & Sai Medury \
contact: lalith.aakash970@gmail.com, sai.abhijit777@gmail.com

Check out the [Proof of Concept](https://meduryllc.github.io/poc-eosio-did-immunity-passport/), try creating a DID on the EOSIO Blockchain and request for an Immunity Passport. You can also register as a healthworker using your GMail address and validate/issue Immunity Passports, to get an all-round experience.

The PoC DApp is connected to smart contracts deployed on [**Jungle Test Network**](https://jungletestnet.io/). Create a [new account](https://eosio.stackexchange.com/a/3247), if you don't already have one, and connect using [Scatter](https://get-scatter.com/). Follow [this video](https://www.youtube.com/watch?v=6Yf-cHg4k90) to connect your Jungle Test Network account with Scatter.

## Unit Tests

We used [EOSLime testing framework](https://github.com/LimeChain/eoslime) to develop this application.

Install eoslime using npm
```bash
npm install eoslime
```
### Compile contracts

```bash
# The command will read contract files from ./contracts folder
# Output will be stored as .abi and .wasm files in ./compiled folder
eoslime compile
```
### Tests

Compile the smart contracts before running tests.

Our tests target local nodeos instance, make sure it is running. Also, our tests are **not re-runnable** so nodeos must be restarted with `--delete-all-blocks` each time. Run the following command:
```
nodeos -e -p eosio \
--plugin eosio::producer_plugin \
--plugin eosio::producer_api_plugin \
--plugin eosio::chain_api_plugin \
--plugin eosio::http_plugin \
--plugin eosio::history_plugin \
--plugin eosio::history_api_plugin \
--filter-on="*" \
--access-control-allow-origin='*' \
--contracts-console \
--http-validate-host=false \
--verbose-http-errors --delete-all-blocks >> nodeos.log 2>&1 &
```

Our tests require hard-coding of EOS account names so we created a script to set-up them up. Unlock cleos wallet and run `createAccounts.sh` to set-up test accounts.
```bash
cleos wallet unlock
bash createAccounts.sh
```

Check smart contract behavior by running unit tests
```bash
# The command will run unit tests from ./tests folder
eoslime test
```
