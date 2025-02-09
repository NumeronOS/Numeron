import { Dubhe, Transaction } from '@0xobelisk/sui-client';
import { useAtomValue } from 'jotai';
import { ContractMetadata, LogType } from '../state';
import { SCHEMA_ID, NETWORK, PACKAGE_ID } from '../../chain/config';
import { PRIVATEKEY } from '../../chain/key';
import { TransactionResult } from '@0xobelisk/sui-client/src';
import { toast } from 'sonner';

type Props = {
  sendTxLog: LogType;
  metadata: any;
};

export function PVPModal({ sendTxLog, metadata }: Props) {
  const flee = async () => {
    const dubhe = new Dubhe({
      networkType: NETWORK,
      packageId: PACKAGE_ID,
      metadata,
      secretKey: PRIVATEKEY,
    });

    let tx = new Transaction();
    let params = [tx.object(SCHEMA_ID)];

    // await obelisk.tx.encounter_system.flee(tx, params, undefined, true);

    (await dubhe.tx.encounter_system.flee({
      tx,
      params,

      onSuccess: async result => {
        // Wait for a short period before querying the latest data
        setTimeout(async () => {
          toast('Transaction Successful', {
            description: new Date().toUTCString(),
            action: {
              label: 'Check in Explorer',
              onClick: () => window.open(dubhe.getTxExplorerUrl(result.digest), '_blank'),
            },
          });
        }, 2000); // Wait for 2 seconds before querying, adjust as needed
      },
      onError: error => {
        toast.error('Transaction failed. Please try again.');
      },
    })) as TransactionResult;
  };

  const throwBall = async () => {
    const dubhe = new Dubhe({
      networkType: NETWORK,
      packageId: PACKAGE_ID,
      metadata,
      secretKey: PRIVATEKEY,
    });

    let tx = new Transaction();
    let params = [tx.object(SCHEMA_ID), tx.object.random()];

    (await dubhe.tx.encounter_system.throw_ball({
      tx,
      params,

      onSuccess: async result => {
        setTimeout(async () => {
          toast('Transaction Successful', {
            description: new Date().toUTCString(),
            action: {
              label: 'Check in Explorer',
              onClick: () => window.open(dubhe.getTxExplorerUrl(result.digest), '_blank'),
            },
          });
        }, 2000);
      },
      onError: error => {
        toast.error('Transaction failed. Please try again.');
      },
    })) as TransactionResult;
  };

  return (
    <div className="pvp-modal" hidden={!sendTxLog.display}>
      <div className="pvp-modal-content">
        Have monster
        <img src="assets/monster/gui.jpg" />
      </div>

      <div className="pvp-modal-actions">
        <div
          className="pvp-modal-action-no"
          hidden={sendTxLog.noContent === '' || sendTxLog.noContent === undefined}
          onClick={() => flee()}
        >
          {sendTxLog.noContent}
        </div>
        <div
          className="pvp-modal-action-yes"
          hidden={sendTxLog.yesContent === '' || sendTxLog.yesContent === undefined}
          onClick={() => throwBall()}
        >
          {sendTxLog.yesContent}
        </div>
      </div>
    </div>
  );
}
