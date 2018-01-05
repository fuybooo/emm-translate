import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
@Injectable()
export class PushHttpService {
  constructor(private http: HttpClient, private dataService: DataService) {}
  /**
   * 获取推送列表
   * @param data
       pushStatue  //推送状态 已推送|待推送
       searchPush  //查询内容
       pageSize//单页容量
       pageNumber//当前页数
       注：pushStatus值有三种情况：all:全部 ，pushed：已经推送，nopush：未推送
   * @returns {Observable<Object>}
   */
  getPushList(data: {
    pushStatue: string,  // 推送状态 all:全部 ，pushed：已经推送，nopush：未推送
    searchPush: string,  // 查询内容
    pageSize: string | number, // 单页容量
    page: string | number, // 当前页数
  }) {
    let _data = {...data, pageNumber: data.page};
    return this.http.get(this.dataService.url.push.getPushList, this.dataService.getWholeParams(_data));
  }

  /**
   * 查看推送详情
   * @param data
   *  pushId: number | string, // 推送id
   * @returns {Observable<Object>}
   */
  getPushDetail(data: {
    pushId: number | string, // 推送id
  }) {
    return this.http.get(this.dataService.url.push.getPushDetail, this.dataService.getWholeParams(data));
  }


  /**
   * 查看推送详情
   * @param data
   *   pushid:推送id,新建为空
       title//表题
       content//推送内容
       sendType  //立即推送|定时推送
       userIds//用户ids
       deptIds//部门ids
       userGroupIds//分组ids
       sendDate  //推送时间
       draft// 0不是草稿，1是草稿
       platformType  //平台
       messageType//消息类型 0：普通消息，1：需要目标进行回复的消息
       注：iOS//苹果
       Android//安卓
       iOS,Android//两个都勾选
   * @returns {Observable<Object>}
   */
  savePush(data: {
    pushId: number | string, // 推送id,新建为空
    title: string, // 表题
    content: string, // 推送内容
    sendType: string, // 立即推送|定时推送
    userIds: string, // 用户ids
    deptIds: string, // 部门ids
    userGroupIds: string, // 分组ids
    sendDate: string, // 推送时间
    draft: boolean, //  0不是草稿，1是草稿
    platform: string, // 平台 : [iOS(苹果) | Android(安卓) | iOS,Android(两个都勾选)]
    messageType: string, // 消息类型 0：普通消息，1：需要目标进行回复的消息
  }) {
    if (data.sendType === '0') {
      data.sendType = '1';
    } else if (data.sendType === '1') {
      data.sendType = '2';
    }
    return this.http.post(this.dataService.url.push.savePush, data);
  }

  /**
   * 获取推送信息统计
   * @returns {Observable<Object>}
   */
  getPushStatistics() {
    return this.http.get(this.dataService.url.push.getPushStatistics);
  }

  /**
   * 删除推送
   * @param data pushId //推送id
   * @returns {Observable<Object>}
   */
  deletePush(data: {
    pushId: number | string, // 推送id
  }) {
    return this.http.post(this.dataService.url.push.deletePush, data);
  }

  /**
   * 删除全部推送
   * @param data
   */
  deleteAllPush(data: {
    msgType: string // [nopush|draft]
  }) {
    return this.http.post(this.dataService.url.push.deleteAllPush, data);
  }
}
