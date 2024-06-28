<template>
  <v-chart :options="option" :autoresize="autoResize" ref="chart" />
</template>

<style>
.echarts {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<script>
/**
 * 展示折线数据图
 * 按需引入echarts组件
 */
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import _ from "lodash";
import numbro from "numbro";

export default {
  props: {
    data: {
      //数据
      type: Object,
      default: {},
    },
    color: {
      //自定义颜色
      type: Object,
    },
    area: {
      //开启区域
      type: Boolean,
      default: false,
    },
    tooltip: {
      //是否显示提示组件
      type: Boolean,
      default: false,
    },
    animation: {
      //是否显示动画
      type: Boolean,
      default: true,
    },
    smooth: {
      //平滑折线
      type: Boolean,
      default: false,
    },
    formatter: {
      //tooltip显示内容格式化
      type: String,
      default: "{c0}",
    },
    autoResize: {
      //是否自动更新大小,否则需手动调用resize
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    isMobile: {
      //是否手机端
      type: Boolean,
      default: false,
    },
  },
  watch: {
    //监视data变动
    data(newData) {
      this.option.series[0].data = newData.series;
      this.refresh();
    },
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
  },
  methods: {
    //更新数据
    updateData(newData) {
      this.$refs.chart.mergeOptions(newData);
    },

    //显示加载
    showLoading() {
      this.$refs.chart.showLoading();
    },

    //隐藏加载
    hideLoading() {
      this.$refs.chart.hideLoading();
    },

    //重新更新大小
    resize() {
      this.$refs.chart.resize();
    },

    //重新渲染组件
    refresh() {
      this.$refs.chart.refresh();
    },

    //清空
    clear() {
      this.$refs.chart.clear();
    },

    //销毁
    dispose() {
      this.$refs.chart.dispose();
    },
  },
  data() {
    /**
     *  初始化颜色配置
     *  不在props里面验证是因为data更新时会重新调用验证方法,导致重复赋值
     */
    let innerColor = {};

    innerColor.textColor = _.has(this.color, "textColor")
      ? this.color.textColor
      : "#bebebe";
    innerColor.lineColor = _.has(this.color, "lineColor")
      ? this.color.lineColor
      : "#11BA97";

    innerColor.backgroundColor = _.has(this.color, "backgroundColor")
      ? this.color.backgroundColor
      : "#FFFFFF";

    innerColor.areaColorTop = _.has(this.color, "areaColorTop")
      ? "#1A38F8"
      : "#1A38F8";

    innerColor.areaColorBottom = _.has(this.color, "areaColorBottom")
      ? this.color.areaColorBottom
      : "white";

    innerColor.tooltipLineColor = _.has(this.color, "tooltipLineColor")
      ? this.color.tooltipLineColor
      : innerColor.lineColor;

    /* 初始化颜色配置 */
    return {
      option: {
        title: {
          text: this.title,
          left: this.isMobile ? "center" : "18%",
          textStyle: {
            fontSize: "12",
            fontWeight: 400,
            color: innerColor.textColor,
          },
        },
        textStyle: {
          fontFamily: "Gilroy", //全局字体
        },
        animation: this.animation, //动画
        animationDurationUpdate: false, //数据更新时动画(线性动态数据需关闭)
        backgroundColor: innerColor.backgroundColor, //背景色
        grid: {
          //边距
          // top: 10,
          left: "26%",
          right: "18.2%",
          // bottom: 0

          // containLabel:true
        },
        xAxis: {
          type: "category",
          // show: false, //不显示横坐标栏
          boundaryGap: false, //左右边距
          data: this.data.xAxis.data, //横坐标数据,用于显示tooltip
          axisTick: {
            show: false, // 不显示刻度线
          },
          axisLine: {
            show: false, //不显示轴线
          },
          axisLabel: {
            align: "right",
            padding: [17, 0, 0, 0],
            //文本样式
            textStyle: {
              color: innerColor.textColor, //轴上的字体颜色
              fontSize: "14", // 轴字体大小
              fontWeight: "bold",
            },
          },
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false, // 不显示刻度线
          },
          minInterval: 1,
          // max:"dataMax",  //显示最大值
          // minInterval: _.round(_.min(this.data.series) / 2),//手动计算间隔
          // maxInterval: _.round(_.min(this.data.series) / 2),//手动计算间隔
          splitNumber: 3, //echart自己计算间隔
          axisLine: {
            show: false, //不显示轴线,
          },
          splitLine: {
            //网格线
            lineStyle: {
              color: "#EEEEEE",
            },
          },
          axisLabel: {
            rotate: 90,
            //文本样式
            padding: [0, 10, 0, 0],
            textStyle: {
              color: innerColor.textColor, //轴上的字体颜色
              fontSize: "14", // 轴字体大小
              fontWeight: "bold",
            },
          },
          // axisLabel:{
          //     show :false,
          // }
          // show: false, //不显示竖坐标栏
        },
        tooltip: {
          show: this.tooltip, //是否显示
          trigger: "axis",
          formatter: function (val) {
            if (!val[0].data || !Number(val[0].data)) return 0;
            return numbro(_.floor(val[0].data, 2)).format(
              "0,0." + "0".repeat(2)
            );
          }, //格式化输入内容
          confine: true, //不显示在图标外
          axisPointer: {
            animation: this.animation, //关闭动画
            lineStyle: {
              color: innerColor.tooltipLineColor, //竖线颜色
            },
          },
        },
        series: [
          {
            data: this.data.series, //数据
            type: "line", //图表类型
            areaStyle: this.area
              ? {
                  //线内区域样式
                  color: {
                    //从上往下过渡色
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: innerColor.areaColorTop, // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: innerColor.areaColorBottom, // 100% 处的颜色
                      },
                    ],
                  },
                }
              : null,
            smooth: this.smooth, //平滑曲线
            lineStyle: {
              //折线颜色
              color: innerColor.lineColor,
            },
            showSymbol: false, //不显示拐点
            symbol: "circle", //拐点样式,实心
            symbolSize: 6, //拐点大小
            itemStyle: {
              color: innerColor.lineColor, //拐点颜色
              borderColor: "#FFF", //边框颜色
              borderWidth: 2, //边框宽度
              emphasis: {
                color: innerColor.lineColor, //hover时拐点颜色
              },
            },

            // hoverAnimation: this.animation //hover动画
          },
        ],
      },
    };
  },
};
</script>
