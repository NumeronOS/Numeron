#[allow(lint(share_owned))]module monster_hunter::genesis {

  use std::ascii::string;

  use sui::clock::Clock;

  use monster_hunter::dapp_system;

  public entry fun run(clock: &Clock, ctx: &mut TxContext) {
    // Create a dapp.
    let mut dapp = dapp_system::create(string(b"monster_hunter"),string(b"monster_hunter contract"), clock , ctx);
    // Create schemas
    let mut schema = monster_hunter::schema::create(ctx);
    // Logic that needs to be automated once the contract is deployed
    monster_hunter::deploy_hook::run(&mut schema, ctx);
    // Authorize schemas and public share objects
    dapp.add_schema(schema);
    sui::transfer::public_share_object(dapp);
  }
}
