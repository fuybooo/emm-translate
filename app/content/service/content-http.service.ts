import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
import {RequestOptions} from "@angular/http";
@Injectable()
export class ContentFilesHttpService {
  constructor(private http: HttpClient, private dataService: DataService) {}
  /************************************************************ 文档管理 **********************************************/
  /**
   * 上传文档  file
   */
  uploadContent(data: any) {
    return this.http.post(this.dataService.url.content.uploadContent, data, {
      headers: new HttpHeaders().append('Content-Type', 'multipart/form-data;'),
    });
  }
  /**
   * 新增文档
   * @param data
       contentType:文档类型[file|folder]
       parentId:上级目录，不传默认为根目录
       folderName:文件夹名
       contentNames:""文档名，逗号分割?
       localNames:""上传文件后返回的文档名，逗号分割?
       userIds:分发用户
       userGroupIds:分发用户组
       depIds:分发部门
       isEncrypt:是否加密[true|false]，默认不加密
       isPermission:是否允许下载[true|false]，默认不允许
   * @returns {Observable<T>}
        {
          code:200,
          msg:"success",
          data:{}
         }
   */
  addContent(data: {
    contentType: string, // [file|folder]
    parentId?: string | number, // 上级目录，不传默认为根目录
    folderName?: string, // 文件夹名
    contentNames?: string, // 文档名，逗号分割?
    localNames?: string, // 上传文件后返回的文档名，逗号分割?
    userIds?: string | number, // 分发用户
    userGroupIds?: string | number, // 分发用户组,
    depIds?: string | number, // 分发部门
    isEncrypt?: boolean, // 是否加密[true|false], 默认不加密
    isPermission?: boolean, // 是否允许下载[true|false]，默认不允许
  }) {
    return this.http.post(this.dataService.url.content.addContent, data);
  }

  /**
   * 编辑文档
   * @param data
       contentId:文档id,
       fileName:新文件名
   * @returns {Observable<T>}
     {
        code:200,
        msg:"success",
        data:{}
      }
   */
  editContent(data: {
    contentId: string | number, // 文档id,
    fileName: string, // 新文件名
  }) {
    return this.http.post(this.dataService.url.content.editContent, data);
  }

  /**
   * 获取文档列表
   * @param data
       parentId:''当前目录,不传返回全部（文件夹使用）
       category:[all|picture|music|video|other|folder]，类型，默认为all
       tagId:标签id
       search:搜索关键字
       pageSize:15
       pageNumber:1
       sortName:''
       sortOrder:'asc|desc',
       isdelete:[true|false]，是否查询已删除文件，不传默认是false
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  getContentList(data: {
    parentId?: string | number, // 当前目录,不传返回全部（文件夹使用）
    category?: string, // [all|picture|music|video|other|folder]，类型，默认为all
    tagId?: string | number, // 标签id
    search?: string, // 搜索关键字
    pageSize: string | number,  // 50
    page: string | number, //
    sortName?: string, //
    sortOrder?: string, // 'asc|desc',
    isDelete?: boolean, // [true|false]，是否查询已删除文件，不传默认是false
    [propName: string]: any
  }) {
    let _data = {...data, isdelete: data.isDelete ? data.isDelete : null, pageNumber: data.page};
    return this.http.get(this.dataService.url.content.getContentList, this.dataService.getWholeParams(_data));
  }

  /**
   * 删除文档
   * @param data
       contentIds:文档id
       ishard:是否彻底删除[true|false]，不传默认为false
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  deleteContent(data: {
    contentIds: string | number, // 文档id
    isHard?: boolean // 是否彻底删除[true|false]，不传默认为false
  }) {
    return this.http.post(this.dataService.url.content.deleteContent, {...data, ishard: data.isHard});
  }

  /**
   * 判断文档是否重复
   * @param data
       contentId:文档id,
       fileName:新文档名
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  isContentExist(data: {
    contentId: string | number, // 文档id,
    fileName: string, // 新文档名
  }) {
    return this.http.post(this.dataService.url.content.isContentExist, data);
  }
  /************************************************************ 文档分发管理 ********************************************/
  /**
   * 获取分发记录
   * @param data
       contentId:文件id
       pageSize:15
       pageNumber:1
   * @returns {Observable<T>}
       {
         code:200,
         msg:"success",
         data:{}
        }
   */
  getContentDistList(data: {
    contentId: string | number, // 文档id,
    pageSize: string | number,
    page: string | number,
  }) {
    let data_ = {...data, pageNumber: data.page};
    return this.http.get(this.dataService.url.content.getContentDistList, this.dataService.getWholeParams(data_));
  }

  /**
   * 获取可见范围
   * @param data
        contentIds:文件ids
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  getAccessConfOfContent(data: {
    contentIds: string | number, // 文档id,
  }) {
    return this.http.get(this.dataService.url.content.getAccessConfOfContent, this.dataService.getWholeParams(data));
  }

  /**
   * 保存可见范围
   * @param data
       contentIds:文件ids
       userIds:可见用户ids
       userGroupIds:可见用户组ids
       deptIds:可见部门ids
       permission:下载权限
   * @returns {Observable<T>}
       {
         code:200,
         msg:"success",
         data:{}
        }
   */
  saveAccessConfOfContent(data: {
    contentIds: string | number, // 文档id,
    userIds: string | number, // 可见用户ids
    userGroupIds: string | number, // 可见用户组ids
    deptIds: string | number, // 可见部门ids
    permission: string | number, // 下载权限
  }) {
    return this.http.post(this.dataService.url.content.saveAccessConfOfContent, data);
  }

