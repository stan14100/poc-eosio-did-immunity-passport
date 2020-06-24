
#include "../issuedid/issuedid.cpp"

class [[eosio::contract("healthorg")]] healthorg : public eosio::contract {
  public:
    healthorg(eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds):contract(receiver, code, ds) {}
  
    [[eosio::action]]
    void upsert(eosio::name user,std::string email, int organizationId, std::string licenseId, eosio::name didContractAccount, eosio::name contractAccount) {

        eosio::require_auth(contractAccount);
        didindex dids(didContractAccount,didContractAccount.value);
        auto iter=dids.find(user.value);
        std::string id="";
        if(iter!=dids.end()){
            id=iter->id;
        }

        eosio::check(iter!=dids.end(),"DID does not exist for this user");
            
            orgindex orgs(get_self(),get_first_receiver().value);
            auto iterator = orgs.find(user.value);
    
            if( iterator == orgs.end())
            {
                orgs.emplace(contractAccount, [&]( auto& row ) {
                    row.key=user;
                    row.id=id;
                    row.email=email; 
                    row.organizationId=organizationId;
                    row.licenseIssuedByGov = licenseId;
                    
                });
            }
    }

private:
    struct [[eosio::table]] org{
        eosio::name key;
        std::string id;
        std::string email;
        int organizationId;
        std::string licenseIssuedByGov;

        uint64_t primary_key() const { return key.value;}

        EOSLIB_SERIALIZE(org, (key)(id)(email)(organizationId)(licenseIssuedByGov));
    };
    
    typedef eosio::multi_index<"orgs"_n, org> orgindex;

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

};