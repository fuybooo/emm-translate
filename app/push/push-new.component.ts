import {Component, EventEmitter, OnInit} from "@angular/core";
import {PushFormService} from "./service/push-form.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {PushHttpService} from "./service/push-http.service";
import {MessageService} from "../shared/service/message.service";

@Component({
  selector: 'app-push-new',
  templateUrl: './push-new.component.html',
  providers: [
    PushFormService,
  ]
})
export class PushNewComponent implements OnInit {
  constructor(public form: PushFormService,
              private http: PushHttpService,
              private messageService: MessageService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }
  ngOnInit() {
    // 编辑推送
    if (this.activatedRoute.snapshot.params['id'] > 0) {
      this.http.getPushDetail({pushId: this.activatedRoute.snapshot.params['id']}).subscribe((res: any) => {
            if (res.code === '200') {
              // 推送对象
              let data = [];
              let users = [];
              let groups = [];
              let depts = [];
              let userIds = [];
              let deptIds = [];
              let groupIds = [];
              res.data.pushDeployMaps.forEach((item: any) => {
                if (item.applyType === 5) {
                  // 用户组
                  if (item.applyName) {
                    groups.push({id: item.applyValue, name: item.applyName});
                    groupIds.push(item.applyValue);
                    data.push({type: 'group', id: item.applyValue, name: item.applyName});
                  }
                } else if (item.applyType === 4) {
                  // 用户
                  if (item.applyName) {
                    users.push({id: item.applyValue, name: item.applyName});
                    userIds.push(item.applyValue);
                    data.push({type: 'user', id: item.applyValue, name: item.applyName});
                  }
                } else if (item.applyType === 1) {
                  // 部门
                  if (item.applyName) {
                    depts.push({id: item.applyValue, name: item.applyName});
                    deptIds.push(item.applyValue);
                    data.push({type: 'dept', id: item.applyValue, name: item.applyName});
                  }
                }
              });
              // 定时推送
              let sendType = '1';
              let sendDate = new Date(res.data.sendDate);
              this.form.items[5]['value'] = sendType;
              this.form.items[6]['value'] = sendDate;
              this.form.items[7]['value'] = sendDate;

              this.form.setData({
                ...res.data,
                obj: {data: data, users: users, groups: groups, depts: depts, userIds: userIds, deptIds: deptIds, groupIds: groupIds},
                sendType: sendType,
                time: sendDate,
                date: sendDate,
                pushId: this.activatedRoute.snapshot.params['id'],
                platformType: res.data.platform.split(','),
              });
            }
          });
    }
  }

  submit(draft) {
    let _data = this.form.getData();
    // 定时推送限制条件
    let sendDate;
    if (_data.sendType === '0') {
      // 及时推送
    } else if (_data.sendType === '1') {
      // 定时推送
      // 判断定时推送的时间
      if (_data.date && _data.time) {
        _data.time.setFullYear(_data.date.getFullYear());
        _data.time.setMonth(_data.date.getMonth());
        _data.time.setDate(_data.date.getDate());
        // 判断推送日期大于当前日期
        if (_data.time > new Date()) {
          sendDate = _data.time.valueOf();
        } else {
          this.messageService.warning('选择的推送时间应大于当前的时间！');
          return ;
        }
      } else {
        this.messageService.warning('请选择推送时间！');
        return ;
      }
    }
    let data: any = {
      ..._data,
      userIds: _data.obj.userIds.join(','),
      deptIds: _data.obj.deptIds.join(','),
      userGroupIds: _data.obj.groupIds.join(','),
      draft: draft === 1, //  0不是草稿，1是草稿
      sendDate: sendDate, // 推送时间
      platform: _data.platformType.join(','),
      messageType: 0, // 消息类型 0：普通消息，1：需要目标进行回复的消息
    };
    this.http.savePush(data).subscribe((res: any) => {
      if (res.code === '200') {
        this.router.navigate(['../../list'], {
          relativeTo: this.activatedRoute
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['../../list'], {
      relativeTo: this.activatedRoute
    });
  }
}
