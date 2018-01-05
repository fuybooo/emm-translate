import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
@Injectable()
export class ApplicationHttpService {
  constructor(private http: HttpClient, private dataService: DataService) {}

  /***************************************   应用管理  *******************************************************/
  /**
   * 应用上传
   * @param data
       platform:[1|2]//平台，必传
       file//文件
   * @returns {Observable<Object>}
   * {
        code:200,
        msg:"success"
      }
   */
  uploadApp(data: {
    platform: string, // [1|2]//平台，必传
    file: string, // 文件
  }) {
    // return this.http.post(this.dataService.url.application.uploadApp, data);
  }

  /**
   * 上传截图
   * @param data
   *  pushId: number | string, // 推送id
   * @returns {Observable<Object>}
   * {
        code:200,
        msg:"success"
      }
   */
  uploadFile(data: {
    pushId: number | string, // 推送id
  }) {
    // return this.http.post(this.dataService.url.application.uploadFile, data);
  }

  /**
   * 新增应用
   * @param data
   *   platform:[1|2]//平台
       description:描述
       classIds:应用分类id
       supportSysVersion:支持系统版本号
       imgScreenURLs:截图地址
       publishMode:[1|2]//正常发布|灰度发布
       userIds://
       userGroupIds://
       deptIds://
       duration://发布时效
       localName://应用本地名
   * @returns {Observable<Object>}
   * {
        code:200,
        msg:"success",
        data:{}
      }
   */
  addApp(data: {
    platform: string, // [1|2]//平台
    description: string, // 描述
    classIds: string, // 应用分类id
    supportSysVersion: string, // 支持系统版本号
    imgScreenURLs: string, // 截图地址
    publishMode: string, // [1|2]//正常发布|灰度发布
    // userIds: string, //  date: 2017-12-2
    deviceGroupIds: string, //
    userGroupIds: string, //
    deptIds: string, //
    duration: string, // 发布时效
    localName: string, // 应用本地名
  }) {
    return this.http.post(this.dataService.url.application.addApp, data);
  }

  /**
   * 修改应用
   * @param data
     * platform:[1|2]//平台
       appId://应用id
       description:描述
       classId:应用分类id
       supportSysVersion:支持系统版本号
       imgScreenURLs:截图地址
       publishMode:[1|2]//正常发布|灰度发布
       userIds://
       userGroupIds://
       deptIds://
       duration://发布时效
   * @returns {Observable<Object>}
   * {
        code:200,
        msg:"success",
        data:{}
      }
   */
  editApp(data: {
    platform: string | number, // [1|2]//平台
    appId: string | number, // 应用id
    description: string | number, // 描述
    classId: string | number, // 应用分类id
    supportSysVersion: string | number, // 支持系统版本号
    imgScreenURLs: string | number, // 截图地址
    publishMode: string | number, // [1|2]//正常发布|灰度发布
    userIds: string | number, //
    userGroupIds: string | number, // //
    deptIds: string | number, // //
    duration: string | number, // //发布时效
  }) {
    return this.http.post(this.dataService.url.application.editApp, data);
  }

  /**
   * 查询应用列表
   * @param data
   * platform:[1|2]//平台
     search://搜索关键字
     classId:分类id，不传默认全部
     publishMode:[1|2]//正常发布|灰度发布
     isOnline:[true|false]是否上线，不传默认全部状态
     pageSize:分页大小
     pageNumber:当前页
     sortName:排序列
     sortOrder:升降序
   * @returns {Observable<Object>}
   */
  getAppList(data: {
    platform: string | number, // [1|2]//平台
    search: string, // //搜索关键字
    classId: string | number, // 分类id，不传默认全部
    publishMode: string | number, // [1|2]//正常发布|灰度发布
    isOnline: string | boolean, // [true|false]是否上线，不传默认全部状态
    pageSize: string | number, // 分页大小
    page: string | number, // 当前页
    sortName: string, // 排序列  排序列(注：位置调整时传serialsNum)
    sortOrder: string, // 升降序
  }) {
    let _data = {...data, pageNumber: data.page};
    return this.http.get(this.dataService.url.application.getAppList, this.dataService.getWholeParams(_data));
  }

  /**
   * 获取应用详情
   * @param data
   *    platform:[1|2]//平台
        appId://应用id
   * @returns {Observable<Object>}
   * {
        code:200,
        msg:"success",
        data:{}
      }
   */
  getAppDetail(data: {
    platform: string | number, // [1|2]//平台
    appId: string | number, // 应用id
  }) {
    return this.http.get(this.dataService.url.application.getAppDetail, this.dataService.getWholeParams(data));
  }

