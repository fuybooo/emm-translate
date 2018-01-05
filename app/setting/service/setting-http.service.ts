import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
@Injectable()
export class SettingHttpService {
  constructor(private http: HttpClient, private dataService: DataService) {
  }

  /****************** 企业信息设置 ********************************/
  /**
   * 获取LOGO
   * @returns {HttpClient}
   * {
        code : "",
        msg : "",
        data{
        logoAddress:"/resources/logo/100001_15.png"//企业logo图片地址
        },
      }
   */
  getLogoAddress() {
    return this.http.get(this.dataService.url.setting.getLogoAddress);
  }

  /**
   * 获取序列号
   * @returns {HttpClient}
   * {
        code : "",
        msg : "",
        data{
          freetotal : "17"//剩余可使用数
          total : "100" //已使用个数
          usetotal : "83" //总数
        }
      }
   */
  getSerialNumberMessage() {
    return this.http.get(this.dataService.url.setting.getSerialNumberMessage);
  }

  /**
   * 获取用户协议
   * @returns {HttpClient}
   * {
        code : "",
        msg : "",
        data {
          fileContent : ""//用户协议内容
        }
     }
   */
  getUserAgreement() {
    return this.http.get(this.dataService.url.setting.getUserAgreement);
  }

  /**
   * 上传LOGO
   * @returns {HttpClient}
   * {
        code : "200",
        msg : "用户协议上传成功",
      }
   */
  logoSetting() {
    return this.http.get(this.dataService.url.setting.logoSetting);
  }

  /**
   * 上传用户协议
   *  name: protocol
   * @returns {Observable<Object>}
   */
  uploadUserProtocol() {
    return this.http.post(this.dataService.url.setting.uploadUserProtocol, {});
  }

  /**
   * 获取客户端二维码
   */
  getQrcode(data: {
    platform: number
  }) {
    return this.http.get(this.dataService.url.setting.getQrcode, this.dataService.getWholeParams(data));
  }

  /****************** 客户端升级 ********************************/
  /**
   * 新增EMM客户端
   * @param data
     * platform:[1|2]//平台
       isDefault:[true|false]是否默认版本
       localName:文件名，由uploadContent返回
       deviceModelIds:设备信号ids
       userIds:用户
       userGroupIds:用户分组
       deviceGroupIds:设备分组
       deptIds:部门
   * @returns {Observable<Object>}
   */
  addEMM(data: {
    platform: string | number, // [1|2]//平台
    isDefault: boolean, // [true|false]是否默认版本
    localName: string | number, // 文件名，由uploadContent返回
    deviceModelIds: string | number, // 设备信号ids
    userIds?: string | number, // 用户
    userGroupIds: string | number, // 用户分组
    deviceGroupIds: string | number, // 用户分组
    deptIds: string | number, // 部门
  }) {
    return this.http.post(this.dataService.url.setting.addEMM, data);
  }

  /**
   * EMM 编辑
   * @param data
   * platform 1安卓 2IOS
     isDefault  0不是默认 1 是默认
     deviceModelIds 设备型号ID
     userIds
     userGroupIds
     deviceGroupIds
     deptIds
   */
  editEmm(data: any) {
    return this.http.post(this.dataService.url.setting.editEMM, data);
  }

  /**
   * 获取EMM应用列表
   * @param data
     * platform：平台
       search：搜索关键字
       pageSize：分页大小
       pageNumber：分页序号
   */
  getEMMList(data: {
    platform: number | string, // 平台
    search: number | string, // 搜索关键字
    pageSize: number | string, // 分页大小
    page: number | string, // 分页序号
  }) {
    return this.http.get(this.dataService.url.setting.getEMMList, this.dataService.getWholeParams({...data, pageNumber: data.page}));
  }


  /**
   * 删除emm
   * @param data
   * platform:[ios|android]//平台
   appId://应用id
   * @returns {Observable<Object>}
   * {
        code:200,
        msg:"success",
        data:{}
      }
   */
  deleteEMM(data: {
    platform: string | number, // [ios|android]//平台
    appId: string | number, // 应用id
  }) {
    return this.http.post(this.dataService.url.setting.deleteEmm, data);
  }

  /**
   * 设置EMM的默认版本
   * @param data
   */
  setDefaultEMM(data: {
    emmId: any
  }) {
    return this.http.post(this.dataService.url.setting.setDefaultEMM, data);
  }

