import {Component, OnInit, Output, EventEmitter, Input} from "@angular/core";
import {DeptService, UserService} from "../user.service";
import {NzModalModule, NzModalService} from "ng-zorro-antd";
import {ModalService} from "../../shared/service/modal.service";
import {DeptFormService} from "../service/user-dept-form.service";
import {CustomFormComponent} from "../../shared/custom-form/custom-form.component";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "../../shared/service/message.service";
import {DataService} from "../../shared/service/data.service";
@Component({
  selector: 'app-user-dept-list',
  templateUrl: './user-dept-list.component.html'
})
export class UserDeptListComponent implements OnInit {
  @Input()
  type = ''; // "simply"

  modal;

  options = {
    axis: 'yx',
    callbacks: {
      onTotalScroll: () => {
      }
    }
  };

  constructor(private nzModalService: NzModalService,
              private modalService: ModalService,
              private http: HttpClient,
              private messageService: MessageService,
              private dataService: DataService,
              public dept: DeptService) {}

  ngOnInit() {
  }

  editDept(item) {
    let form = new DeptFormService(this.http, this.messageService, this.dataService);
    form.dept_id = item.id;
    form.setData({
      dept_id: item.id,
      dept_name: item.name
    });
    if (item.parent) {
      form.parent_id = item.parent.id;
    }
    this.modal = this.nzModalService.open({
      title: '编辑部门',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: form
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modal.subscribe((result: any) => {
      if (result.type === 'save') {
        let d = result.data;
        this.http.post(this.dataService.url.user.createDept,
          {
            dept_name: d.dept_name, parent_id: d.parent_id ? d.parent_id : null, dept_id: d.dept_id ? d.dept_id : null
          }).subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.info('部门编辑成功！');
            item.name = d.dept_name;
            this.modal.destroy();
          }
        });
      }
    });
  }
  deleteDept(item) {
    this.modalService.confirmDelete(() => {
      this.dept.delete(item);
    });
  }
}
