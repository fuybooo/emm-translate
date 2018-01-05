import {Injectable} from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
@Injectable()
export class DataService {
  url;
  constructor() {
    let path = environment.path;
    /**
     * 用自定义设置的IP（localStorage： EMM-IP） 替换API调用的地址
     * User： 在本地浏览器打开 console 输入 ：window.localStorage.setItem("EMM-IP","")
     */
    if (environment.api_changeable && window.localStorage && window.localStorage.getItem("EMM-IP")) {
      console.log("*******************************");
      console.log("******************************** start API调用方发生修改 ****************************");
      console.warn("API(change): " + environment.path + ' ==> ' + window.localStorage.getItem("EMM-IP"));
      console.log("******************************** end API调用方发生修改 *****************************");
      console.log('修改为API默认的调用地址： window.localStorage.setItem("EMM-IP","")');
      console.log("*******************************");
      environment.path = path = window.localStorage.getItem("EMM-IP");
    }

    this.url = {
      template: {
        device: path + ''
      },
      login: {
        login: path + '/login',
        reset_password: path + '/api/user/reset_password',
        reset_pwd: path + '/user/reset_pwd',
        activate: path + '/api/user/active',
        sendUnlockEmail: path + '/api/user/unlock/mail',
        sendEmail: path + '/api/user/password/mail',
        pwd_policy: path + '/user/pwd/policy',
        logout: path + '/logout',
      },
      device: {
        getDeviceList: path + '/getDeviceList',
        getDeviceGroupList: path + '/getDeviceGroupList',
        validDeviceGroupName: path + '/validDeviceGroupName',
        validDeviceFlag: path + '/validDeviceFlag',
        validAssetId: path + '/validAssetId',
        getDeviceBrand: path + '/getDeviceBrand',
        addDeviceGroup: path + '/addDeviceGroup',
        editDeviceGroup: path + '/editDeviceGroup',
        deleteDeviceGroup: path + '/deleteDeviceGroup',
        removeDevice: path + '/removeDevice',
        findGroupByName: path + '/findGroupByName',
        getDeviceGroupById: path + '/getDeviceGroupById',
        addDevice: path + '/addDevice',
        editDevice: path + '/editDevice',
        getDeviceById: path + '/getDeviceById',
        sendCommandToDevices: path + '/sendCommandToDevices',
        getDeviceTrail: path + '/getDeviceTrail',
        getDeviceInfo: path + '/getDeviceInfo',
        getDeviceOperatingLog: path + '/getDeviceOperatingLog',
        getDeviceViolationLog: path + '/getDeviceViolationLog',
        getDeviceCirculationLog: path + '/getDeviceCirculationLog',
        getDailyUsage: path + '/getDailyUsage',
        getDeviceApp: path + '/getDeviceApp',
        move: path + '/move',
        deleteDevice: path + '/deleteDevice',
        importDevice: path + '/importDevice',
        devicePanel: {
          status: path + '/getSummaryStatus',
          security: path + '/getSummarySecurity',
          system: path + '/getSummarySystem',
          activity: path + '/getSummaryActivity',
        },
        get_device_policy: path + '/get_device_policy',
        // startRemoteCtrl: './assets/fake/success.json',
        startRemoteCtrl: path + '/startRemoteCtrl',
        // sendRpc: './assets/fake/success.json',
        sendRpc: path + '/sendRpc',
        updateRemoteCtrl: path + '/updateRemoteCtrl',
        stopRemoteCtrl: path + '/stopRemoteCtrl',
        get_self_help_device_list: path + '/get_self_help_device_list',
      },
      dashboard: {
        get_users_and_devices_number: path + '/get_users_and_devices_number',
        // get_users_and_devices_number: path + '/get_users_and_devices_number',
        get_violation_type_statistics: path + '/get_violation_type_statistics',
        get_sensitive_word_list: path + '/get_sensitive_word_list',
        get_illegal_url_list: path + '/get_illegal_url_list',
        get_illegal_device_list: path + '/get_illegal_device_list',
        export_sensitive_word_list: path + '/export_sensitive_word_list',
        export_illegal_url_list: path + '/export_illegal_url_list',
        export_illegal_devices_list: path + '/export_illegal_devices_list',
      },
      policy: {
        // get_policy_info_id: './assets/fake/get_policy_info_id.json',
        get_policy_info_id: path + '/get_policy_info_id',
        // get_policy_type_platform: './assets/fake/get_policy_type_platform.json',
        get_policy_type_platform: path + '/get_policy_type_platform',
        // edit_policy_id: './assets/fake/success.json',
        edit_policy_id: path + '/edit_policy_id',
        // add_policy_platform_type: './assets/fake/success.json',
        add_policy_platform_type: path + '/add_policy_platform_type',
        // delete_policy_platform_type: './assets/fake/success.json',
        delete_policy_platform_type: path + '/delete_policy_platform_type',
        // enable_disable_policy: './assets/fake/success.json',
        enable_disable_policy: path + '/enable_disable_policy',
        // get_sensitive_word_url_list: './assets/fake/get_policy_url.json',
        check_policy_name: path + '/check_policy_name',
        // check_policy_name: './assets/fake/get_policy_url.json',
        check_sensitive_word_url_duplicate: path + '/check_sensitive_word_url_duplicate',
        // check_sensitive_word_url_duplicate: './assets/fake/get_policy_url.json',
        get_sensitive_word_url_list: path + '/get_sensitive_word_url_list',
        // delete_sensitive_word_url_list: './assets/fake/success.json',
        delete_sensitive_word_url_list: path + '/delete_sensitive_word_url_list',
        // add_sensitive_word_url_list: './assets/fake/success.json',
        add_sensitive_word_url_list: path + '/add_sensitive_word_url_list',
      },
      user: {
        /************************** 统  计 ************************/
        userStateStatistics: path + '/getUserStateStatistics',

        /*******************************user************************************/
        getUserById: path + '/getUserById',
        deleteUser: path + '/user/deleteUser',

        getUserList: path + '/getUserList',
        getUserByGroupId: path + '/getUserByGroupId',
        getUserBySearch: path + '/getUserBySearch', // 通过输入查找用户信息
        getUsersByUserNames: path + '/getUsersByUserNames', // 通过输入查找用户信息
        // add user
        createUser: path + '/createUser',
        isUserExist: path + '/isUserExist',
        updateUserBasicInfo: path + '/updateUserBasicInfo',
        updateUser: path + '/updateUser',
        updateUserStatus: path + '/updateUserStatus',

        /*******************************userGroup************************************/
        userGroupList: path + '/getUserGroupList',
        deleteUserGroup: path + '/deleteUserGroup',
        addUserGroup: path + '/createGroup',
        editUserGroup: path + '/editUserGroup',
        checkGroupName: path + '/checkGroupName',
        getUserGroupById: path + '/getUserGroupById',
        moveUser2Group: path + '/moveUser2Group',
        groupMove: path + '/group/move',
        createGroup: path + '/createGroup',

        /*******************************dept************************************/
        getDepList: path + '/getDepList',
        createDept: path + '/createDept',
        isDeptNameExist: path + '/isDeptNameExist',
        deleteDept: path + '/deleteDep',
        moveDept: path + '/moveDept',
        moveUser: path + '/moveUser',
        deptMove: path + '/dept/move',
        upload: path + '/dept/upload',
      },
      application: {
        /************************** 应用管理 ************************/
        // 应用上传
        uploadApp: path + '/uploadApp',
        // 上传截图
        uploadFile: path + '/uploadfile',
        // 新增应用
        addApp: path + '/addApp',
        // 修改应用
        editApp: path + '/editApp',
        // 查询应用列表
        getAppList: path + '/getAppList',
        // 获取应用详情
        getAppDetail: path + '/getAppDetail',
        // 删除应用
        deleteApp: path + '/deleteApp',

        /************************** 应用扩展 ************************/
        // 应用上架
        setAppOnline: path + '/setAppOnline',
        // 获取应用历史版本
        getAppOldVersionList: path + '/getAppOldVersionList',
        // 灰度发布转正常发布
        publishApp: path + '/publishApp',
        // 调整应用位置
        switchAppPosition: path + '/switchAppPosition',

        /************************** 应用分类 ************************/
        // 新增分类
        addAppClass: path + '/addAppClassfication',
        // 编辑分类
        editAppClass: path + '/editAppClassfication',
        // 查询分类列表
        getAppClassList: path + '/getAppClassficationList',
        // 删除分类
        deleteAppClass: path + '/deleteAppClassfication',
        // 分类是否存在
        isAppClassExist: path + '/isAppClassficationExist',

        /************************** 可见范围 ************************/
        // 获取应用可见范围
        getAccessConfOfApp: path + '/getAccessConfOfApp',
        setAccessConfOfApp: path + '/setAccessConfOfApp',
      },
      content: {
        /***************** 文档 ************************/
        uploadContent: path + '/uploadContent',
        addContent: path + '/addContent',
        editContent: path + '/editContent',
        getContentList: path + '/getContentList',
        deleteContent: path + '/deleteContent',
        isContentExist: path + '/isContentExist',
        /****************** 文档扩展 ********************/
        getContentDistList: path + '/getContentDistList',
        getAccessConfOfContent: path + '/getAccessConfOfContent',
        saveAccessConfOfContent: path + '/saveAccessConfOfContent',
        getDownloadConfOfContent: path + '/getDownloadConfOfContent',
        saveDownloadConfOfContent: path + '/saveDownloadConfOfContent',
        remoteDeleteContent: path + '/remoteDeleteContent',
        /******************* 文档扩展 ********************************/
        moveContent: path + '/moveContent',
        copyContent: path + '/copyContent',
        addCollect: path + '/addCollect',
        removeCollect: path + '/removeCollect',
        attachTag: path + '/attachTag',
        getContentTags: path + '/getContentTags',
        removeTag: path + '/removeTag',
        restoreContent: path + '/restoreContent',
        /******************* 标签管理 ********************************/
        addTag: path + '/addTag',
        getTagList: path + '/getTagList',
        deleteTag: path + '/deleteTag',
        isTagExist: path + '/isTagExist',
      },
      push: {
        getPushList: path + '/getPushList',
        getPushDetail: path + '/getPushDetail',
        getPushStatistics: path + '/getPushStatistics',
        savePush: path + '/savePush',
        deleteAllPush: path + '/deleteAllPush',
        deletePush: path + '/deletePush'
      },
      logReport: {
        get_log_list: path + '/get_log_list',
        export_log: path + '/export_log',
        get_user: path + '/export/user',
        get_device: path + '/export/device',
        get_policy: path + '/export_illegal_policy',
        get_application: path + '/app_export'
      },
      setting: {
        /****************** 企业信息设置 ********************************/
        // 获取LOGO
        getLogoAddress: path + "/get_logo_address",
        // 获取序列号
        getSerialNumberMessage: path + "/get_serialnumber_message",
        // 获取用户协议
        getUserAgreement: path + "/get_user_agreement",
        // 上传LOGO
        logoSetting: path + "/logo_setting",
        // 上传用户协议
        uploadUserProtocol: path + "/upload_user_protocol",
        // 获取客户端二维码
        getQrcode: path + "/get_qrcode",
        // 设置EMM的默认版本
        setDefaultEMM: path + "/set_default_emm",

        /****************** 客户端升级 ********************************/
        // 新增EMM客户端
        addEMM: path + "/addEMM",
        // 编辑EMM客户端
        editEMM: path + "/editEMM",
        // 获取EMM应用列表
        getEMMList: path + "/getEMMList",
        // 新增安全桌面(Android)
        addSecureStore: path + "/addSecureStore",
        // 获取安全桌面应用列表
        getSecureStoreList: path + "/getSecureStoreList",
        // 新增设备型号
        addDeviceModel: path + "/addDeviceModel",
        // 查询设备型号
        getDeviceModelList: path + "/getDeviceModelList",
        // 删除设备型号
        deleteDeviceModel: path + "/deleteDeviceModel",
        // 删除EMM
        deleteEmm: path + "/delete_emm",

        /****************** 管理员设置 ********************************/
        // 获取管理员列表
        getAdminList: path + "/get_admin_list",
        // 删除管理员
        delAdmin: path + "/del_admin",
        // 更新管理员
        updateAdmin: path + "/updata_admin",
        // 添加管理员
        addAdmin: path + "/add_admin",

        /****************** 托管认证 ********************************/
        // 添加connector
        addConnector: path + "/add_connector",
        // 更新connector
        updateConnector: path + "/update_connector",
        // 获取connector列表
        getConnectorList: path + "/get_connectorList",
        // 删除connector
        delConnector: path + "/del_connector",
        // 更新publicKey
        updatePublicKey: path + "/update_publicKey",
        // 获取托管认证的连接目录
        getDetails: path + '/get_details'
      }
    };
  }
  /**
   * 将参数对象转化为查询参数
   */
  public getParams(paramsObject): HttpParams {
    let params = new HttpParams();
    for (let p in paramsObject) {
      if (paramsObject[p] !== null) {
        let value = paramsObject[p];
        if (typeof value === 'string') {
          value = value.trim();
        }
        params = params.set(p, value);
      }
    }
    return params;
  }
  /**
   * 将参数对象转化为查询参数
   */
  public getWholeParams(paramsObject) {
    return {params: this.getParams(paramsObject)};
  }
}