  /**
   * 获取下载权限
   * @param data
        contentId:文件id
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  getDownloadConfOfContent(data: {
    contentId: string | number, // 文档id,
  }) {
    return this.http.get(this.dataService.url.content.getDownloadConfOfContent, this.dataService.getWholeParams(data));
  }

  /**
   * 保存下载权限
   * @param data
         contentIds:文件ids
         userIds:下载用户ids
         userGroupIds:下载用户组ids
         deptIds:下载部门ids
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  saveDownloadConfOfContent(data: {
    contentIds: string | number, // 文档id,
    data: any,
  }) {
    return this.http.post(this.dataService.url.content.saveDownloadConfOfContent, data);
  }

  /**
   * 远程删除
   * @param data
       contentIds:文件ids
       userIds:删除用户ids
       userGroupIds:删除用户组ids
       deptIds:删除部门ids
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  remoteDeleteContent(data: {
    contentIds: string | number, // 文档id,
    userIds: string | number, // 删除用户ids
    userGroupIds: string | number, // 删除用户组ids
    deptIds: string | number, // 删除部门ids
  }) {
    return this.http.post(this.dataService.url.content.remoteDeleteContent, data);
  }

  /********************************** 文档扩展 *************************************************************/
  /**
   * 移动文件
   * @param data
       contentId:文件id
       targetPath:目标文件夹id
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  moveContent(data: {
    contentIds: string | number, // 文档id,
    targetPath: string | number, // 目标文件夹id
  }) {
    return this.http.post(this.dataService.url.content.moveContent, data);
  }

  /**
   * 复制文件
   * @param data
         contentId:文件id
         targetPath:目标文件夹id
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  copyContent(data: {
    contentIds: string | number, // 文档id,
    targetPath: string | number, // 目标文件夹id
  }) {
    return this.http.post(this.dataService.url.content.copyContent, data);
  }

  /**
   * 添加收藏
   * @param data
      contentId:文件id
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  addCollect(data: {
    contentId: string | number, // 文件id,
  }) {
    return this.http.post(this.dataService.url.content.addCollect, data);
  }

  /**
   * 取消收藏
   * @param data
       contentId:文件id
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  removeCollect(data: {
    contentId: string | number, // 文档id,
  }) {
    return this.http.post(this.dataService.url.content.removeCollect, data);
  }

  /**
   * 添加标签
   * @param data
       contentId:文档id
       tagIds:标签id
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  attachTag(data: {
    contentId: string | number, // 文档id,
    tagIds: string | number, // 标签id
  }) {
    return this.http.post(this.dataService.url.content.attachTag, data);
  }

  /**
   * 获取文档书签
   * @param data
   contentId:文档id
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  getContentTags(data: {
    contentId: string | number, // 文档id,
  }) {
    return this.http.get(this.dataService.url.content.getContentTags, this.dataService.getWholeParams(data));
  }

  /**
   * 移除标签
   * @param data
       contentId:文档id
       tagId:标签id
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  removeTag(data: {
    contentId: string | number, // 文档id,
    tagId: string | number, // 标签id
  }) {
    return this.http.post(this.dataService.url.content.removeTag, data);
  }

  /**
   * 还原文档
   * @param data
      contentId:文件id
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  restoreContent(data: {
    contentId: string | number, // 文档id,
  }) {
    return this.http.post(this.dataService.url.content.restoreContent, {...data, contentIds: data.contentId});
  }
  /********************************** 标签管理 ***********************************************/
  /**
   * 新增标签
   * @param data
        tagNames:标签名 多个 ‘,’
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  addTag(data: {
    tagNames: string, // 标签名
  }) {
    return this.http.post(this.dataService.url.content.addTag, data);
  }

  /**
   * 获取标签
   * @param data
         search:搜索关键字
         pageSize:9
         pageNumber:1
         sortName:''
         sortOrder:'asc|desc'
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  getTagList(data: {
    search: string, // 搜索关键字
    pageSize: string | number,
    page: string | number,
    sortName?: string,
    sortOrder?: string, // 'asc|desc'
  }) {
    let _data = {...data, pageNumber: data.page};
    return this.http.get(this.dataService.url.content.getTagList, this.dataService.getWholeParams(data));
  }

  /**
   * 删除标签
   * @param data
        tagId:标签id
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  deleteTag(data: {
    tagId: string | number, // 标签id
  }) {
    return this.http.post(this.dataService.url.content.deleteTag, data);
  }
  /**
   * 判断标签是否重复
   * @param data
        tagName:标签名
   * @returns {Observable<T>}
   {
     code:200,
     msg:"success",
     data:{}
    }
   */
  isTagExist(data: {
    tagName: string,
  }) {
    return this.http.get(this.dataService.url.content.isTagExist, this.dataService.getWholeParams(data));
  }
}
