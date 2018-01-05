import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UtilService} from "../util/util.service";

@Component({
  selector: 'app-day-select',
  templateUrl: './day-select.component.html'
})
export class DaySelectComponent implements OnInit {
  days = [];
  @Input() selectedDay = '';
  @Input() isDisabled = false;
  @Output() selectedDayChange = new EventEmitter();
  selectBoxHidden = true;
  constructor(
    private util: UtilService
  ) {
  }

  ngOnInit() {
    if (this.selectedDay) {
      let selectedList = this.selectedDay.split(',');
      for (let i = 0; i < 31; i ++) {
        let isChecked = false;
        for (let j = 0; j < selectedList.length; j++) {
          if (+selectedList[j] === (i + 1)) {
            isChecked = true;
          }
        }
        this.days.push({
          day: ('0' + (i + 1)).slice(-2),
          isChecked: isChecked
        });
      }
    } else {
      for (let i = 0; i < 31; i ++) {
        this.days.push({
          day: ('0' + (i + 1)).slice(-2),
          isChecked: false
        });
      }
    }
    this.selectedDayChange.emit(this.selectedDay);
  }
  onClickDaySelect() {
    if (!this.isDisabled) {
      this.selectBoxHidden = !this.selectBoxHidden;
    }
  }
  onClickDay(item) {
    item.isChecked = !item.isChecked;
    this.selectedDay = this.util.getIdsByList(this.days, false, 'day');
    this.selectedDayChange.emit(this.selectedDay);
  }

}
