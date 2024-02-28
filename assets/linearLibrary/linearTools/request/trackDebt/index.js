import _ from "lodash";
import { ethers } from "ethers";
import { bn2n } from "@/common/bnCalc";
import { formatEtherToNumber } from "@/assets/linearLibrary/linearTools/format";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import linearData from "@/assets/linearLibrary/linearTools/request/linearData/transactionData";

export const fetchTrackDebt = async (walletAddress, collateralCurrency) => {
  try {
    let [minted, burned] = await Promise.all([
      linearData.lnr.minted({
        account: walletAddress,
        collateralCurrency: collateralCurrency.contractKey,
      }),
      linearData.lnr.burned({
        account: walletAddress,
        collateralCurrency: collateralCurrency.contractKey,
      }),
    ]);

    let totalMinted = 0,
      totalBuild = 0,
      issuedDebt = 0,
      debtSnapshot = [];

    minted.map((record, index) => {
      totalMinted += record.value;
    });

    burned.map((record, index) => {
      totalBuild += record.value;
    }); //it`s shouldn`t record in burn when user exchange lusd to other synth //console.log(minted, burned); //console.log(issuedDebt, totalMinted, totalBuild);
    issuedDebt = totalMinted - totalBuild;

    if (totalMinted) {
      const { utils, multiCollateral } = lnrJSConnector;

      const localDate = new Date();
      localDate.setHours(0, 0, 0, 0);

      const todayDateSeconds = localDate / 1000;
      const SECONDS_IN_DAY = 24 * 60 * 60;
      const timestampArr = [
        localDate / 1000 - SECONDS_IN_DAY * 2,
        localDate / 1000 - SECONDS_IN_DAY * 1,
        todayDateSeconds,
      ];
      const [selfDebt3, selfDebt2, selfDebt] = await Promise.all([
        linearData.lnr.updateUserDebt({
          max: 1,
          filter: {
            account: `\\"${walletAddress}\\"`,
            collateralCurrency: `\\"${collateralCurrency.contractKey}\\"`,
            timestamp_lte: timestampArr[0],
          },
        }),
        linearData.lnr.updateUserDebt({
          max: 1,
          filter: {
            account: `\\"${walletAddress}\\"`,
            collateralCurrency: `\\"${collateralCurrency.contractKey}\\"`,
            timestamp_lte: timestampArr[1],
          },
        }),
        linearData.lnr.updateUserDebt({
          max: 1,
          filter: {
            account: `\\"${walletAddress}\\"`,
            collateralCurrency: `\\"${collateralCurrency.contractKey}\\"`,
            timestamp_lte: timestampArr[2],
          },
        }),
      ]);
      const [globalDebt3, globalDebt2, globalDebt] = await Promise.all([
        linearData.lnr.PoolDebtLog({
          max: 1,
          filter: {
            collateralCurrency: `\\"${collateralCurrency.contractKey}\\"`,
            timestamp_lte: timestampArr[0],
          },
        }),
        linearData.lnr.PoolDebtLog({
          max: 1,
          filter: {
            collateralCurrency: `\\"${collateralCurrency.contractKey}\\"`,
            timestamp_lte: timestampArr[1],
          },
        }),
        linearData.lnr.PoolDebtLog({
          max: 1,
          filter: {
            collateralCurrency: `\\"${collateralCurrency.contractKey}\\"`,
            timestamp_lte: timestampArr[2],
          },
        }),
      ]);
      if (selfDebt3.length != 0) {
        const temp3 = ethers.BigNumber.from(globalDebt3[0].debtFactor)
          .div(selfDebt3[0].debtFactor)
          .mul(selfDebt3[0].debtProportion);
        const currentDebt3 =
          formatEtherToNumber(
            ethers.BigNumber.from(globalDebt3[0].collateraPoolBalance)
          ) * bn2n(temp3, 27);
        debtSnapshot.push([
          (timestampArr[0] - SECONDS_IN_DAY) * 1000,
          currentDebt3,
        ]);
      } else {
        debtSnapshot.push([(timestampArr[0] - SECONDS_IN_DAY) * 1000, 0]);
      }

      if (selfDebt2.length != 0) {
        const temp2 = ethers.BigNumber.from(globalDebt2[0].debtFactor)
          .div(selfDebt2[0].debtFactor)
          .mul(selfDebt2[0].debtProportion);
        const currentDebt2 =
          formatEtherToNumber(
            ethers.BigNumber.from(globalDebt2[0].collateraPoolBalance)
          ) * bn2n(temp2, 27);
        debtSnapshot.push([
          (timestampArr[1] - SECONDS_IN_DAY) * 1000,
          currentDebt2,
        ]);
      } else {
        debtSnapshot.push([(timestampArr[1] - SECONDS_IN_DAY) * 1000, 0]);
      }

      if (selfDebt.length != 0) {
        const temp = ethers.BigNumber.from(globalDebt[0].debtFactor)
          .div(selfDebt[0].debtFactor)
          .mul(selfDebt[0].debtProportion);
        const currentDebt =
          formatEtherToNumber(
            ethers.BigNumber.from(globalDebt[0].collateraPoolBalance)
          ) * bn2n(temp, 27);
        debtSnapshot.push([
          (timestampArr[2] - SECONDS_IN_DAY) * 1000,
          currentDebt,
        ]);
      } else {
        debtSnapshot.push([(timestampArr[2] - SECONDS_IN_DAY) * 1000, 0]);
      }

      let tempCurrentDebt = await multiCollateral[
        collateralCurrency.key
      ].LnDebtSystem.GetUserDebtBalanceInUsd(walletAddress);
      tempCurrentDebt = formatEtherToNumber(tempCurrentDebt[0]);
      debtSnapshot.push([Date.parse(new Date()), _.floor(tempCurrentDebt, 4)]);
    }
    return { issuedDebt: issuedDebt, currentDebt: debtSnapshot };
  } catch (e) {
    console.error(e, "fetchTrackDebt error");
  }
};
