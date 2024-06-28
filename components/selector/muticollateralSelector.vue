<template>
  <div
    id="multicollateral"
    class="actionInputItem"
    :class="{
      showDropdown,
    }"
    @click.stop="showDropdownFun"
  >
    <div class="itemTypeTitle" v-if="selectedCollateral === undefined">
      select assets
    </div>

    <div class="itemLeft" v-else>
      <div class="iconBox">
        <div class="icon">
          <img
            v-if="theme === 'light'"
            :src="require(`@/static/${selectedCollateral.img}`)"
          />
          <img
            v-else
            :src="require(`@/static/${selectedCollateral.darkimg}`)"
          />
        </div>
      </div>
      <div class="midle">
        <div class="p_1">
          {{ selectedCollateral.name }}
        </div>
        <!-- <span class="branch" v-if="selectedCollateral.branch !== undefined">
          {{ selectedCollateral.branch }}
        </span> -->
      </div>
    </div>
    <div class="arrow" :class="{ showDropdown }">
      <img v-show="!showDropdown" src="@/static/arrow_down_blue.svg" />
      <img v-show="showDropdown" src="@/static/arrow_up_blue.svg" />
    </div>
    <div class="dropdown" v-show="this.showDropdown">
      <div
        class="dropdownItem"
        v-for="(item, index) in collateralAssets"
        @click="onDropdownitemClick(item)"
        :key="index"
        :class="{
          active:
            selectedCollateral !== undefined &&
            item.name == selectedCollateral.name,
        }"
      >
        <div class="iconBox">
          <div class="icon">
            <img
              v-if="theme === 'light'"
              :src="require(`@/static/${item.img}`)"
            />
            <img v-else :src="require(`@/static/${item.darkimg}`)" />
          </div>
        </div>
        <div class="midle">
          <div class="p_1">
            {{ item.name }}
          </div>
          <!-- <span class="branch" v-if="item.branch !== undefined">
            {{ item.branch !== undefined && item.branch }}
          </span> -->
          <span class="branch doubleRewards" v-if="item.name == 'LINA'">{{
            linaRewards
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collateralAssets } from "~/assets/linearLibrary/linearTools/collateralAssets";

export default {
  name: "muticollateralSelector",
  props: {
    selectedCollateral: {
      type: Object,
      default: undefined,
    },
    setSelectedCollateral: {
      type: Function,
      default: undefined,
    },
  },
  data() {
    return {
      showDropdown: false,
      collateralAssets: collateralAssets,
      linaRewards: "2X Weekly Rewards",
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
  methods: {
    showDropdownFun() {
      setTimeout(() => {
        this.showDropdown = !this.showDropdown;
      }, 1);
    },

    onDropdownitemClick(item) {
      this.showDropdown = true;
      this.setSelectedCollateral(item);
      this.$store.commit("setMultiCollateralAsset", item.key);
    },
  },
};
</script>

<style lang="scss" scoped>
.actionInputItem {
  cursor: pointer;

  .itemTypeTitle {
    font-family: Gilroy;
    font-weight: bold;
    font-size: 24px;
    line-height: 32px;
    color: #5a575c;
    display: flex;
    align-items: center;
    text-transform: capitalize;

    .tip {
      margin-left: 8px;

      img {
        margin-top: -3px;
      }
    }
  }

  .itemType {
    display: inline-flex;
  }

  .itemLeft {
    display: flex;
    margin-right: 16px;
    align-items: center;
  }

  .arrow {
    width: 16px;
    height: 16px;
    margin: 0px 10px 10px 0;
  }
  .iconBox {
    .icon {
      margin-right: 16px;
      width: 40px;
      height: 40px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .midle {
    flex: 1;
    display: inline-flex;

    .p_1 {
      font-family: Gilroy-Bold;
      font-size: 16px;
      line-height: 24px;
      text-transform: uppercase;
      color: #5a575c;
    }
  }

  .branch {
    font-family: Gilroy;
    font-size: 12px;
    font-weight: 100;
    line-height: 16px;
    margin-left: 4px;
    text-align: left;
    color: #aba8a8;
    text-transform: lowercase;
  }

  .doubleRewards {
    font-family: Gilroy;
    font-weight: 400 !important;
    font-size: 12px;
    line-height: 16px;
    text-transform: capitalize;
    margin: auto 10px;
    color: #99999a;
  }

  .dropdown {
    position: absolute;
    left: -1px;
    top: calc(100% + 4px);
    width: 400px;
    overflow-y: auto;
    background: #fff;
    // box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
    z-index: 1;
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    // transition: box-shadow $animete-time linear;
    display: flex;
    flex-direction: column;
    padding: 8px 0;

    .app-dark & {
      background-color: #141b2d;
      border: 1px solid #3c3a3e;
    }

    .dropdownItem {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 16px 24px;

      &:hover {
        background: #f2f7ff;
      }
      &:hover {
        .app-dark & {
          .p_1 {
            color: #7eb5ff !important;
          }
          background-color: #23376a;
        }
      }
      &.active {
        .midle {
          color: #515a6e;
          .p_1 {
            color: #1a38f8 !important;

            .app-dark {
              color: #1a38f8 !important;
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: $max-phone-width) {
  .actionInputItem {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    position: relative;

    .itemTypeTitle {
      .app-dark & {
        color: #f6f5f6 !important;
      }
    }
    .midle {
      .p_1 {
        .app-dark & {
          color: #f6f5f6 !important;
        }
      }
    }

    .dropdown {
      width: 100%;
    }
  }
}

@media only screen and (min-width: $max-phone-width) {
  .actionInputItem {
    .dropdown {
      min-height: 100%;
    }
  }
}
</style>
