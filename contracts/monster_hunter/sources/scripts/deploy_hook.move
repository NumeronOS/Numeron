#[allow(lint(share_owned), unused_let_mut)]module monster_hunter::deploy_hook {
  use monster_hunter::schema::Schema;

  public entry fun run(schema: &mut Schema, _ctx: &mut TxContext) {

			let  o = monster_hunter::terrain_type::new_none();
            let  t = monster_hunter::terrain_type::new_tall_grass();
            let  b = monster_hunter::terrain_type::new_boulder();
            let  n = monster_hunter::terrain_type::new_npc();
			let terrains = vector[
                vector [o, o, o, o, o, o, t, o, o, o, o, o, o, o, o],
                vector [o, o, t, o, o, o, o, o, t, o, o, o, o, b, o],
                vector [o, t, t, t, t, o, o, o, o, o, o, o, o, o, o],
                vector [o, o, t, t, t, t, o, o, o, o, b, o, o, o, o],
                vector [o, o, o, o, t, t, o, o, o, o, o, o, o, o, o],
                vector [o, o, o, b, b, o, o, o, o, o, o, o, o, o, n],
                vector [o, t, o, o, o, b, b, o, o, o, o, t, o, o, o],
                vector [o, o, t, t, o, o, o, o, o, t, o, b, o, o, t],
                vector [o, o, t, o, o, o, o, t, t, t, o, b, b, o, o],
                vector [o, o, o, o, o, o, o, t, t, t, o, b, t, o, t],
                vector [o, b, o, o, o, b, o, o, t, t, o, b, o, o, t],
                vector [o, o, b, o, o, o, t, o, t, t, o, o, b, t, t],
                vector [o, o, b, o, o, o, t, o, t, t, o, o, b, t, t],
            ];

        let height = terrains.length();
        let width = terrains[0].length();
        let x: u64 = 0;
        let y: u64 = 0;

        schema.map_config().set(monster_hunter::map_config::new(width, height, terrains));

        y.range_do!(height, |y| {
            x.range_do!(width, |x| {
                let terrain = terrains[y][x];
                let entity_key = monster_hunter::map_system::position_to_address(x, y);
                let position = monster_hunter::position::new(x, y);
                if (terrain == monster_hunter::terrain_type::new_boulder()) {
                    schema.position().set(entity_key, position);
                    schema.obstruction().set(entity_key, true);
                } else if (terrain == monster_hunter::terrain_type::new_npc()) {
                    schema.position().set(entity_key, position);
                    schema.obstruction().set(entity_key, true);
                } else if (terrain == monster_hunter::terrain_type::new_tall_grass()) {
                    schema.position().set(entity_key, position);
                    schema.encounter_trigger().set(entity_key, true);
                } 
            });
        });
  }
}
