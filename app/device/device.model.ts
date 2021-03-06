export interface DeviceGroup {
  key: number;
  name: string;
  deviceCount: number;
  children?: DeviceGroup[];
  level?: number;
  expand?: boolean;
  parent?: DeviceGroup;
  isEditVisible?: boolean;
}
export let bgcs = [
  '#25C3FF',
  '#FFA88C',
  '#62E7CA',
  '#9998FE',
  '#E5E5E5',
];
export const deviceExportField = [
  {
    value: 'IMEI',
    label: 'IMEI'
  },
  {
    value: '系统版本',
    label: '系统版本'
  },
  {
    value: 'MEID',
    label: 'MEID'
  },
  {
    value: '帐号',
    label: '帐号'
  },
  {
    value: 'SN',
    label: 'SN'
  },
  {
    value: '持有人',
    label: '持有人'
  },
  {
    value: 'MAC',
    label: 'MAC'
  },
  {
    value: '部门',
    label: '部门'
  },
  {
    value: '资产编号',
    label: '资产编号'
  },
  {
    value: '设备分组',
    label: '设备分组'
  },
  {
    value: '设备型号',
    label: '设备型号'
  },
];
export const deviceExtendData = [
  {
    label: '设备来源',
  },
  {
    label: '可用空间',
  },
  {
    label: '存储空间',
  },
  {
    label: '是否锁定',
  },
  {
    label: '是否ROOT',
  },
  {
    label: '移动设备国际识别码',
  },
  {
    label: 'SIM标识符',
  },
];
export const defaultHeight = 690;
