import {environment} from "../../environments/environment";

export class Page {
  constructor(public pageNumber: number = 1, public pageSize: number = 100) {}
}
/**
 * 只读管理员能够访问的url
 * 在dataService.ts中添加的url需要增加
 **/
export const urls = {
  api: `
  /login,
  /user/reset_pwd,
  /api/user/active,
  /api/user/unlock/mail,
  /api/user/password/mail,
  /user/pwd/policy,
  /logout,
  `,
  admin: `
  /api/user/reset_password,
  /getDeviceList,
  /getDeviceGroupList,
  /getDeviceBrand,
  /getDeviceGroupById,
  /getDeviceById,
  /getDeviceTrail,
  /getDeviceInfo,
  /getDeviceOperatingLog,
  /getDeviceCirculationLog,
  /getDailyUsage,
  /getDeviceApp,
  /getDeviceViolationLog,
  /getSummaryStatus,
  /getSummarySecurity,
  /getSummarySystem,
  /getSummaryActivity,
  /get_device_policy,
  /get_self_help_device_list,
  /get_users_and_devices_number,
  /get_violation_type_statistics,
  /get_sensitive_word_list,
  /get_illegal_url_list,
  /get_illegal_device_list,
  /get_policy_info_id,
  /get_policy_type_platform,
  /get_sensitive_word_url_list,
  /getUserById,
  /getUserList,
  /getUserByGroupId,
  /getUserBySearch,
  /getUsersByUserNames,
  /getUserStateStatistics,
  /getDepList,
  /getUserGroupById,
  /getAppList,
  /getAppDetail,
  /getAppOldVersionList,
  /getAppClassficationList,
  /getAccessConfOfApp,
  /getContentList,
  /getContentDistList,
  /getAccessConfOfContent,
  /getDownloadConfOfContent,
  /getContentTags,
  /getTagList,
  /getPushList,
  /getPushDetail,
  /getPushStatistics,
  /get_log_list,
  /get_logo_address,
  /get_serialnumber_message,
  /get_user_agreement,
  /get_qrcode,
  /getEMMList,
  /getSecureStoreList,
  /getDeviceModelList,
  /get_admin_list,
  /get_connectorList,
  /get_details,
  /findGroupByName,
  `
};
export const echarts_yAxis = [
  {
    type: 'value',
    axisTick: {
      alignWithLabel: true,
      show: false
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#e8e8e8',
      }
    },
    splitLine: {
      lineStyle: {
        color: ['#e8e8e8'],
        type: 'dashed'
      }
    }
  }
];
export const echarts_xAxis_style = {
  type: 'category',
  axisTick: {
    alignWithLabel: true,
    show: false
  },
  axisLine: {
    show: true,
    lineStyle: {
      color: '#e8e8e8',
    }
  },
};
export const blankImgSrc = environment.deployPath + '/assets/img/noinformation.png';
