import {Component, OnInit, ViewChild} from "@angular/core";
import {PushService} from "./service/push.service";
import {PushHttpService} from "./service/push-http.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PushFormService} from "./service/push-form.service";
import {ModalService} from "../shared/service/modal.service";
import {MessageService} from "../shared/service/message.service";
import {blankImgSrc} from "../shared/shared.model";
@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  providers: [
    PushFormService,
    PushService,
  ]
})
export class PushComponent implements OnInit {
  // 所有的推送记录
  allNumber = 0;
  // 已推送 list table
  alreadyPush = {
    show: true,
    nzActive: true,
    number: 0,
    service: new PushService(this.http),
    options: {
      callbacks: {
        onTotalScrollOffset: 80,
        onTotalScroll: () => {
          this.alreadyPush.service.nextPage();
        }
      }
    }
  };
  // 未推送 list table
  notPush = {
    show: true,
    nzActive: true,
    number: 0,
    service: new PushService(this.http),
    options: {
      callbacks: {
        onTotalScrollOffset: 80,
        onTotalScroll: () => {
          this.notPush.service.nextPage();
        }
      }
    }
  };
  // 草稿箱 list table
  drafts = {
    show: false,
    nzActive: true,
    number: 0,
    service: new PushService(this.http),
    options: {
      callbacks: {
        onTotalScrollOffset: 80,
        onTotalScroll: () => {
          this.drafts.service.nextPage();
        }
      }
    }
  };
  // 默认选择 所有推送 ['add'(所有推送) | 'already'(已推送) | 'not'(未推送) | 'drafts'(草稿箱)]
  activeType = 'all';
  // 显示推送详情 的标题（存在则显示详情）
  pushDetailTitle;
  blankImgSrc = blankImgSrc;

  constructor(private http: PushHttpService,
              public pushFormById: PushFormService,
              private messageService: MessageService,
              private activateRoute: ActivatedRoute,
              private modalService: ModalService,
              private router: Router) {
    // 推送详情
    this.pushFormById.labelSm = 4;
    this.pushFormById.readonly = true;
    this.pushFormById.items[1]['hide'] = true;
  }

