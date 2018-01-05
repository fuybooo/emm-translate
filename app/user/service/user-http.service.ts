import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
@Injectable()
export class UserHttpService {
  constructor(private http: HttpClient, private dataService: DataService) {}

  /******************************************** Object: User *****************************************************/
  /**
   * 获取用户详情
   * @param data
        userId 用户id
   * @returns {Observable<Object>}
   * 返回值：
    {
       "code": "200",
       "msg": "",
       "data": {
           "groupNameList": [],
           "userStatus": 1,
           "address": "北京市海淀区泰翔商务楼",
           "devices": [
               {
                   "device_name": "",
                   "device_id": 1
               },
               {
                   "device_name": null,
                   "device_id": 4
               },
               {
                   "device_name": null,
                   "device_id": 5
               }
           ],
           "mobile": "13126666777/13120000777",
           "telephone": "010-8888168",
           "userName": "xxx@thundersoft.com",
           "userId": 49,
           "deptPathNameList": [
               "EMM项目组/java研发/研发部"
           ],
           "adminName": "admin",
           "createdAt": 1510050533000,
           "post": "java",
           "grade": "javaH",
           "displayName": "xxx",
           "fax": "+86 8888168",
           "email": "xxx@thundersoft.com"
       }
   }
   */
  getUserById(data: {
    userId: string | number // 用户id
  }) {
    return this.http.get(this.dataService.url.user.getUserById, this.dataService.getWholeParams(data));
  }

  /**
   * 删除用户/批量删除用户 url：/user/deleteUser
   * @param data
   *  userIds   // 用户ids，逗号分隔
   * @returns {Observable<Object>}
       {
          "code": "200",
          "msg": "删除用户成功！"
      }
   */
  deleteUser(data: {
    userIds: number | string, // 用户ids，逗号分隔
  }) {
    return this.http.post(this.dataService.url.user.deleteUser, data);
  }

  /**
   * 根据输入内容搜索用户(只获取10条记录)
   * 接口说明：
       url：/getUserBySearch
       method：get/post
   * @param data
   *   name   //   可以输入用户名，也可以输入真实姓名，模糊匹配

   * @returns {Observable<Object>}
   * {
          "code": "200",
          "msg": "",
          "data": {
              "result": [
                  {
                      "disPlayName": "李大嘴(lidz)",
                      "userName": "lidz",
                      "userId": 3,
                      "source": 1,(1：自创建；2：AD导入)
                  },
                  {
                      "disPlayName": "李大嘴111(lidzqweqwe)",
                      "userName": "lidzqweqwe",
                      "userId": 4,
                      "source": 1,(1：自创建；2：AD导入)
                  }
              ]
          }
      }

   */
  getUserBySearch(data: {
    name: string, // 可以输入用户名，也可以输入真实姓名，模糊匹配
  }) {
    return this.http.post(this.dataService.url.user.getUserBySearch, data);
  }

  /**
   * 获取用户列表
   * page   页码
     pageSize     页面大小
     group_id     用户组id
     state     用户状态。NotActive：未激活；Activation：已激活；Locking：被锁定；Disable：被停用
     dept_id     部门id
     search     查询字符串
   * @returns {Observable<Object>}
   * state:[用户状态]0：未激活;1：已激活;5：管理员锁定; 6:密码输入错误导致的锁定; 7：停用
     source: 来源。1：自创建；2：AD导入；3：LDAP；5：批量导入
     {
         "code": "200",
         "msg": "",
         "data": {
             "result": [
                 {
                     "name": "xiaohb0802@thundersoft.com",
                     "id": 49,
                     "source": 1,
                     "state": 1
                 }
             ],
             "total": 32,
             "pageSize": 50,
             "page": 1
         }
     }
   */
  getUserList(data: {
    page: string | number,   // 页码
    pageSize: string | number,   // 页面大小
    group_id?: string | number,   // 用户组id
    state?: string,   // 用户状态。NotActive：未激活；Activation：已激活；Locking：被锁定；Disable：被停用
    dept_id?: string | number,   // 部门id
    search?: string,   // 查询字符串
  }) {
    return this.http.get(this.dataService.url.user.getUserList, this.dataService.getWholeParams(data));
  }

  /**
   * 更新用户信息   接口说明：更新用户信息，用户昵称以及用户拓展信息
   * @param data
   *   user_id       用户id
       display_name       用户昵称
       extend       用户拓展信息
    {
      "code": "200",
      "msg": "更新成功！"
    }
   */
  updateUser(data: {
    user_id: number | string, //    用户id
    display_name: number | string, //  用户昵称
    extend: number | string, // 用户拓展信息
  }) {
    return this.http.post(this.dataService.url.user.updateUser, data);
  }

