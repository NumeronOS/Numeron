  // Copyright (c) Obelisk Labs, Inc.
  // SPDX-License-Identifier: Apache-2.0
  #[allow(unused_use)]
  
  /* Autogenerated file. Do not edit manually. */
  
  module monster_hunter::monster_info {

  use std::ascii::String;

  use monster_hunter::monster_type::MonsterType;

  use monster_hunter::direction::Direction;

  use monster_hunter::terrain_type::TerrainType;

  use monster_hunter::monster_catch_result::MonsterCatchResult;

  public struct MonsterInfo has copy, drop, store {
    monster: address,
    catch_attempts: u64,
  }

  public fun new(monster: address, catch_attempts: u64): MonsterInfo {
    MonsterInfo {
                                   monster,catch_attempts
                               }
  }

  public fun get(self: &MonsterInfo): (address,u64) {
    (self.monster,self.catch_attempts)
  }

  public fun get_monster(self: &MonsterInfo): address {
    self.monster
  }

  public fun get_catch_attempts(self: &MonsterInfo): u64 {
    self.catch_attempts
  }

  public(package) fun set_monster(self: &mut MonsterInfo, monster: address) {
    self.monster = monster;
  }

  public(package) fun set_catch_attempts(self: &mut MonsterInfo, catch_attempts: u64) {
    self.catch_attempts = catch_attempts;
  }

  public(package) fun set(self: &mut MonsterInfo, monster: address, catch_attempts: u64) {
    self.monster = monster;
    self.catch_attempts = catch_attempts;
  }
}