  ngOnInit() {
    this.http.getPushStatistics().subscribe((res: any) => {
      if (res.data) {
        this.allNumber = res.data.all;
        this.alreadyPush.number = res.data.unpush;
        this.notPush.number = res.data.pushed;
        this.drafts.number = res.data.draft;
      }
    });
    this.alreadyPush.service.param.pushStatue = 'nopush';
    this.alreadyPush.service.initList({isActiveFist: false});
    this.notPush.service.param.pushStatue = 'pushed';
    this.notPush.service.initList({isActiveFist: false});
    this.drafts.service.param.pushStatue = 'draft';
    this.drafts.service.initList({isActiveFist: false});
    // 推送详情
    this.alreadyPush.service.itemActiveEvent.subscribe((item) => {
      if (item && item.id) {
        this.pushDetailTitle = item.title;
        this.http.getPushDetail({pushId: item.id}).subscribe((res: any) => {
          this.pushFormById.items[8]['hide'] = false;
          this.pushFormById.items[9]['hide'] = false;
          this.pushFormById.items[10]['hide'] = false;

          // 推送对象
          let users = [];
          let groups = [];
          let depts = [];
          res.data.pushDeployMaps.forEach((_item: any) => {
            if (_item.applyType === 5) {
              // 用户组
              if (_item.applyName) {
                groups.push({id: _item.applyValue, name: _item.applyName});
              }
            } else if (_item.applyType === 4) {
              // 用户
              if (_item.applyName) {
                users.push({id: _item.applyValue, name: _item.applyName});
              }
            } else if (_item.applyType === 1) {
              // 部门
              if (_item.applyName) {
                depts.push({id: _item.applyValue, name: _item.applyName});
              }
            }
          });
          this.pushFormById.items[5]['sendTypeShow'] = res.data.sendType;
          this.pushFormById.setData({
            ...res.data,
            obj: {users: users, groups: groups, depts: depts},
            pushId: item.id,
            platformType: res.data.platform.split(','),
            sendType: res.data.sendDate
          });
        });
        this.notPush.service.itemIsActive = {};
        this.drafts.service.itemIsActive = {};
      }
    });
    this.notPush.service.itemActiveEvent.subscribe((item) => {
      if (item && item.id) {
        this.pushDetailTitle = item.title;
        this.http.getPushDetail({pushId: item.id}).subscribe((res: any) => {
          this.pushFormById.items[8]['hide'] = false;
          this.pushFormById.items[9]['hide'] = false;
          this.pushFormById.items[10]['hide'] = false;

          // 推送对象
          let users = [];
          let groups = [];
          let depts = [];
          res.data.pushDeployMaps.forEach((_item: any) => {
            if (_item.applyType === 5) {
              // 用户组
              if (_item.applyName) {
                groups.push({id: _item.applyValue, name: _item.applyName});
              }
            } else if (_item.applyType === 4) {
              // 用户
              if (_item.applyName) {
                users.push({id: _item.applyValue, name: _item.applyName});
              }
            } else if (_item.applyType === 1) {
              // 部门
              if (_item.applyName) {
                depts.push({id: _item.applyValue, name: _item.applyName});
              }
            }
          });
          this.pushFormById.items[5]['sendTypeShow'] = res.data.sendType;
          this.pushFormById.setData({
            ...res.data,
            obj: {users: users, groups: groups, depts: depts},
            pushId: item.id,
            platformType: res.data.platform.split(','),
            sendType: res.data.sendDate
          });
        });
        this.alreadyPush.service.itemIsActive = {};
        this.drafts.service.itemIsActive = {};
      }
    });
    this.drafts.service.itemActiveEvent.subscribe((item) => {
      if (item && item.id) {
        this.pushDetailTitle = item.title;
        this.http.getPushDetail({pushId: item.id}).subscribe((res: any) => {
          this.pushFormById.items[8]['hide'] = false;
          this.pushFormById.items[9]['hide'] = false;
          this.pushFormById.items[10]['hide'] = false;

          // 推送对象
          let users = [];
          let groups = [];
          let depts = [];
          res.data.pushDeployMaps.forEach((_item: any) => {
            if (_item.applyType === 5) {
              // 用户组
              if (_item.applyName) {
                groups.push({id: _item.applyValue, name: _item.applyName});
              }
            } else if (_item.applyType === 4) {
              // 用户
              if (_item.applyName) {
                users.push({id: _item.applyValue, name: _item.applyName});
              }
            } else if (_item.applyType === 1) {
              // 部门
              if (_item.applyName) {
                depts.push({id: _item.applyValue, name: _item.applyName});
              }
            }
          });
          this.pushFormById.items[5]['sendTypeShow'] = res.data.sendType;
          this.pushFormById.setData({
            ...res.data,
            obj: {users: users, groups: groups, depts: depts},
            pushId: item.id,
            platformType: res.data.platform.split(','),
            sendType: res.data.sendDate
          });
        });
        this.alreadyPush.service.itemIsActive = {};
        this.notPush.service.itemIsActive = {};
      }
    });
  }
  editPush() {
    let id = this.pushFormById.getData().pushId;
    if (id) {
      this.router.navigate(['../new', id], {
        relativeTo: this.activateRoute
      });
    }
  }

  changeType(type) {
    this.activeType = type;
    this.alreadyPush.show = false;
    this.notPush.show = false;
    this.drafts.show = false;
    this.http.getPushStatistics().subscribe((res: any) => {
      if (res.data) {
        this.allNumber = res.data.all;
        this.alreadyPush.number = res.data.unpush;
        this.notPush.number = res.data.pushed;
        this.drafts.number = res.data.draft;
      }
    });
    switch (type) {
      case 'all': {
        // 所有推送显示前七条记录
        this.alreadyPush.show = true;
        this.notPush.show = true;
        this.alreadyPush.service.initList({isActiveFist: false});
        this.notPush.service.initList({isActiveFist: false});
        break;
      }
      case 'already': {
        this.alreadyPush.show = true;
        this.alreadyPush.service.initList({isActiveFist: false});
        break;
      }
      case 'not': {
        this.notPush.show = true;
        this.notPush.service.initList({isActiveFist: false});
        break;
      }
      case 'drafts': {
        this.drafts.show = true;
        this.drafts.service.initList({isActiveFist: false});
        break;
      }
    }
  }

  newPush() {
    this.router.navigate(['../new', 0], {
      relativeTo: this.activateRoute
    });
  }

  refreshStatus() {
  }

