import { Dubhe, loadMetadata } from '@0xobelisk/sui-client';

async function main() {
  const network = 'testnet';
  const packageId = '0xda4e0a5d70c009cb1d4c8d73c62564e016c9399073808d1549e2fb0aff081260';
  const metdata = await loadMetadata(network, packageId);
  const client = new Dubhe({
    networkType: network,
    packageId: packageId,
    metadata: metdata,
  });

  const allPlayers = await client.getStorage({
    name: 'player',
  });

  //   console.log(allPlayers);

  let userPositionList = [];
  for (const player of allPlayers.data) {
    const userPosition = await client.getStorageItem({
      name: 'position',
      key1: player.key1,
    });
    userPositionList.push(userPosition);
  }

  console.log(JSON.stringify(userPositionList, null, 2));
}

main();
