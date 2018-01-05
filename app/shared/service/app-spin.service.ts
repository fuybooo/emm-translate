import {EventEmitter, Injectable} from "@angular/core";
@Injectable()
export class AppSpinService {
  spinEvent = new EventEmitter();
  spin(active = true) {
    this.spinEvent.emit(active);
  }
}