  searchChange(search) {
    if (!search) {
      this.doSearch('');
    }
  }

  doSearch(search) {
    this.alreadyPush.service.param.searchPush = search;
    this.notPush.service.param.searchPush = search;
    this.drafts.service.param.searchPush = search;
    this.alreadyPush.service.initList({isActiveFist: false});
    this.notPush.service.initList({isActiveFist: false});
    this.drafts.service.initList({isActiveFist: false});
  }

  /**
   * 删除待推送
   * @param item
   */
  deleteAlreadyPush(item, $event) {
    // 阻止点击事件向上冒泡 取消当前默认调用的函数可以调用e.preventDefault()
    $event.stopPropagation();
    if (item) {
      // 删除单个
      this.modalService.confirmDelete(() => {
        this.http.deletePush({pushId: item.id}).subscribe((res: any) => {
          if (res.code === '200') {
            this.alreadyPush.service.delete(item);
            this.http.getPushStatistics().subscribe((_res: any) => {
              if (_res.data) {
                this.allNumber = _res.data.all;
                this.alreadyPush.number = _res.data.unpush;
                this.notPush.number = _res.data.pushed;
                this.drafts.number = _res.data.draft;
              }
            });
            this.messageService.success('删除成功！');
          } else if (res.code === 'PUSH900006') {
            this.alreadyPush.service.delete(item);
            this.http.getPushStatistics().subscribe((_res: any) => {
              if (_res.data) {
                this.allNumber = _res.data.all;
                this.alreadyPush.number = _res.data.unpush;
                this.notPush.number = _res.data.pushed;
                this.drafts.number = _res.data.draft;
              }
            });
            this.messageService.error('此消息已下发，无法被删除');
          } else {
            this.messageService.error('删除失败');
          }
        });
      }, '确定要删除，<span class="text-primary">' + item.title + '</span>吗？');
    } else {
      // 全部删除
      this.modalService.confirmDelete(() => {
        this.http.deleteAllPush({msgType: 'nopush'}).subscribe((res: any) => {
          if (res.code === '200') {
            this.alreadyPush.service.initList({isActiveFist: false});
            this.http.getPushStatistics().subscribe((_res: any) => {
              if (_res.data) {
                this.allNumber = _res.data.all;
                this.alreadyPush.number = _res.data.unpush;
                this.notPush.number = _res.data.pushed;
                this.drafts.number = _res.data.draft;
              }
            });
            this.messageService.success('删除成功！');
          } else {
            this.messageService.error('删除失败');
          }
        });
      }, '确定要<span class="text-primary">删除所有待推送的消息</span>吗？');
    }
  }

  /**
   * 删除草稿
   * @param item
   */
  deleteDrafts(item, $event) {
    // 阻止点击事件向上冒泡 取消当前默认调用的函数可以调用e.preventDefault()
    $event.stopPropagation();
    if (item) {
      // 删除单个
      this.modalService.confirmDelete(() => {
        this.http.deletePush({pushId: item.id}).subscribe((res: any) => {
          if (res.code === '200') {
            this.drafts.service.delete(item);
            this.http.getPushStatistics().subscribe((_res: any) => {
              if (_res.data) {
                this.allNumber = _res.data.all;
                this.alreadyPush.number = _res.data.unpush;
                this.notPush.number = _res.data.pushed;
                this.drafts.number = _res.data.draft;
              }
            });
            this.messageService.success('删除成功！');
          } else {
            this.messageService.error('删除失败');
          }
        });
      }, '确定要删除，<span class="text-primary">' + item.title + '</span>吗？');
    } else {
      // 全部删除
      this.modalService.confirmDelete(() => {
        this.http.deleteAllPush({msgType: 'draft'}).subscribe((res: any) => {
          if (res.code === '200') {
            this.drafts.service.initList({isActiveFist: false});
            this.http.getPushStatistics().subscribe((_res: any) => {
              if (_res.data) {
                this.allNumber = _res.data.all;
                this.alreadyPush.number = _res.data.unpush;
                this.notPush.number = _res.data.pushed;
                this.drafts.number = _res.data.draft;
              }
            });
            this.messageService.success('删除成功！');
          } else {
            this.messageService.error('删除失败');
          }
        });
      }, '确定要<span class="text-primary">删除所有的草稿</span>吗？');
    }
  }
}