  /**
   * 新增安全桌面(Android)
   * @param data
   *
   */
  addSecureStore(data: {
    isDefault: number | string, // 是否默认版本，0非默认，1默认
    localName: number | string, // 文件名，由uploadContent返回
    userIds: number | string, // 用户
    userGroupIds: number | string, // 用户分组
    deptIds: number | string, // 部门
  }) {
    return this.http.post(this.dataService.url.setting.addSecureStore, data);
  }

  /**
   * 获取安全桌面应用列表
   * @param data
   */
  getSecureStoreList(data: {
    platform: number | string, // 平台
    search: number | string, // 搜索关键字
    pageSize: number | string, // 分页大小
    page: number | string, // 分页序号
  }) {
    return this.http.get(this.dataService.url.setting.getSecureStoreList,
      this.dataService.getWholeParams({...data, pageNumber: data.page}));
  }

  /**
   * 新增设备型号
   * @param data
   * model:型号名
   * @returns {Observable<Object>}
   */
  addDeviceModel(data: {
    model: string, // 分页序号
  }) {
    return this.http.post(this.dataService.url.setting.addDeviceModel, data);
  }

  /**
   * 查询设备型号
   * @param data
   * search：搜索关键字
     pageSize：分页大小
     pageNumber：分页序号
   * @returns {Observable<Object>}
   */
  getDeviceModelList(data: {
    search: number | string, // 分页大小
    pageSize: number | string, // 分页大小
    page: number | string, // 分页大小
  }) {
    return this.http.get(this.dataService.url.setting.getDeviceModelList,
      this.dataService.getWholeParams({...data, pageNumber: data.page}));
  }

  /**
   * 删除设备型号
   * @param data
   *  id:型号id
   * @returns {Observable<Object>}
   */
  deleteDeviceModel(data: {
    id: number | string, // 型号id
  }) {
    return this.http.post(this.dataService.url.setting.deleteDeviceModel, data);
  }


  /****************** 管理员设置 ********************************/
  /**
   * 获取管理员列表
   add_edit100超级管理员
   add_edit101全局查看管理员
   add_edit102部门查看管理员
   add_edit103部门管理员
   * @param data
   pageSize：每页显示条数
   pageNumber: 显示的第几页
   sortName：排序名称
   sortOrder：排序方式
   search：搜索内容
   * @returns {HttpClient}
   * {
        code : "",
        msg : "",
        data
        [
           {
              adminId ："156"//管理员Id
              userName : "admin"，//管理员名称
              displayname
              role : "0"//管理员角色（0：超级管理员 1：全局查看管理员 2 ：部门管理员 3：部门查看管理员）
            }
        ]
      }
   */
  getAdminList(data: {
    pageSize: number | string, // 每页显示条数
    page: number | string, // 显示的第几页
    sortName: number | string, // 排序名称
    sortOrder: number | string, // 排序方式
    search: number | string, // 搜索内容
  }) {
    return this.http.get(this.dataService.url.setting.getAdminList, this.dataService.getWholeParams({...data, pageNumber: data.page}));
  }

  /**
   * 删除管理员
   * @param data
   * @returns {Observable<Object>}
   * {
        code ： ""
        msg  : ""
      }
   */
  delAdmin(data: {
    adminIds: number | string, // 管理员Id
  }) {
    return this.http.post(this.dataService.url.setting.delAdmin, data);
  }

  /**
   * 更新管理员
   * @param data
   *     adminId名称：管理员Id
         permission：管理员权限
         depIds： 部门Id（如果没有修改管理的部门则不需要传）
   * @returns {Observable<Object>}
   * {
          code ： ""
         msg  : ""
      }
   */
  updateAdmin(data: {
    adminId: string | number, // 名称管理员Id
    permission: string | number, // 管理员权限
    depId: string | number, // 部门Id（如果没有修改管理的部门则不需要传）
  }) {
    return this.http.post(this.dataService.url.setting.updateAdmin, data);
  }

