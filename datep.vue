<template>
  <div id="dateVue">
    <!-- 文本显示 -->
    <div id="inputBox">
      <input type="text" v-model="oninputText" @click="oninput" />
      <span class="empty" @click="onempty" v-if="oninputText != '选择日期'"
        >x</span
      >
    </div>
    <!--  -->
    <section>
      <div id="shortcutKey" v-if="shortcutKeyFlag1 && shortcutKeyFlag2">
        <p @click="onKeythisDay">今天</p>
        <p @click="onKeyyesterday">昨天</p>
        <p @click="onKeylastweek">一周前</p>
      </div>
      <div class="YMD" v-show="YMDflag">
        <!-- 箭头操作 -->
        <div id="replaceBox">
          <div class="last">
            <span class="hover_color" @click="onchangeYear(-1)">&lt;&lt;</span>
            &nbsp;
            <span class="hover_color" @click="onchangeMonth(true)">&lt;</span>
          </div>
          <div class="dateCom">
            <span class="hover_color" @click="onY">
              {{ changeDate.year }}&nbsp;年
            </span>
            &nbsp;
            <span class="hover_color" @click="onM(changeDate.year)">
              {{ changeDate.month }}&nbsp;月
            </span>
          </div>
          <div class="next">
            <span class="hover_color" @click="onchangeMonth(false)">&gt;</span>
            &nbsp;
            <span class="hover_color" @click="onchangeYear(1)">&gt;&gt;</span>
          </div>
        </div>
        <!-- 内容 -->
        <div id="dateBox">
          <div class="week">
            <span>日</span>
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span>六</span>
          </div>
          <div class="content">
            <div
              v-for="item in lastList"
              :key="item.id"
              :class="{ defaultCss: redCSS }"
            >
              <span class="noColor">{{ item }}</span>
            </div>
            <!-- 本月 -->
            <div
              v-for="item in thisList"
              :key="item.id"
              :class="{
                defaultCss: redCSS,
              }"
              :style="
                redCSSList.indexOf(item) != -1
                  ? {
                      background: '#f5f7fa',
                      cursor: 'not-allowed',
                      'pointer-events': 'none',
                      color: '#dcdfe6',
                    }
                  : ''
              "
            >
              <span
                class="hover_color "
                :class="{
                  thisDay: thisDayFlag && localTime.day == item,
                  selected: selectedFlag && inputDate.day == item,
                }"
                @click="oninputDate(item)"
                >{{ item }}</span
              >
            </div>
            <div
              v-for="item in nextList"
              :key="item.id"
              :class="{
                defaultCss: redCSS || redNextList.indexOf(item) != -1,
              }"
            >
              <span class="noColor">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="M" v-show="Mflag">
        <!-- 箭头操作 -->
        <div id="replaceBox">
          <div class="last">
            <span class="hover_color" @click="onchangeYear(-1)">&lt;&lt;</span>
          </div>
          <div class="dateCom">
            <span class="hover_color"> {{ changeDate.year }}年 </span>
          </div>
          <div class="next">
            <span class="hover_color" @click="onchangeYear(1)">&gt;&gt;</span>
          </div>
        </div>
        <!-- 内容 -->
        <div id="dateBox">
          <div class="content">
            <div
              v-for="(item, index) in monthList"
              :key="index"
              class="hover_color"
              @click="onMchangeMonth(index)"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      <div class="Y" v-show="Yflag">
        <!-- 箭头操作 -->
        <div id="replaceBox">
          <div class="last">
            <span class="hover_color" @click="onchangeYearList(-10)"
              >&lt;&lt;</span
            >
            &nbsp;
          </div>
          <div class="dateCom">
            <span class="hover_color">
              {{ yearList[0] }}年-{{ yearList[9] }}年
            </span>
            &nbsp;
          </div>
          <div class="next">
            <span class="hover_color" @click="onchangeYearList(10)"
              >&gt;&gt;</span
            >
          </div>
        </div>
        <!-- 内容 -->
        <div id="dateBox">
          <div class="content">
            <div
              v-for="item in yearList"
              :key="item.id"
              class="hover_color"
              :class="{ thisDay: item == changeDate.year }"
              @click="onM(item)"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import onlist from "./list.js";
