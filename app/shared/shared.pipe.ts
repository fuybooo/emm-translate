import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'fileSize'})
export class FileSizePipe implements PipeTransform {
  transform(value: any, exponent: any): string {
    let unit = 'B';
    let fixed = 0;
    if (value > 1024) {
      value = (value / 1024).toFixed(fixed);
      unit = 'kB';
    }
    if (value > 1024) {
      value = (value / 1024).toFixed(fixed);
      unit = 'MB';
    }
    if (value > 1024) {
      value = (value / 1024).toFixed(fixed);
      unit = 'GB';
    }
    if (value > 1024) {
      value = (value / 1024).toFixed(fixed);
      unit = 'GB';
    }
    return value + unit;
  }
}

