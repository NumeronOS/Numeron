// #[test_only]
// module monster_hunter::encounter_test {
//     use sui::random::Random;
//     use sui::random;
//     use sui::test_scenario;
//     use monster_hunter::map_system;
//     use monster_hunter::encounter_system;
//     use monster_hunter::direction;
//     use monster_hunter::position;
//     use monster_hunter::init_test;
//     use monster_hunter::schema::Schema;
//
//     #[test]
//     public fun throw_ball(){
//         let (mut scenario, dapp) = init_test::deploy_dapp_for_testing(@0x0);
//         {
//             random::create_for_testing(scenario.ctx());
//             scenario.next_tx(@0xA);
//         };
//
//         let mut schema = test_scenario::take_shared<Schema>(&scenario);
//         let random = test_scenario::take_shared<Random>(&scenario);
//
//         let ctx = test_scenario::ctx(&mut scenario);
//         map_system::register(&mut schema, 1, 1, ctx);
//         map_system::move_position(&mut schema, &random, direction::new_east(), ctx);
//         map_system::move_position(&mut schema, &random, direction::new_south(), ctx);
//         assert!(schema.position().get(ctx.sender()) == position::new(2, 2));
//
//         // Cannot move during an encounter
//         let monster_info = schema.monster_info()[ctx.sender()];
//         assert!(schema.monster_info().get(ctx.sender()).get_catch_attempts() == 0);
//         encounter_system::throw_ball(&mut schema, &random, ctx);
//         assert!(schema.monster_info().get(ctx.sender()).get_catch_attempts() == 1);
//         encounter_system::throw_ball(&mut schema, &random, ctx);
//         assert!(schema.monster_info().get(ctx.sender()).get_catch_attempts() == 2);
//         encounter_system::throw_ball(&mut schema, &random, ctx);
//
//         assert!(schema.monster_info().contains(ctx.sender()) == false);
//         assert!(schema.monster().contains(monster_info.get_monster()) == false);
//
//         map_system::move_position(&mut schema, &random, direction::new_east(), ctx);
//         map_system::move_position(&mut schema, &random, direction::new_east(), ctx);
//
//         encounter_system::throw_ball(&mut schema, &random, ctx);
//         let expect_monster_address = @0x5cb82e64ba7208ca0ddb005cb0b4c451b113d1533c7b57c9198c8955992b0611;
//         let expect_monster_type = monster_hunter::monster_type::new_eagle();
//         assert!(schema.monster().get(expect_monster_address) == expect_monster_type);
//         assert!(schema.owned_by().get(expect_monster_address) == ctx.sender());
//         assert!(schema.monster_info().contains(ctx.sender()) == false);
//
//         test_scenario::return_shared(random);
//         test_scenario::return_shared(schema);
//
//         dapp.distroy_dapp_for_testing();
//         scenario.end();
//     }
//
//     #[test]
//     public fun flee(){
//         let (mut scenario, dapp) = init_test::deploy_dapp_for_testing(@0x0);
//         {
//             random::create_for_testing(scenario.ctx());
//             scenario.next_tx(@0xA);
//         };
//
//         let mut schema = test_scenario::take_shared<Schema>(&scenario);
//         let random = test_scenario::take_shared<Random>(&scenario);
//
//         let ctx = test_scenario::ctx(&mut scenario);
//         map_system::register(&mut schema, 1, 1, ctx);
//         map_system::move_position(&mut schema, &random, direction::new_east(), ctx);
//         map_system::move_position(&mut schema, &random, direction::new_south(), ctx);
//
//         let monster_info = schema.monster_info()[ctx.sender()];
//         // Cannot move during an encounter
//         encounter_system::flee(&mut schema, ctx);
//
//         assert!(schema.monster_info().contains(ctx.sender()) == false);
//         assert!(schema.monster().contains(monster_info.get_monster()) == false);
//
//         test_scenario::return_shared(random);
//         test_scenario::return_shared(schema);
//         dapp.distroy_dapp_for_testing();
//         scenario.end();
//     }
// }