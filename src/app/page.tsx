'use client';

import { loadMetadata, Dubhe, Transaction } from '@0xobelisk/sui-client';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { Map, DialogModal, PVPModal } from '@/app/components';
import { MapData, ContractMetadata, Monster, OwnedMonster, Hero, SendTxLog, Players } from '@/app/state';
import { SCHEMA_ID, NETWORK, PACKAGE_ID } from '@/chain/config';
import { PRIVATEKEY } from '@/chain/key';
import { toast } from 'sonner';

// Constants for game configuration
const STEP_LENGTH = 2.5;
const GAS_BUDGET = 100000000;
const CATCH_RESULTS = {
  Caught: 'Catch monster successed!',
  Fled: 'Monster got away.',
  Missed: 'Catch miss',
};

export default function Home() {
  // Game state management using Jotai
  const [mapData, setMapData] = useAtom(MapData);
  const [contractMetadata, setContractMetadata] = useAtom(ContractMetadata);
  const [monster, setMonster] = useAtom(Monster);
  const [sendTxLog, setSendTxLog] = useAtom(SendTxLog);
  const [ownedMonster, setOwnedMonster] = useAtom(OwnedMonster);
  const [hero, setHero] = useAtom(Hero);
  const [players, setPlayers] = useAtom(Players);

  // Local state
  const [subscription, setSubscription] = useState<WebSocket | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Handles real-time game events through WebSocket subscription
   * @param dubhe - Dubhe client instance
   */
  const subscribeToEvents = async (dubhe: Dubhe) => {
    try {
      // Get all players for reference
      const allPlayers = await dubhe.getStorage({
        name: 'player',
      });

      // Subscribe to multiple event types
      const sub = await dubhe.subscribe(['position', 'monster_info', 'monster_catch_attempt_event', 'player'], data => {
        console.log('Received real-time data:', data);

        // Handle player position updates
        if (data.name === 'position') {
          const position = data.value;
          const playerAddress = data.key1;

          // Update hero position
          setHero(prev => ({
            ...prev,
            position: {
              left: position.x * STEP_LENGTH,
              top: position.y * STEP_LENGTH,
            },
          }));

          // Update other players' positions
          if (allPlayers.data.find(p => p.key1 === playerAddress)) {
            setPlayers(prev => {
              const newPlayers = [...prev];
              const playerIndex = newPlayers.findIndex(p => p.address === playerAddress);

              if (playerIndex > -1) {
                newPlayers[playerIndex].position = {
                  left: position.x * STEP_LENGTH,
                  top: position.y * STEP_LENGTH,
                };
              } else {
                newPlayers.push({
                  address: playerAddress,
                  position: {
                    left: position.x * STEP_LENGTH,
                    top: position.y * STEP_LENGTH,
                  },
                });
              }
              return newPlayers;
            });
          }
        }

        // Handle monster encounter updates
        else if (data.name === 'monster_info') {
          const shouldLock = !!data.value;
          setMonster({ exist: shouldLock });
          setHero(prev => ({ ...prev, lock: shouldLock }));

          if (shouldLock) {
            setSendTxLog({
              display: true,
              content: 'Have monster',
              yesContent: 'Throw',
              noContent: 'Run',
            });
          } else if (data.value === null) {
            setSendTxLog(prev => ({ ...prev, display: false }));
          }
        }

        // Handle monster catch attempt results
        else if (data.name === 'monster_catch_attempt_event') {
          const result = Object.keys(data.value.result)[0];
          toast('Monster catch attempt event received', {
            description: `Result: ${CATCH_RESULTS[result]}`,
          });

          if (!data.value.result.Missed) {
            setSendTxLog(prev => ({ ...prev, display: false }));
            setMonster({ exist: false });
            setHero(prev => ({ ...prev, lock: false }));
          }
        }
      });
      setSubscription(sub);
    } catch (error) {
      console.error('Failed to subscribe to events:', error);
    }
  };

  /**
   * Initializes the game state including player registration and data loading
   * @param dubhe - Dubhe client instance
   */
  const initializeGameState = async (dubhe: Dubhe) => {
    try {
      // Check if player exists and register if needed
      let have_player = await dubhe.getStorageItem({
        name: 'player',
        key1: dubhe.getAddress(),
      });

      if (have_player === undefined) {
        await registerNewPlayer(dubhe);
      }

      // Load player position and monster data
      await loadPlayerData(dubhe);
      await loadMonsterData(dubhe);
      await loadMapData(dubhe);
      await loadAllPlayersData(dubhe);

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize game state:', error);
      toast.error('Failed to load initial game state');
      setIsInitialized(false);
    }
  };

  /**
   * Registers a new player in the game
   * @param dubhe - Dubhe client instance
   */
  const registerNewPlayer = async (dubhe: Dubhe) => {
    try {
      const registerTx = new Transaction();
      // Initialize player at position (0,0)
      const params = [registerTx.object(SCHEMA_ID), registerTx.pure.u64(0), registerTx.pure.u64(0)];
      registerTx.setGasBudget(GAS_BUDGET);

      await dubhe.tx.map_system.register({
        tx: registerTx,
        params,
        onSuccess: async result => {
          toast.success('Player registered successfully');
          await dubhe.waitForTransaction(result.digest);
        },
        onError: error => {
          console.error('Failed to register player:', error);
          toast.error('Failed to register player');
        },
      });
    } catch (error) {
      console.error('Register player error:', error);
      throw error;
    }
  };

  /**
   * Loads the current player's position data
   * @param dubhe - Dubhe client instance
   */
  const loadPlayerData = async (dubhe: Dubhe) => {
    try {
      const position = await dubhe.getStorageItem({
        name: 'position',
        key1: dubhe.getAddress(),
      });

      if (position) {
        setHero(prev => ({
          ...prev,
          name: dubhe.getAddress(),
          position: {
            left: position.value.x * STEP_LENGTH,
            top: position.value.y * STEP_LENGTH,
          },
        }));
      }
    } catch (error) {
      console.error('Load player data error:', error);
      throw error;
    }
  };

  /**
   * Loads monster data for the current game state
   * @param dubhe - Dubhe client instance
   */
  const loadMonsterData = async (dubhe: Dubhe) => {
    try {
      const entityEncounterableTx = new Transaction();
      let encounterContain = false;
      let monsterInfo = await dubhe.state({
        tx: entityEncounterableTx,
        schema: 'monster_info',
        params: [entityEncounterableTx.object(SCHEMA_ID), entityEncounterableTx.pure.address(dubhe.getAddress())],
      });
      if (monsterInfo !== undefined) {
        encounterContain = true;
      }

      if (encounterContain) {
        setMonster({ exist: true });
        setHero(prev => ({ ...prev, lock: true }));
        setSendTxLog({
          display: true,
          content: 'Have monster',
          yesContent: 'Throw',
          noContent: 'Run',
        });
      } else {
        setMonster({ exist: false });
        setHero(prev => ({ ...prev, lock: false }));
      }

      // Load owned monsters
      const ownedMonsters = await dubhe.getStorageItem({
        name: 'owned_monsters',
        key1: dubhe.getAddress(),
      });

      if (ownedMonsters && ownedMonsters.value) {
        setOwnedMonster(ownedMonsters.value);
      }
    } catch (error) {
      console.error('Load monster data error:', error);
      throw error;
    }
  };

  /**
   * Loads map configuration and terrain data
   * @param dubhe - Dubhe client instance
   */
  const loadMapData = async (dubhe: Dubhe) => {
    try {
      const mapConfig = await dubhe.getStorageItem({
        name: 'map_config',
      });

      if (mapConfig && mapConfig.value) {
        setMapData({
          ...mapData,
          width: mapConfig.value.terrain[0].length ?? 0,
          height: mapConfig.value.terrain.length ?? 0,
          terrain: mapConfig.value.terrain ?? [],
          type: 'green',
          events: [],
          map_type: 'event',
        });
        // setMapData({
        //   width: mapConfig.value.width,
        //   height: mapConfig.value.height,
        //   terrain: mapConfig.value.terrain,
        //   type: mapConfig.value.type || 'green',
        //   ele_description: mapConfig.value.ele_description || {
        //     walkable: [{ None: {} }, { TallGrass: {} }],
        //     green: [{ None: {} }],
        //     tussock: [{ TallGrass: {} }],
        //     small_tree: [{ Boulder: {} }],
        //   },
        //   events: mapConfig.value.events || [],
        //   map_type: mapConfig.value.map_type || 'event',
        // });

        // Debug log
        console.log('Map Config:', mapConfig.value);
      }
    } catch (error) {
      console.error('Load map data error:', error);
      throw error;
    }
  };

  /**
   * Loads position data for all players in the game
   * @param dubhe - Dubhe client instance
   */
  const loadAllPlayersData = async (dubhe: Dubhe) => {
    try {
      const allPlayers = await dubhe.getStorage({
        name: 'player',
      });

      if (!allPlayers?.data) return;

      const playerPositions = await Promise.all(
        allPlayers.data.map(async player => {
          const position = await dubhe.getStorageItem({
            name: 'position',
            key1: player.key1,
          });

          return {
            address: player.key1,
            position: position
              ? {
                  left: position.value.x * STEP_LENGTH,
                  top: position.value.y * STEP_LENGTH,
                }
              : null,
          };
        }),
      );

      setPlayers(playerPositions.filter(p => p.position !== null));
    } catch (error) {
      console.error('Load all players data error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const metadata = await loadMetadata(NETWORK, PACKAGE_ID);
        setContractMetadata(metadata);

        if (Object.keys(metadata).length === 0) {
          throw new Error('Contract metadata not loaded');
        }

        const dubhe = new Dubhe({
          networkType: NETWORK,
          packageId: PACKAGE_ID,
          metadata: metadata,
          secretKey: PRIVATEKEY,
        });

        await initializeGameState(dubhe);
        await subscribeToEvents(dubhe);
      } catch (error) {
        console.error('Initialization failed:', error);
        toast.error('Failed to initialize game');
        setIsInitialized(false);
      }
    };

    initialize();

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.close();
      }
    };
  }, []);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="min-h-[1px] flex mb-5 relative">
        <Map
          width={mapData.width}
          height={mapData.height}
          terrain={mapData.terrain}
          players={players}
          type={mapData.type}
          ele_description={mapData.ele_description}
          events={mapData.events}
          map_type={mapData.map_type}
          metadata={contractMetadata}
        />
        <div className="w-[calc(20vw-1rem)] max-h-screen ml-2.5">
          <></>
        </div>
      </div>
      <DialogModal />
      <PVPModal sendTxLog={sendTxLog} metadata={contractMetadata} />
      <div className="mx-2 my-2 bg-white text-black">
        {ownedMonster.map((data, index) => (
          <div key={index}>{`Monster-${index}: 0x${data}`}</div>
        ))}
      </div>
    </div>
  );
}