  /**
   * 更新用户状态
   * 参数名称   参数说明
   * user_ids     用户id，逗号分隔
     dept_ids     部门id，逗号分隔；全部 -1，其他 -2，所有停用 -3
     group_ids     用户组id，逗号分隔；用户组：全部 -1，其他 -2
     state     变更到的状态。激活'active'，锁定 'locking'，停用 ‘blockUp’，未激活 'reload'

     返回值：
     {
         "code": "200",
         "msg": "更新成功！"
     }
     错误码
     错误码说明
     USER100002
     用户状态变更失败，请注意变更规则！

   */
  updateUserStatus(data: {
    user_ids: number | string, //     用户id，逗号分隔
    dept_ids: number | string, //      部门id，逗号分隔；全部 -1，其他 -2，所有停用 -3
    group_ids: number | string, //      用户组id，逗号分隔；用户组：全部 -1，其他 -2
    state: number | string, //      变更到的状态。激活'active'，锁定 'locking'，停用 ‘blockUp’，未激活 'reload'
  }) {
    return this.http.post(this.dataService.url.user.updateUserStatus, data);
  }

  /**
   * 创建用户
   * @param data
   * group_ids   加入的用户组，逗号分隔
     dept_id     隶属部门，不传怎不构建用户与部门的关系
     username     用户名
     display_name     用户昵称
     email     用户邮箱
     extend     用户拓展属性； {"key1":"value1","key2":"value2"}
     send     是否发送激活邮件；1：发送；  0：不发送
   * @returns {Observable<T>}
   */
  createUser(data: {
    group_ids: number | string, //   加入的用户组，逗号分隔
    dept_id: number | string, //       隶属部门，不传怎不构建用户与部门的关系
    username: number | string, //   用户名
    display_name: number | string, //   用户昵称
    email: number | string, //  用户邮箱
    extend: number, //  用户拓展属性； {"key1":"value1","key2":"value2"}
    send: number | string, //  是否发送激活邮件；1：发送；  0：不发送
  }) {
    return this.http.post(this.dataService.url.user.createUser, data);
  }

  /**
   * 检查用户名是否存在
   * @param data
   * username   用户名
   * @returns {Observable<T>}
   * {
          "code": "200",
          "msg": "帐户不存在!"
      }
     USER100003   用户已存在
   */
  isUserExist(data: {
    username: string | number, //   用户名
  }) {
    return this.http.post(this.dataService.url.user.isUserExist, data);
  }

  /******************************************** Object: UserGroup ************************************************/

  /**
   * 移动用户组
   * 接口说明：默认不解除旧关系keep=true；
     groupIds+toGroupIds：批量移动用户组到多个用户组，不解除旧关系，创建新关系；
     groupIds+fromGroupId+keep=false：从用户组中批量移出用户组，解除旧关系，不创建新关系；
     groupIds+toGroupIds+ fromGroupId+keep=false：从用户组（单数）中批量移动用户组（复数）到指定用户组（复数），解除旧关系，创建新关系；
     -------------- 分割线 -----------
     userIds+toGroupIds：批量移动用户到多个用户组，不解除旧关系，创建新关系；
     userIds+ fromGroupId+keep=false：从用户组中批量移出用户，解除旧关系，不创建新关系；
     userIds+toGroupIds+ fromGroupId+keep=false：从用户组（单数）中批量移动用户（复数）到指定用户组（复数），解除旧关系，创建新关系；
     -------------- 分割线 -----------
     userIds+groupIds+toGroupIds：批量移动用户与用户组到多个用户组，不解除旧关系，创建新关系；
     userIds+groupIds+fromGroupId+keep=false：从用户组中批量移出用户与用户组，解除旧关系，不创建新关系；
     userIds+groupIds+toGroupIds+ fromGroupId+keep=false：从用户组（单数）中批量移动用户与用户组（复数）到指定用户组（复数），解除旧关系，创建新关系；

     url:group/move
     method:post
   * @returns {Observable<Object>}
   * {
        "code": "200",
        "msg": "移动成功！"
     }
      GROUP300003   参数组合错误
   *
   */
  groupMove(data: {
    groupIds?: string | number, //     要移动的用户组ids，逗号分隔
    toGroupIds?: string | number, //     移动到的用户组ids，逗号分隔
    keep?: string | number, //   默认true；解除关系为false
    fromGroupId?: string | number, //       要移动的用户或用户组的来源
    userIds?: string | number, //    否要移动的用户ids，逗号分隔
  }) {
    return this.http.post(this.dataService.url.user.groupMove, data);
  }