  /**
   * 添加管理员
   * @param data
   *     userId：//用户Id
         permission：管理员权限
           add_edit100超级管理员
           add_edit101全局查看管理员
           add_edit102部门查看管理员
           add_edit103部门管理员
         depId：管理部门的Id（使用“.,”分割）
   * @returns {Observable<Object>}
   * {
          code ： ""
         msg  : ""
      }
   */
  addAdmin(data: {
    userId: string | number, // //用户Id
    permission: string | number, // 管理员权限
    depId: string | number, // 管理部门的Id（使用“.,”分割）
  }) {
    return this.http.post(this.dataService.url.setting.addAdmin, data);
  }

  /****************** 托管认证 ********************************/
  /**
   * 添加connector
   * @param data
   *    name：//用户名字
        description：管理员权限
   * @returns {Observable<Object>}
   * {
         "msg": "success",
         "code": "200",
      }
   */
  addConnector(data: {
    name: string | number, // 用户姓名
    description: string | number, // 管理员权限
  }) {
    return this.http.post(this.dataService.url.setting.addConnector, data);
  }

  /**
   * 更新connector
   * @param data
   *     id
          description
   description：管理员权限
   * @returns {Observable<Object>}
   * {
         "msg": "success",
         "code": "200",
      }
   */
  updateConnector(data: {
    id: string | number, // 用户姓名
    description: string | number, // 管理员权限
  }) {
    return this.http.post(this.dataService.url.setting.updateConnector, data);
  }

  /**
   * 获取connector列表
   * @param data
         pageSize: // 每页显示条数
         pageNumber:  // 显示的第几页
         search: // 搜索内容
   * @returns {Observable<Object>}
   * {
         {
            "msg": "success",
            "code": 200,
             data{
                 "total":43,
                 "result"[
                 "corpid":null,
                          "ip":null,
                          "description":"999",
                          "updateTime":null,
                           "publicKey":"MIGfM",
                          "type":null,
                          "token":"66384f34-794a-4999-b",
                          "privateKey":null,
                          "port":null,
                          "createTime":1510574651000,
                          "connectorUrl":null,
                          "name":"honglili",
                          "certificateKey":null,
                          "id":14,
                          "state":"1",
                          "syncStatus":null,
                          "timestamp":null}]
              }"
         }
   }
   */
  getConnectorList(data: {
    pageSize: number | string, // 每页显示条数
    page: number | string, // 显示的第几页
    search: number | string, // 搜索内容
    status: string, // status    0已连接    1未连接    2连接失败    3连接断开
  }) {
    return this.http.post(this.dataService.url.setting.getConnectorList, {...data, pageNumber: data.page});
  }

  /**
   * 删除connector
   * @param data
   *     name：//用户名字
        description：管理员权限
   * @returns {Observable<Object>}
   * {
         "msg": "",
         "code": "",
      }
   */
  delConnector(data: {
    id: string | number, // 用户Id
  }) {
    return this.http.post(this.dataService.url.setting.delConnector, data);
  }

  /**
   * 更新publicKey
   * @param data
   *     id：//用户Id
   * @returns {Observable<Object>}
   * {
        "msg": "success",
        "code": "200"
        "data":91a32f86-481e-4dae-b5c6-50f6edb30d8f
    }
   */
  updatePublicKey(data: {
    id: string | number, // 用户Id
  }) {
    return this.http.post(this.dataService.url.setting.updatePublicKey, data);
  }

  /**
   * 获取托管认证的连接目录
   * @param data
   *     id：//用户Id
   * @returns {Observable<Object>}
   * "data": {
            "plugin": [
                {
                    "incId": "1",
                    "createTime": 1511938219000,
                    "pluginName": null,
                    "description": null,
                    "updateTime": 1511938219000,
                    "id": 3,
                    "type": "AdPlugin",
                    "baseDn": "OU=研发部,DC=quarkdata,DC=com",
                    "url": "ldap://192.168.201.4:389"
                },
                {
                    "incId": "1",
                    "createTime": 1511938219000,
                    "pluginName": null,
                    "description": null,
                    "updateTime": 1511938219000,
                    "id": 4,
                    "type": "LdapPlugin",
                    "baseDn": "dc=quarkdata,dc=com",
                    "url": "ldap://192.168.201.8:389"
                }
            ],
            "createTime": 1511413803000,
            "name": "test-connector",
            "description": "connector部署测试,勿动",
            "id": "2",
            "state": "0",
            "publicKey": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCaIK2
        }
   */
  getDetails(data: {
    id: string | number, // 用户Id
  }) {
    return this.http.post(this.dataService.url.setting.getDetails, data);
  }
}
