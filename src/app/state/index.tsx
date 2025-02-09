import { atom } from 'jotai';
import { SuiMoveNormalizedModules } from '@0xobelisk/sui-client';

export type TerrainItemType = {
  None?: {};
  TallGrass?: {};
  Boulder?: {};
  Npc?: {};
  // $kind: 'None' | 'TallGrass' | 'Boulder' | 'Npc';
};

export type MapDataType = {
  width: number;
  height: number;
  terrain: TerrainItemType[][];
  type: string;
  ele_description: Record<string, TerrainItemType[]>;
  events: {
    x: number;
    y: number;
  }[];
  map_type: string;
};

export type LogType = {
  display: boolean;
  content: string;
  yesContent: string;
  noContent: string;
  onYes?: Function;
  onNo?: Function;
};

export type HeroType = {
  name: string;
  position: {
    left: number;
    top: number;
  };
  lock: boolean;
};

export type MonsterType = {
  exist: boolean;
};

export type OwnedMonsterType = string[];

export type AccountType = {
  address: string;
  connected: boolean;
  loggedIn: boolean;
};

export type PlayerType = {
  address: string;
  position: {
    left: number;
    top: number;
  };
};

const MapData = atom<MapDataType>({
  width: 0,
  height: 0,
  terrain: [],
  type: 'green',
  ele_description: {
    walkable: [
      {
        None: {},
        // $kind: 'None',
      },
      {
        TallGrass: {},
        // $kind: 'TallGrass',
      },
    ],
    green: [
      {
        None: {},
        // $kind: 'None',
      },
    ],
    tussock: [
      {
        TallGrass: {},
        // $kind: 'TallGrass',
      },
    ],
    small_tree: [
      {
        Boulder: {},
        // $kind: 'Boulder',
      },
    ],
    old_man: [
      {
        Npc: {},
      },
    ],
    sprite: [
      {
        Npc: {},
      },
    ],
  },
  events: [],
  map_type: 'event',
});

const ContractMetadata = atom<SuiMoveNormalizedModules>({});

const SendTxLog = atom<LogType>({
  display: false,
  content: '',
  yesContent: '',
  noContent: '',
  onYes: null,
  onNo: null,
});

const Dialog = atom<LogType>({
  display: false,
  content: '',
  yesContent: '',
  noContent: '',
  onYes: null,
  onNo: null,
});

const Hero = atom<HeroType>({
  name: '',
  position: { left: 0, top: 0 },
  lock: false,
});

const Monster = atom({
  exist: false,
});

const OwnedMonster = atom([]);

const Account = atom({
  address: '',
  connected: false,
  loggedIn: false,
});

const Players = atom<PlayerType[]>([]);

export { MapData, ContractMetadata, SendTxLog, Dialog, Hero, Monster, OwnedMonster, Account, Players };