  /**
   * 查看用户组名称是否存在
   * @param data
   * @returns {Observable<Object>}
   * 返回值：
   {
       "code": "200",
       "data": {
           "isExist": false/true
       }
   }
   */
  checkGroupName(data: {
    group_id: string | number, //    是groupName的父级groupId
    group_name: string | number, //  是groupName
  }) {
    return this.http.post(this.dataService.url.user.checkGroupName, data);
  }

  /**
   * 获取用户组列表
   * @param data
   * @returns {Observable<Object>}
   * 返回值：
   {
       "code": "200",
       "msg": "",
       "data": {
           "result": [
               {
                   "is_last": false,
                   "user_count": 0,
                   "name": "bbbbbbbbbbbbbb",
                   "id": 131,
                   "source": 1,
                   "desc": "bbbbbbbbbbbbb"
               }
           ],
           "all": 32,
           "total": 6,
           "pageSize": 11,
           "page": 1,
           "none": 31
       }
   }
   */
  getUserGroupList(data: {
    search?: string, //   查询关键字
    page: string | number, //  页码
    pageSize: string | number, //  页面大小
    group_ids?: string, //  用户组id，逗号分隔
    parent_id?: string, //  父级用户组id
    dept_ids?: string, //  部门id，逗号分隔
  }) {
    return this.http.post(this.dataService.url.user, data);
  }

  /**
   * 根据用户组id获取用户组详情
   * @param data
   * @returns {Observable<T>}
   * {
        "code": "200",
        "msg": "",
        "data": {
            "name": "hhhhhhhhhhhhh",
            "created_at": 1510026496000,
            "id": 123,
            "source": 1, // 来源。1：自创建；2：AD导入；3：LDAP；5：批量导入
            "created_by": "admin",
            "desc": "jjjjjjjjjjjjjjjjjjhhhhhhhhhhhhhhhhh"
        }
     }
   */
  getUserGroupById(data: {
    group_id: number | string, // 必须有
  }) {
    return this.http.post(this.dataService.url.user.getUserGroupById, data);
  }

  /**
   * 更新用户组
   * @param data
   * @returns {Observable<Object>}
   * 返回值：
     {
         "code": "200",
         "msg": "用户组更新成功"
     }
     GROUP300002   用户组名称已存在
     500   服务器内部错误
   */
  editUserGroup(data: {
    group_id: string | number, // 用户组id
    name: string | number, //  用户组名称
    desc?: string, // 用户组描述
  }) {
    return this.http.post(this.dataService.url.user.editUserGroup, data);
  }

  /**
   * 删除用户组
   * @param data
   * group_id   * 用户组id
   * @returns {Observable<T>}
   * 返回值：
     {
         "code": "200",
         "msg": "delete group success!"
     }
   */
  deleteUserGroup(data: {
    group_id: string | number, // 用户组id
  }) {
    return this.http.post(this.dataService.url.user.deleteUserGroup, data);
  }

  /**
   * 创建用户组
   * @param data
   * @returns {Observable<Object>}
   * 返回值：
     {
         "code": "200",
         "msg": "创建用户组成功！"
     }
   */
  createGroup(data: {
    name: string, //    用户组名称
    desc?: string, //    用户组描述
  }) {
    return this.http.post(this.dataService.url.user.createGroup, data);
  }

  /**
   * 根据用户组获取用户
   * @param data
   * group_id   是   用户组id；当group_id小于0时，返回不在用户组中的用户
     page   是   页码
     pageSize   是   页面大小
   * @returns {Observable<Object>}
   * 返回值：
     {
         "code": "200",
         "msg": "",
         "result": [
             {
                 "id": 56,
                 "source": 1, //来源。1：自创建；2：AD导入；3：LDAP；5：批量导入
                 "username": "ahah"
             }
         ]
     }
   */
  getUserByGroupId(data: {
    group_id: number| string, // 用户组id；当group_id小于0时，返回不在用户组中的用户
    page: number| string, // 页码
    pageSize: number| string, // 页面大小
  }) {
    return this.http.post(this.dataService.url.user.getUserByGroupId, data);
  }

  /****************************************** Object: Dept *************************************************/

  /**
   * 移动部门
   * 接口说明：
   *  批量移动部门到指定部门，toDeptId=0从部门中批量移出部门，
   *  批量移动用户到指定部门，toDeptId=0从部门中批量移出用户。
   *  deptIds与userIds不可同时存在。
   * @param data
   * @returns {Observable<Object>}
   */
  deptMove(data: {
    toDeptId: number | string, // 移动到部门id；等于0时为移出部门
    deptIds?: number | string, //  被移动的部门id，逗号分隔
    userIds?: number | string, // 被移动的用户id，逗号分隔
  }) {
    return this.http.post(this.dataService.url.user.deptMove, data);
  }
}
