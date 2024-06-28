<template>
  <Modal
    v-model="showing"
    :footer-hide="true"
    :closable="false"
    :transfer="false"
    :mask="true"
    :mask-closable="true"
    :width="412"
    @on-cancel="$emit('toggle', false)"
    class="buyModal"
  >
    <Row justify="end">
      <div style="padding-top: 16px; padding-right: 16px">
        <img
          class="closeButton"
          src="@/static/close.svg"
          @click.stop="$emit('toggle', false)"
        />
      </div>
    </Row>
    <Row justify="center">
      <div style="padding: 16px">
        <p v-if="theme === 'light'" style="color: #5a575c">
          You would like to buy LINA from:
        </p>
        <p v-else style="color: #f6f6f6">You would like to buy LINA from :</p>
      </div>
      <div style="padding: 16px">
        <Card
          v-if="theme === 'light'"
          class="ivu-card ivu-card-bordered"
          style="width: 348px; height: 100px; cursor: pointer"
        >
          <div @click.stop="closeThenOpenPCS">
            <img src="@/static/exchanges/pcs.svg" class="cardImg" />
          </div>
        </Card>
        <Card
          v-else
          class="ivu-card ivu-card-dark"
          style="
            background: #050d20;
            width: 348px;
            height: 100px;
            cursor: pointer;
          "
        >
          <div @click.stop="closeThenOpenPCS">
            <img src="@/static/exchanges/pcs_dark.svg" class="cardImg" />
          </div>
        </Card>
      </div>
      <div style="padding: 16px">
        <Card
          v-if="theme === 'light'"
          class="ivu-card ivu-card-bordered"
          style="width: 348px; height: 100px; cursor: pointer"
        >
          <div @click.stop="closeThenOpenBinance">
            <img src="@/static/exchanges/binance.svg" class="cardImg" />
          </div>
        </Card>
        <Card
          v-else
          class="ivu-card ivu-card-dark"
          style="
            background: #050d20;
            width: 348px;
            height: 100px;
            cursor: pointer;
          "
        >
          <div @click.stop="closeThenOpenBinance">
            <img src="@/static/exchanges/binance.svg" class="cardImg" />
          </div>
        </Card>
      </div>
      <div style="padding: 24px"></div>
    </Row>
  </Modal>
</template>

<script>
import { openBuyLINA, openBuyLINABinance } from "@/common/utils";

import { Row } from "view-design";

export default {
  components: { Row },
  name: "linkModal",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      showing: this.visible,
      openBuyLINA,
      openBuyLINABinance,
    };
  },
  methods: {
    closeThenOpenPCS() {
      this.$emit("toggle", false);
      setTimeout(() => openBuyLINA(), 100);
    },
    closeThenOpenBinance() {
      this.$emit("toggle", false);
      setTimeout(() => openBuyLINABinance(), 100);
    },
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
  watch: {
    visible() {
      this.showing = this.visible;
    },
  },
};
</script>

<style lang="scss">
.buyModal {
  z-index: 100;
  .ivu-modal-wrap {
    .ivu-modal {
      .ivu-modal-content {
        border-radius: 16px;
      }
    }
  }
}

.closeButton {
  cursor: pointer;

  &:hover {
    content: url("../static/close_hover.svg");
  }
}

.ivu-card-dark:hover {
  box-shadow: 0px 0px 12px #4e66ff;
}

.cardImg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
