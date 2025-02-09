// #[test_only]
// module monster_hunter::map_test {
//     use monster_hunter::terrain_type::TerrainType;
//     use monster_hunter::schema::Schema;
//     use monster_hunter::position;
//     use sui::random::Random;
//     use sui::random;
//     use sui::test_scenario;
//     use monster_hunter::map_system;
//     use monster_hunter::direction;
//     use monster_hunter::init_test;
//
//     #[test]
//     public fun register(){
//        let (mut scenario, dapp) = init_test::deploy_dapp_for_testing(@0xA);
//         let mut schema = test_scenario::take_shared<Schema>(&scenario);
//
//         let ctx = test_scenario::ctx(&mut scenario);
//         map_system::register(&mut schema, 0, 0, ctx);
//
//         assert!(schema.player().contains(ctx.sender()));
//         assert!(schema.moveable().contains(ctx.sender()));
//         assert!(schema.encounterable().contains(ctx.sender()));
//         assert!(schema.position().contains(ctx.sender()));
//
//         test_scenario::return_shared(schema);
//         dapp.distroy_dapp_for_testing();
//         scenario.end();
//     }
//
//     #[test]
//     #[expected_failure(abort_code = monster_hunter::errors::CannotMove)]
//     public fun move_position1(){
//         let (mut scenario, dapp) = init_test::deploy_dapp_for_testing(@0x0);
//         {
//             random::create_for_testing(scenario.ctx());
//             scenario.next_tx(@0xA);
//         };
//         let mut schema = scenario.take_shared<Schema>();
//         let random = scenario.take_shared<Random>();
//         // 23140719614837502849299678247283568217
//         // 265323129722700274815559996314403104838
//         // 167645769845140257622894197850400210971
//         // 337352614844298231097611607824428697695
//         // 143043683458825263308720013747056599257
//         // 97853292883519077516783190366887388411
//         // 226059294092153697833364734032968362880
//
//         let ctx = test_scenario::ctx(&mut scenario);
//         map_system::register(&mut schema, 0, 1, ctx);
//
//         map_system::move_position(&mut schema, &random, direction::new_east(), ctx);
//         assert!(schema.position()[ctx.sender()] == position::new(1, 1));
//
//         map_system::move_position(&mut schema, &random, direction::new_east(), ctx);
//         assert!(schema.position()[ctx.sender()] == position::new(2, 1));
//         let expect_monster_address = @0xaa5854249f55f5992873c084541ac3731edf6bce7af20ff5349938511c84e06a;
//         let expect_monster_type = monster_hunter::monster_type::new_rat();
//         assert!(schema.monster().get(expect_monster_address) == expect_monster_type);
//         assert!(schema.monster_info().get(ctx.sender()) == monster_hunter::monster_info::new(expect_monster_address, 0));
//
//         // Cannot move during an encounter
//         map_system::move_position(&mut schema, &random, direction::new_south(), ctx);
//
//         test_scenario::return_shared(random);
//         test_scenario::return_shared(schema);
//         dapp.distroy_dapp_for_testing();
//         scenario.end();
//     }
//
//     #[test]
//     #[expected_failure(abort_code = monster_hunter::errors::SpaceObstructed)]
//     public fun move_position2(){
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
//         map_system::register(&mut schema, 2, 5, ctx);
//
//         let terrains: vector<vector<TerrainType>> = schema.map_config().get().get_terrain();
//         // y = 5, x = 3 => TerrainType::Boulder
//         assert!(terrains[5][3] == monster_hunter::terrain_type::new_boulder());
//         // Cannot move during an encounter
//         map_system::move_position(&mut schema, &random, direction::new_east(), ctx);
//
//         test_scenario::return_shared(random);
//         test_scenario::return_shared(schema);
//         dapp.distroy_dapp_for_testing();
//         scenario.end();
//     }
// }