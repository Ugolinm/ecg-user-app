<template>
  <view class="home">
    <view
      class="select"
      @click="onModify(names)"
      v-if="!((!reports || reports.length === 0) && name === '全部')"
    >
      <text class="selectName">{{ name }}</text>
      <image
        class="edit-icon"
        src="../../static/report/Triangle.png"
        mode=""
      ></image>
    </view>

    <view class="empty" v-if="!reports || reports.length === 0">
      <image
        src="../../static/report/empty.png"
        mode=""
        style="width: 215px; height: 178px"
      ></image>
      <text class="hint">您还暂无任何报告记录</text>
    </view>
    <view class="list" v-else>
      <view class="item" v-for="report of reports" :key="report?.report_id">
        <view class="title_bar" v-if="report?.report_up_tm">
          <view class="name">{{ report?.patient_name }}</view>
          <button
            class="u-reset-button"
            @click="onViewReport(report)"
            :style="
              report?.readed === 'N'
                ? 'margin-right: -10px;'
                : 'margin-right: 20px;'
            "
          >
            查看报告
          </button>
          <view class="" v-if="report?.readed === 'N'">
            <image
              class="line"
              src="../../static/report/new.png"
              mode=""
            ></image>
          </view>
        </view>
        <view class="title_bar" v-else>
          <view class="name">{{ report?.patient_name }}</view>
          <button
            class="u-reset-button"
            style="color: #999999; margin-right: 20px"
          >
            报告未出
          </button>
        </view>

        <view class="data_bar">
          <view class="time">
            <view class="collect-time">
              <text>采集时长:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</text
              ><text>{{ collectTime(report?.duration) }}</text>
            </view>
            <view class="collect-time">
              <text>数据上传时间:&nbsp;</text
              ><text>{{ format("Y-M-D h:m:s", report?.data_up_tm) }}</text>
            </view>
            <view class="report-time" v-if="report?.report_up_tm">
              <text>出报告时间:&nbsp;&nbsp;&nbsp;&nbsp;</text
              ><text>{{ format("Y-M-D h:m:s", report?.report_up_tm) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <zwy-popup
      v-bind:ishide="isshow"
      width="268px"
      height="186px"
      radius="10px"
    >
      <!-- 自定义展示内容 -->
      <view class="content">
        <view class="title">温馨提示</view>
        <view class="subTitle">没有匹配到与心电设备绑定的用户</view>
        <view class="subTitle" style="margin-top: 10px">
          <text>请先去 “</text>
          <text style="color: #02cd88">我的</text>
          <text>” 使用者管理里添加</text>
        </view>
        <view
          style="
            margin-top: 20px;
            width: 100%;
            height: 1px;
            background-color: #d8d8d8;
          "
        >
        </view>
        <view style="margin-top: 15px">
          <text style="color: #666666" @click="cancle()">取消</text>

          <text style="margin-left: 90px; color: #02cd88" @click="goAdd()"
            >去添加</text
          >
        </view>
        <view
          style="
            margin-top: -35px;
            width: 1px;
            height: 55px;
            background-color: #d8d8d8;
            z-index: -1;
          "
        >
        </view>
      </view>
    </zwy-popup>
  </view>
</template>

<script lang="ts">
import { useWxUserStore } from "@/stores/account";
import { useReportStore } from "@/stores/report";

export default {
  data() {
    return {
      isshow: false,
      name: "全部",
      names: ["全部"],
      users: [],
      reportStore: useReportStore(),
      reports: [],
      pageno: 1,
      pagecnt: 10,
    };
  },
  async onLoad() {
    const accStore = useWxUserStore();
    const uuid: string = accStore.getUUID();
    if (!accStore.isLoggedIn()) {
      uni.redirectTo({ url: "/pages/grant/grant" });
    } else {
      uni.request({
        url: `${BU_API}/pat_app/patients/find`,
        data: {
          belongto: uuid,
        },
        header: {},
        method: "POST",
        success: (res: any) => {
          console.log("查找patients/find成功", res.data);

          if (res.data["error"]) {
            uni.showToast({ icon: "none", title: "服务器异常，请联系客服" });
            return false;
          }

          this.users = res.data;

          for (let s of res.data) {
            this.names.push(s.name);
          }

          if (res.data.length > 0) {
            this.isshow = false;
          } else {
            this.isshow = true;
          }
        },
        fail: (err: any) => {
          console.log("err:", err);
        },
      });
    }

    this.reports = await find(1, this.pagecnt);
    console.log(this.reports);
    this.reportStore.setReports(this.reports);
  },
  async onPullDownRefresh() {
    console.log("refresing...");
    this.pageno = 1;
    this.reports = await find(this.pageno, this.pagecnt);
    console.log(this.reports);
    this.reportStore.setReports(this.reports);
    uni.stopPullDownRefresh();
  },
  async onReachBottom() {
    console.log("fetching more...");
    this.pageno += 1;
    const more = await find(this.pageno, this.pagecnt);
    if (more && more.length > 0) {
      this.reports = this.reports.concat(more);
      console.log(more);
      this.reportStore.setReports(this.reports);
      if (more.length < this.pagecnt) {
        uni.showToast({ icon: "none", title: "没有更多了" });
      }
    } else {
      uni.showToast({ icon: "none", title: "没有更多了" });
    }
  },
  methods: {
    cancle() {
      this.isshow = false;
    },
    goAdd() {
      this.isshow = false;
      uni.navigateTo({
        url: "/pages/mine/users/adduser/adduser?from=users",
      });
    },
    onModify(options?: any) {
      uni.showActionSheet({
        itemList: options,
        success: (res) => {
          console.log(res?.tapIndex, this.names[res?.tapIndex]);
          this.name = this.names[res?.tapIndex];

          if (this.name.length > 3) {
            let str = this.name.substring(0, 3) + "...";
            this.name = str;
          }

          if (res?.tapIndex > 0) {
            for (let s of this.users) {
              if (s.name == this.names[res?.tapIndex]) {
                uni.setStorage({
                  key: "userUUID",
                  data: s.uuid,
                });

                uni.startPullDownRefresh({});
              }
            }
          }

          if (res?.tapIndex == 0) {
            uni.removeStorageSync("userUUID");
            uni.startPullDownRefresh({});
          }
        },
        fail: (res) => {
          console.log(res);
        },
      });
    },
  },
};
</script>

<script lang="ts" setup>
import { find } from "@/assets/report";
import { format } from "@/assets/utils";
import { collectTime } from "@/assets/utils";
import { BU_API } from "@/assets/config";

const onViewReport = (report: any) => {
  uni.showLoading({
    title: "正在打开文档",
  });
  const report_url = `${BU_API}/${report?.report_id}`;
  wx.downloadFile({
    //将文档下载到本地
    url: report_url, //pdf链接
    success(res) {
      wx.openDocument({
        //打开文档
        filePath: res.tempFilePath, //本地文档路径
        fileType: "pdf", //文档类型
        showMenu: true,
        success: function (res) {
          wx.showToast({ title: "打开文档成功" });

          uni.request({
            url: `${BU_API}/pat_app/report/${report?.report_id}`,
            data: {},
            header: {},
            method: "GET",
            success: (res: any) => {
              console.log("已读成功", res);
              report.readed = "Y";
            },
            fail: (err: any) => {
              console.error("已读失败", err);
            },
          });
        },
        fail: function (res) {
          wx.showToast({ title: "打开文档失败" });
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },
  });
};
</script>

<style lang="less" scoped>
@import url("@/assets/common.less");

.home {
  .select {
    margin-top: 15px;
    margin-left: 15px;
    width: 100px;
    height: 30px;
    border-radius: 15px;
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .edit-icon {
    width: 10px;
    height: 8px;
    margin-left: 5px;
  }
  .selectName {
    color: #333333;
    font-size: 15px;
  }
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 200px;
    .hint {
      font-size: 14px;
      color: #999;
    }
  }
  .line {
    height: 37px;
    width: 37px;
    margin-top: -13px;
    margin-right: 0px;
  }
  .u-reset-button {
    padding: 0;
    font-size: inherit;
    line-height: inherit;
    background-color: transparent;
    color: #02cd88;
    z-index: 66;
  }
  .u-reset-button::after {
    border: none;
  }
  .list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 15px;
    .item {
      background-color: #fff;
      width: 100%;
      margin: 10px 0;
      border-radius: 8px;
      .title_bar {
        display: flex;
        align-items: center;
        height: 54px;
        border-bottom: 1px dashed #eee;
        font-size: 16px;
        .flag {
          height: 10px;
          width: 4px;
          background-color: @geo-primary;
          margin-right: 10px;
        }
        .name {
          height: 54px;
          margin-left: 15px;
          color: #333333;
          font-size: 20px;
          line-height: 54px;
        }
        .device {
          flex: 1;
          text-align: right;
          color: #999;
          font-size: 12px;
          padding-right: 4px;
        }
      }
      .data_bar {
        display: flex;
        align-items: center;
        padding: 15px;
        color: #666666;
        font-size: 13px;
        .time {
          flex: 1;
          .collect-time {
            line-height: 20px;
          }
          .report-time {
            line-height: 20px;
          }
        }
      }
    }
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
  .title {
    font-size: 16px;
    margin-top: 20px;
    font-weight: bold;
  }
  .subTitle {
    font-size: 15px;
    margin-top: 20px;
    color: #333333;
    font-weight: 400;
  }
}
</style>
