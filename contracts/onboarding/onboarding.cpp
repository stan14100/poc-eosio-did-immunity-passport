#include <eosio/eosio.hpp>
#include <eosio/system.hpp>

#include "../issuedid/issuedid.cpp"

class [[eosio::contract("onboarding")]] onboarding : public eosio::contract {
    public:
        onboarding(eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds):contract(receiver, code, ds) {}

        [[eosio::action]]
        void confirm(eosio::name user, eosio::name organization, eosio::name didContractAccount, eosio::name healthOrgContractAccount){
            // TODO: Decide whether req_auth needed or not
            //eosio::require_auth(get_self());
            //Instantiating table from another contract, hence the different parameters
            //The account eosio::name to which the other contract was deployed to, must be the parameters while instantiating
            didindex dids(didContractAccount,didContractAccount.value);
            auto iter=dids.find(user.value);
            eosio::check(iter!=dids.end(),"Could not find a did record for your account");
            std::string id="";
            if(iter!=dids.end()){
                id=iter->id;
            }

            orgindex org(healthOrgContractAccount,healthOrgContractAccount.value);
            auto newiter=org.find(organization.value);
            eosio::check(newiter!=org.end(),"Your organization was not part of the list of authorized orgs");
            // TODO: The listedDomain check must happen serverside or clientside not on blockchain
            //std::string listedDomain=newiter->email;

            

        }

        // Needs to be run only after confirming email 
        [[eosio::action]]
        void upsert(eosio::name user, eosio::name organization, eosio::name didContractAccount, eosio::name healthOrgContractAccount) {
            eosio::require_auth(get_self());
            // 
            didindex dids(didContractAccount,didContractAccount.value);
            auto iter=dids.find(user.value);
            eosio::check(iter!=dids.end(),"Could not find a did record for your account");
            std::string id="";
            if(iter!=dids.end()){
                id=iter->id;
            }
            
            workerindex workers(get_self(),get_first_receiver().value);
            auto iterator = workers.find(user.value);

            eosio::check(iterator==workers.end(),"A health org worker with this account already exists");
            // TODO: Contract Owner
            workers.emplace(get_self(), [&]( auto& row ) {
                row.key=user;
                row.id=id;
                row.organization=organization;
            });
            
        }
    private:
        struct [[eosio::table]] healthworker {
            eosio::name key;
            std::string id;
            eosio::name organization;

            uint64_t primary_key() const { return key.value;}

            EOSLIB_SERIALIZE(healthworker, (key)(id)(organization));
        };

        typedef eosio::multi_index<"workers"_n, healthworker> workerindex;

        TABLE did {
            eosio::name key;
            std::string id;
            std::string controllerId;
            std::string publicKey;
            std::string keyType;
            std::string hash;

            uint64_t primary_key() const { return key.value;}

            EOSLIB_SERIALIZE(did, (key)(id)(controllerId)(publicKey)(keyType)(hash));
        };
        typedef eosio::multi_index<"dids"_n, did> didindex;

        TABLE org {
            eosio::name key;
            std::string id;
            std::string email;
            int organizationId;
            std::string licenseIssuedByGov;

            uint64_t primary_key() const { return key.value;}

            EOSLIB_SERIALIZE(org, (key)(id)(email)(organizationId)(licenseIssuedByGov));
        };
        
        typedef eosio::multi_index<"orgs"_n, org> orgindex;
};