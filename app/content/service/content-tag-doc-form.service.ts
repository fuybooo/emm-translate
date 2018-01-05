import {EventEmitter, Injectable} from "@angular/core";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {Validators} from "@angular/forms";
import {ContentTagService} from "./content-tag.service";
import {ContentFilesHttpService} from "./content-http.service";
@Injectable()
export class ContentTagDocFormService extends CustomForm {
  labelSm = 5;
  popUp = true;
  items = [
    {
      type: 'select',
      label: '选择书签',
      key: 'tagIds',
      value: [],
      options: [],
      nzSearchChange: (search?) => {
        this.http.getTagList({search: search, page: 1, pageSize: 10})
          .subscribe((res: any) => {
            let options = [];
            for (let g of res.data.result) {
              if (this.getFormControl('tagIds').value && !this.getFormControl('tagIds').value.find(id => id === g.id)) {
                options.push({label: g.tagName, value: g.id});
              }
            }
            if (search && options.length === 0) {
              options.push({label: '没有匹配的结果', disabled: true, value: -1});
            }
            this.items[0] = Object.assign(this.items[0], {options: options});
            this.getFormControl('tagIds').setValue(this.getFormControl('tagIds').value);
          });
      },
    }
  ];
  constructor (private http: ContentFilesHttpService) {
    super();
  }
}
