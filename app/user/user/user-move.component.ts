import {Component, Input, OnInit} from '@angular/core';
import {NzModalService, NzModalSubject} from "ng-zorro-antd";
import {UserGroupService} from "../user.service";
import {UserGroupFormComponent} from "./user-group-form.component";
import {ModalService} from "../../shared/service/modal.service";
import {UserGroupFormService} from "../service/user-group-form.service";
import {MessageService} from "../../shared/service/message.service";

@Component({
  selector: 'app-device-move',
  templateUrl: './user-move.component.html',
  providers: [UserGroupService, UserGroupFormService],
})
export class UserMoveComponent implements OnInit {
  keep = true;
  @Input()
  isFrom = false;
  modalUserGroup;
  constructor(private subject: NzModalSubject,
              private nzModalService: NzModalService,
              private messageService: MessageService,
              private modalService: ModalService,
              public userGroupService: UserGroupService) {
    this.userGroupService.initListPopUp();
    this.userGroupService.initList = this.userGroupService.initListPopUp;
  }

  ngOnInit() {
    // if (this.isFrom) {
    //   this.keep = true;
    // }
  }
  // 添加用户组
  addUserGroup() {
    this.modalUserGroup = this.nzModalService.open({
      title: '添加用户组',
      content: UserGroupFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        parentId: ''
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modalUserGroup.subscribe((result) => {
      if (result.type === 'save') {
        this.userGroupService.add(result.data).subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.info('用户组添加成功');
            this.userGroupService.initList({isActiveFist: false});
            this.modalUserGroup.destroy();
          }
        });
      }
    });
  }

  submit(event) {
    this.subject.next({type: "save", data: {groups: this.userGroupService.checkedList, keep: this.keep}});
  }

  handleCancel(event) {
    this.subject.destroy('onCancel');
  }
}