import onyearList from "./year.js";
export default {
  name: "dateVue",
  props: ["pickeroptions", "type"],
  data() {
    return {
      thisDayFlag: true, //今天样式
      selectedFlag: true, //选中样式
      YMDflag: false,
      Yflag: false,
      Mflag: false,
      //快捷键是否显示
      shortcutKeyFlag1: false,
      shortcutKeyFlag2: false,
      // 快捷键，样式
      redCSS: false,
      redCSSList: [],
      redNextList: [],
      lastList: [], //上个月
      nextList: [], //下个月
      yearList: [], //Y
      //月
      monthList: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ],
      // 本地时间
      localTime: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      },
      // 用来改变的日期
      changeDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      },
      // 用来保存文本的日期
      inputDate: {
        year: 0,
        month: 0,
        day: 0,
      },
    };
  },
  created() {
    // 初始化YMD数据渲染
    let list = onlist(this.localTime.year, this.localTime.month);
    this.lastList = list[0];
    this.nextList = list[1];
    this.thisList = list[2];
    // 带快捷键模式
    if (this.pickeroptions) {
      // 让快捷键显示
      this.shortcutKeyFlag1 = true;
    }
  },

  methods: {
    //显示YMD
    oninput() {
      if (this.type == "year") {
        let yearLists = onyearList(this.localTime.year);
        this.yearList = [...yearLists];
        this.Yflag = true;
      } else if (this.type == "month") {
        this.Mflag = true;
      } else {
        this.YMDflag = true;
      }
      this.shortcutKeyFlag2 = true;
    },
    // 更换年
    onchangeYear(num) {
      this.changeDate.year += num;
    },
    // 更换月
    onchangeMonth(bl) {
      if (bl) {
        if (this.changeDate.month > 1) {
          this.changeDate.month--;
        } else {
          this.changeDate.year--;
          this.changeDate.month = 12;
        }
      } else {
        if (this.changeDate.month < 12) {
          this.changeDate.month++;
        } else {
          this.changeDate.year++;
          this.changeDate.month = 1;
        }
      }
    },
    // 保存日期对象
    oninputDate(item) {
      this.changeDate.day = item;
      this.inputDate = { ...this.changeDate };
      this.YMDflag = false;
      this.shortcutKeyFlag2 = false;
    },
    // 清除文本
    onempty() {
      this.inputDate.day = 0;
    },
    // 年组
    onY() {
      // Y
      let yearLists = onyearList(this.changeDate.year);
      this.yearList = [...yearLists];
      this.YMDflag = false;
      this.Yflag = true;
      this.Mflag = false;
    },
    // 更换年组
    onchangeYearList(num) {
      let yearLists = onyearList(this.yearList[0] + num);
      this.yearList = [...yearLists];
    },
    // 月上的年
    onM(item) {
      // M
      if (this.type == "year") {
        this.inputDate.day = item;
        this.inputDate.year = item;
        this.Yflag = false;
        this.shortcutKeyFlag2 = false;
      } else if (this.type == "month") {
        console.log("month");
      } else {
        this.month = item;
        this.changeDate.year = item;
        this.YMDflag = false;
        this.Yflag = false;
        this.Mflag = true;
      }
    },
    onMchangeMonth(index) {
      //
      if (this.type == "year") {
        console.log("year");
      } else if (this.type == "month") {
        this.inputDate.year = this.changeDate.year;
        this.inputDate.month = index + 1;
        this.inputDate.day = index + 1;
        this.Mflag = false;
        this.shortcutKeyFlag2 = false;
      } else {
        this.changeDate.month = index + 1;
        this.YMDflag = true;
        this.Yflag = false;
        this.Mflag = false;
      }
    },
    // 快捷键
    onKeythisDay() {
      this.changeDate = { ...this.localTime };
      this.inputDate = { ...this.localTime };
      this.YMDflag = false;
      this.shortcutKeyFlag2 = false;
    },
    onKeyyesterday() {
      this.changeDate = { ...this.localTime };
      this.changeDate.day -= 1;
      this.inputDate = { ...this.changeDate };
      this.YMDflag = false;
      this.shortcutKeyFlag2 = false;
    },
    onKeylastweek() {
      this.changeDate = { ...this.localTime };
      this.changeDate.day -= 7;
      this.inputDate = { ...this.changeDate };
      this.YMDflag = false;
      this.shortcutKeyFlag2 = false;
    },
  },
  watch: {
    changeDate: {
      // 用来改变的日期
      handler(newVal) {
        // 更新YMD数据渲染
        let list = onlist(this.changeDate.year, this.changeDate.month);
        this.lastList = list[0];
        this.nextList = list[1];
        this.thisList = list[2];
        // 今天样式
        if (
          newVal.year == this.localTime.year &&
          newVal.month == this.localTime.month
        ) {
          this.thisDayFlag = true;
        } else {
          this.thisDayFlag = false;
        }
        // 选中样式
        if (
          newVal.year == this.inputDate.year &&
          newVal.month == this.inputDate.month
        ) {
          this.selectedFlag = true;
        } else {
          this.selectedFlag = false;
        }

        //  快捷键模式
        if (this.pickeroptions) {
          //   本月今天之后的样式
          this.redCSSList = [];
          // 下个月
          this.redNextList = [];
          if (
            newVal.year == this.localTime.year &&
            newVal.month == this.localTime.month
          ) {
            for (
              var i = this.localTime.day + 1;
              i <=
              new Date(this.localTime.year, this.localTime.month, 0).getDate();
              i++
            ) {
              this.redCSSList.push(i);
              this.redNextList = this.nextList;
            }
          } else {
            this.redCSSList = [];
            this.redNextList = [];
          }
          // 不可选中的样式
          if (
            newVal.year > this.localTime.year ||
            (newVal.year == this.localTime.year &&
              newVal.month > this.localTime.month)
          ) {
            this.redCSS = true;
          } else {
            this.redCSS = false;
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    oninputText() {
      let texts = "选择日期";
      if (this.inputDate.day != 0) {
        if (this.type == "year") {
          texts = this.inputDate.year;
        } else if (this.type == "month") {
          let month =
            this.inputDate.month < 10
              ? "0" + this.inputDate.month
              : this.inputDate.month;
          texts = `${this.inputDate.year}-${month}`;
        } else {
          let month =
            this.inputDate.month < 10
              ? "0" + this.inputDate.month
              : this.inputDate.month;
          let day =
            this.inputDate.day < 10
              ? "0" + this.inputDate.day
              : this.inputDate.day;
          texts = `${this.inputDate.year}-${month}-${day}`;
        }
      }
      return texts;
    },
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}
@color_dcdfe6: #dcdfe6;
@color_1989fa: #1989fa;
//
#dateVue {
  position: relative;
  margin: 10px;
  section {
    margin-top: 5px;
    position: absolute;
    width: auto;
    display: flex;
    border: 1px solid @color_dcdfe6;
    border-radius: 5px;
    overflow: hidden;
  }
}
//
#shortcutKey {
  border-right: 1px solid @color_dcdfe6;
  width: 110px;
  padding-top: 10px;
  p {
    height: 30px;
    line-height: 30px;
    color: #606266;
    font-size: 14px;
    text-indent: 20px;
    cursor: pointer;
    &:hover {
      color: @color_1989fa;
    }
  }
}
// 默认快捷键样式
.defaultCss {
  background: #f5f7fa;
  cursor: not-allowed;
  pointer-events: none;
  color: @color_dcdfe6;
}
// 可以点击样式，快捷键
.canClick {
  background: #fff;
  color: #333;
  pointer-events: auto;
  cursor: pointer;
}
//
.YMD {
  padding: 12px;
  #dateBox {
    .content {
      div {
        position: relative;
        width: 41.71px;
        height: 30px;
        margin: 4px 0;
        cursor: pointer;
        span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          text-align: center;
          line-height: 24px;
        }
      }
    }
  }
}
.M {
  padding: 12px;
  #replaceBox {
    padding-bottom: 12px;
    border-bottom: 1px solid @color_dcdfe6;
  }
  #dateBox {
    .content {
      div {
        width: 25%;
        height: 64px;
        line-height: 64px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
.Y {
  padding: 12px;
  #replaceBox {
    padding-bottom: 12px;
    border-bottom: 1px solid @color_dcdfe6;
  }
  #dateBox {
    .content {
      div {
        width: 25%;
        height: 72px;
        line-height: 72px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
//
//鼠标进入改变字体颜色
.hover_color {
  &:hover {
    color: @color_1989fa;
  }
}
// 今天样式
.thisDay {
  color: @color_1989fa;
  font-weight: bold;
}
// 选中的样式
.selected {
  background: @color_1989fa;
  color: #fff !important;
}
// 不能选中的字体颜色
.noColor {
  color: @color_dcdfe6;
}
// 文本显示---------------
#inputBox {
  position: relative;
  input {
    width: 220px;
    height: 40px;
    padding: 0 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid @color_dcdfe6;
    cursor: pointer;
    &:focus {
      border: 1px solid @color_1989fa !important;
    }
  }
  &:hover {
    .empty {
      display: block;
    }
    input {
      border: 1px solid #cacaca;
    }
  }
  // 清空
  .empty {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 190px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid @color_dcdfe6;
    font-size: 8px;
    text-align: center;
    line-height: 10px;
    color: @color_dcdfe6;
    cursor: pointer;
    // 清空按钮默认隐藏
    display: none;
  }
}
// replaceBox箭头操作--------------------------------
#replaceBox {
  width: 298px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 auto;
  .dateCom {
    font-size: 16px;
  }
  .last,
  .next {
    font-size: 10px;
  }
}
// dateBox内容----------------------------------------------
#dateBox {
  width: 292px;
  font-size: 12px;
  margin: 0 auto;
  .week {
    display: flex;
    height: 41px;
    border-bottom: 1px solid @color_dcdfe6;
    cursor: default;
    span {
      flex: 1;
      text-align: center;
      line-height: 41px;
    }
  }
  .content {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
