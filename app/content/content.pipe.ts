import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'contentPermission'})
export class ContentPermission implements PipeTransform {
  transform(value: number, exponent: string): number {
    return value ? 1 : 0;
  }
}

@Pipe({name: 'contentTypeToIcon'})
export class ContentTypeToIcon implements PipeTransform {
  transform(value: any, exponent: string): string {
    let icon = 'et';
    // 支持的文件图标
    let icon_file = ['db', 'doc', 'docx', 'dps', 'epub', 'et', 'folder', 'gif', 'jpg', 'jpeg', 'png', 'md', 'moren', 'mp3', 'wav', 'mp4',
      'avi', 'pdf', 'ppt', 'pptx', 'ttf', 'ttc', 'txt', 'txt2', 'wps', 'xls', 'xlsx', 'zip', 'gz', 'rar'];
    switch (value) {
      case '':
        icon = 'et';
        break;
      case 'db':
        icon = 'db-icon';
        break;
      default:
        icon = value;
    }
    if (icon_file.indexOf(value) < 0) {
      icon = 'et';
    }
    return icon;
  }
}