  /**
   * 删除应用
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
  deleteApp(data: {
    platform: string | number, // [ios|android]//平台
    appId: string | number, // 应用id
  }) {
    return this.http.post(this.dataService.url.application.deleteApp, data);
  }

  /***************************************   应用扩展  *******************************************************/
  /**
   * 应用上架
   * @param data
   * platform:[1|2]//平台
     appId:应用id
     isOnline:[true|false]:上架/下架
   * @returns {Observable<Object>}
   */
  setAppOnline(data: {
    platform: string | number, // [1|2]//平台
    appId: string | number, // 应用id
    isOnline: string | boolean, // [true|false]:上架/下架
  }) {
    return this.http.post(this.dataService.url.application.setAppOnline, data);
  }

  /**
   * 获取应用历史版本
   * @param data
     * platform:[1|2]//平台
       appId:应用id
       pageSize:分页大学
   pageNumber:当前页
   * @returns {Observable<Object>}
   */
  getAppOldVersionList(data: {
    platform: string | number, // [1|2]//平台
    appId: string | number, // 应用id
    pageSize: string | number, // 分页大学
    page: string | number, // 当前页
  }) {
    return this.http.get(this.dataService.url.application.getAppOldVersionList,
      this.dataService.getWholeParams({...data, pageNumber: data.page}));
  }

  /**
   * 灰度发布转正常发布
   * @param data
     * platform:[1|2]//平台
       appId:应用id
       publishMode:[1|2]//正常发布|灰度发布
   * @returns {Observable<Object>}
   */
  publishApp(data: {
    platform: string | number, // [1|2]//平台
    appId: string | number, // 应用id
    publishMode: string | number, // [1|2]//正常发布|灰度发布
  }) {
    return this.http.post(this.dataService.url.application.publishApp, data);
  }

  /**
   * 调整应用位置 交换
   * @param data
   *  platform:[1|2]//平台
      appIds:"1,2"//应用ids
   * @returns {Observable<Object>}
   */
  switchAppPosition(data: {
    platform: string | number, // [1|2]//平台
    appIds: string | number, // 应用id
  }) {
    return this.http.post(this.dataService.url.application.switchAppPosition, data);
  }

  /***************************************   应用分类  *******************************************************/

  /**
   * 新增分类
   * @param data
   *  className://分类名
   * @returns {Observable<Object>}
   */
  addAppClass(data: {
    className: string | number, // 分类名
  }) {
    return this.http.post(this.dataService.url.application.addAppClass, data);
  }

  editAppClass(data: {
    classId: string | number, // 分类id
    className: string | number, // 分类名
  }) {
    return this.http.post(this.dataService.url.application.editAppClass, data);
  }

  /**
   * 查询分类列表
   * @param data
     * search://搜索关键字
       pageSize:分页大小
       pageNumber:当前页
   * @returns {Observable<Object>}
   */
  getAppClassList(data: {
    search: string, // 搜索关键字
    pageSize: string | number, // 分页大小
    page: string | number, // 当前页
  }) {
    let _data = {...data, pageNumber: data.page};
    return this.http.get(this.dataService.url.application.getAppClassList, this.dataService.getWholeParams(_data));
  }

  /**
   * 删除分类
   * @param data
   *  classId://分类id
   * @returns {Observable<Object>}
   */
  deleteAppClass(data: {
    classId: string | number, // 分类id
  }) {
    return this.http.post(this.dataService.url.application.deleteAppClass, data);
  }

  /**
   * 分类是否存在
   * @param data
   *  className://分类名
   * @returns {Observable<Object>}
   */
  isAppClassExist(data: {
    className: string, // 分类名
  }) {
    return this.http.post(this.dataService.url.application.isAppClassExist, data);
  }

  /***************************************  可见范围  *******************************************************/
  /**
   * 获取应用可见范围
   * @param data
   *  platform:[1|2]//平台
      appId://应用id
   * @returns {Observable<Object>}
   */
  getAccessConfOfApp(data: {
    platform: string | number, // [1|2]//平台
    appId: string | number, // 应用id
  }) {
    return this.http.get(this.dataService.url.application.getAccessConfOfApp, this.dataService.getWholeParams(data));
  }

  /**
   * 保存应用可见范围
   * @param data
   * @returns {Observable<Object>}
   */
  setAccessConfOfApp(data: {
    platform: string | number, // [1|2]//平台
    appId: string | number, // 应用id
    userIds: string | number, //
    userGroupIds: string | number, //
    deptIds: string | number, //
    duration: string | number, // 发布时效
  }) {
    return this.http.post(this.dataService.url.application.setAccessConfOfApp, data);
  }
}
