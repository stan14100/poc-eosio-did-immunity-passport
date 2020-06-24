#include <eosio/eosio.hpp>
#include <eosio/system.hpp>


class [[eosio::contract("issuedid")]] issuedid : public eosio::contract {
  public:
    issuedid(eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds):contract(receiver, code, ds) {}
  
    [[eosio::action]]
    void upsert(eosio::name user,std::string publicKey) {
        eosio::require_auth(user);
        std::string id="did:eos:"+publicKey;
        didindex did(get_self(),get_first_receiver().value);
        
        auto iterator = did.find(user.value);
        eosio::check(iterator==did.end(),"Already registered");
        eosio::check(publicKey.length()==53,"Not a valid EOS Key");
        did.emplace(user, [&]( auto& row ) {
            row.key=user;
            row.id=id;
            //TODO: Allow User to provide a separate controller id; First we need to validate if user is in control of that did before adding here
            row.controllerId=id; 
            row.keyType="RsaVerificationKey";
            row.publicKey = publicKey;
        });
    }
    
  private:
    struct [[eosio::table]] did {
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