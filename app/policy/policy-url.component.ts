import { Component, OnInit } from '@angular/core';
import {DataService} from "../shared/service/data.service";
import {NzModalService} from "ng-zorro-antd";
import {options18} from "./policy.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../shared/util/util.service";
import {ModalService} from "../shared/service/modal.service";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "../shared/service/message.service";
import {ActivatedRoute} from "@angular/router";
import {ValidatorService} from "../shared/service/validator.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-url',
  templateUrl: './policy-url.component.html',
})
export class PolicyUrlComponent implements OnInit {
  searchWord = '';
  level = 0;
  data = [];
  totals: any = {};
  options = options18;
  isLoading = false;
  allChecked = false;
  indeterminate = false;
  type = '';
  params = {
    type: '',
    level: 0,
    search: '',
    pageNumber: 1,
    pageSize: 100,
    sortName: '',
    sortOrder: ''
  };
  addModal;
  urlForm: FormGroup;
  sensitiveWordForm: FormGroup;
  constructor(
    private http: HttpClient,
    private util: UtilService,
    private dataService: DataService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private nzModalService: NzModalService,
    private messageService: MessageService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private validatorService: ValidatorService,
  ) {
  }

  ngOnInit() {
    let path = this.route.snapshot.routeConfig.path;
    if (path === 'url') {
      this.type = 'URL';
    } else if (path === 'sensitiveWord') {
      this.type = 'Sensitive';
    }
    this.params.type = this.type;
    this.urlForm = this.fb.group({
      content: ['', [
        Validators.required,
        Validators.pattern(/^(\W*)(((http|ftp|https):\/\/)?)[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?(\W*)$/)
      ], [this.validatorService.getSyncValidator(this.dataService.url.policy.check_sensitive_word_url_duplicate,
        {type: this.type})]],
      level: [1]
    });
    this.sensitiveWordForm = this.fb.group({
      content: ['', [
        Validators.required,
      ], [this.validatorService.getSyncValidator(this.dataService.url.policy.check_sensitive_word_url_duplicate,
        {type: this.type})]],
      level: [1]
    });
    this.search();
  }
  changeSearchWord() {
    if (this.searchWord === '') {
      this.search();
    }
  }
  doSearch() {
    this.params.search = this.searchWord;
    this.search();
  }
  // 重新进行查找列表 获取最新的数据
  search() {
    this.isLoading = true;
    this.http.get(this.dataService.url.policy.get_sensitive_word_url_list, this.dataService.getWholeParams(this.params))
      .subscribe((res: any) => {
        this.isLoading = false;
        this.data = res.data.result;
        this.totals.total = res.data.total;
        this.totals.total1 = res.data.total1;
        this.totals.total2 = res.data.total2;
        this.totals.total3 = res.data.total3;
        this.onClickChangeChecked();
      });
  }
  getFormControl(name) {
    if (this.type === 'URL') {
      return this.urlForm.controls[name];
    } else if (this.type === 'Sensitive') {
      return this.sensitiveWordForm.controls[name];
    }
  }
  add(titleTpl, contentTpl, footerTpl) {
    this.addModal = this.nzModalService.open({
      title: titleTpl,
      content: contentTpl,
      footer: footerTpl
    });
  }
  // 表单中的保存按钮，进行提交
  handleOk() {
    this.http.post(this.dataService.url.policy.add_sensitive_word_url_list, {
      data: JSON.stringify({
        content: this.getFormControl('content').value,
        level: this.getFormControl('level').value,
      }),
      type: this.type
    }).subscribe((res: any) => {
      if (res.code === '200') {
        this.addModal.destroy();
        this.getFormControl('content').reset();
        this.search();
        // 提示添加成功
        this.messageService.success('添加成功！');
      } else {
        this.messageService.success('添加失败！');
      }
    });
  }
  handleCancel() {
    this.addModal.destroy();
  }
  // 批量删除，选中所选按钮，进行删除选中部分
  del() {
    let checkedList = this.util.getCheckedData(this.data);
    if (checkedList.length) {
      this.modalService.confirmDelete(() => {
        this.http.post(this.dataService.url.policy.delete_sensitive_word_url_list, {
          type: this.type,
          ids: this.util.getIdsByList(checkedList, true)
        }).subscribe((res: any) => {
          if (res.code === '200') {
            this.search();
            this.messageService.success('删除成功！');
          } else {
            this.messageService.error('删除失败');
          }
        });
      });
    }
  }
  // 判断级别
  changeType(level) {
    this.level = level;
    this.params.level = level;
    this.search();
  }
  onClickChangeAllChecked(value) {
    this.data.forEach(item => item.isChecked = value);
    this.onClickChangeChecked();
  }
  onClickChangeChecked() {
    if (this.data.length) {
      this.allChecked = this.data.every(item => item.isChecked === true);
      let unAllCheck = this.data.every(item => !item.isChecked); // item.isChecked 可能为 undefined
      this.indeterminate = !unAllCheck && !this.allChecked;
    } else {
      this.allChecked = false;
      this.indeterminate = false;
    }
  }
}
