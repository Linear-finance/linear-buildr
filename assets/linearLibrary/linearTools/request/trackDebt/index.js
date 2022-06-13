import linearData from "@/assets/linearLibrary/linearTools/request/linearData/transactionData";
import _ from "lodash";
import { formatEtherToNumber } from "@/assets/linearLibrary/linearTools/format";
import lnrJSConnector from "@/assets/linearLibrary/linearTools/lnrJSConnector";
import { ethers } from "ethers";
import { getOtherNetworks } from "../../network";

export const fetchTrackDebt = async (walletAddress) => {
  try {
    let otherNetWorkId = getOtherNetworks($nuxt.$store.state?.walletNetworkId);

    let [minted, burned, oetherNetWorkMinted, oetherNetWorkBurned] =
      await Promise.all([
        linearData.lnr.minted({ account: walletAddress }),
        linearData.lnr.burned({ account: walletAddress }),
        linearData.lnr.minted({
          account: walletAddress,
          networkId: otherNetWorkId,
        }),
        linearData.lnr.burned({
          account: walletAddress,
          networkId: otherNetWorkId,
        }),
      ]);

    minted = minted.concat(oetherNetWorkMinted);
    burned = burned.concat(oetherNetWorkBurned);

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
    // console.log(issuedDebt, "issuedDebt");

    if (totalMinted) {
      const {
        lnrJS: { LnDebtSystem },
        utils,
      } = lnrJSConnector;

      const localDate = new Date();
      localDate.setHours(0, 0, 0, 0);

      const todayDateSeconds = localDate.getTime() / 1000;
      const SECONDS_IN_DAY = 24 * 60 * 60;

      const timestampArr = [
        todayDateSeconds - SECONDS_IN_DAY * 2,
        todayDateSeconds - SECONDS_IN_DAY * 1,
        todayDateSeconds,
      ];

      const [selfDebt3, selfDebt2, selfDebt] = await Promise.all([
        linearData.lnr.updateUserDebt({
          max: 1,
          filter: {
            account: `\\"${walletAddress}\\"`,
            timestamp_lte: timestampArr[0],
          },
        }),
        linearData.lnr.updateUserDebt({
          max: 1,
          filter: {
            account: `\\"${walletAddress}\\"`,
            timestamp_lte: timestampArr[1],
          },
        }),
        linearData.lnr.updateUserDebt({
          max: 1,
          filter: {
            account: `\\"${walletAddress}\\"`,
            timestamp_lte: timestampArr[2],
          },
        }),
      ]);

      const [globalDebt3, globalDebt2, globalDebt] = await Promise.all([
        linearData.lnr.updateUserDebt({
          max: 1,
          filter: { timestamp_lte: timestampArr[0] },
        }),
        linearData.lnr.updateUserDebt({
          max: 1,
          filter: { timestamp_lte: timestampArr[1] },
        }),
        linearData.lnr.updateUserDebt({
          max: 1,
          filter: { timestamp_lte: timestampArr[2] },
        }),
      ]);

      const PUNIT = utils.parseEther("1000000000");
      const HALF = utils.parseEther("0.000000001");

      if (selfDebt3.length != 0) {
        let temp3 = ethers.BigNumber.from(globalDebt3[0].debtFactor)
          .mul(PUNIT)
          .div(selfDebt3[0].debtFactor)
          .mul(selfDebt3[0].debtProportion)
          .div(PUNIT);
        let currentDebt3 = formatEtherToNumber(
          ethers.BigNumber.from(globalDebt3[0].totalAssetSupplyInUsd)
            .mul(HALF)
            .mul(temp3)
            .div(PUNIT)
            .div(HALF)
        );
        debtSnapshot.push([
          (timestampArr[0] - SECONDS_IN_DAY) * 1000,
          currentDebt3,
        ]);
      } else {
        debtSnapshot.push([(timestampArr[0] - SECONDS_IN_DAY) * 1000, 0]);
      }

      if (selfDebt2.length != 0) {
        const temp2 = ethers.BigNumber.from(globalDebt2[0].debtFactor)
          .mul(PUNIT)
          .div(selfDebt2[0].debtFactor)
          .mul(selfDebt2[0].debtProportion)
          .div(PUNIT);
        const currentDebt2 = formatEtherToNumber(
          ethers.BigNumber.from(globalDebt2[0].totalAssetSupplyInUsd)
            .mul(HALF)
            .mul(temp2)
            .div(PUNIT)
            .div(HALF)
        );
        debtSnapshot.push([
          (timestampArr[1] - SECONDS_IN_DAY) * 1000,
          currentDebt2,
        ]);
      } else {
        debtSnapshot.push([(timestampArr[1] - SECONDS_IN_DAY) * 1000, 0]);
      }

      if (selfDebt.length != 0) {
        const temp = ethers.BigNumber.from(globalDebt[0].debtFactor)
          .mul(PUNIT)
          .div(selfDebt[0].debtFactor)
          .mul(selfDebt[0].debtProportion)
          .div(PUNIT);
        const currentDebt = formatEtherToNumber(
          ethers.BigNumber.from(globalDebt[0].totalAssetSupplyInUsd)
            .mul(HALF)
            .mul(temp)
            .div(PUNIT)
            .div(HALF)
        );
        debtSnapshot.push([
          (timestampArr[2] - SECONDS_IN_DAY) * 1000,
          currentDebt,
        ]);
      } else {
        debtSnapshot.push([(timestampArr[2] - SECONDS_IN_DAY) * 1000, 0]);
      }

      let tempCurrentDebt = await LnDebtSystem.GetUserDebtBalanceInUsd(
        walletAddress
      );

      tempCurrentDebt = formatEtherToNumber(tempCurrentDebt[0]);
      debtSnapshot.push([Date.parse(new Date()), _.floor(tempCurrentDebt, 2)]);
    }

    return { issuedDebt: issuedDebt, currentDebt: debtSnapshot };
  } catch (e) {
    console.error(e, "fetchTrackDebt error");
  }
};
