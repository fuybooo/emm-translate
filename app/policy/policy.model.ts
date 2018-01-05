export class PolicyItem {
  constructor(public label: string,
              public name: string,
              public isChecked: boolean = false,
              public isActive: boolean = false,
              public isDisabled: boolean = false,
              public count: number = 0) {
  }
}

export const commonSelect = [
  {
    label: '--',
    value: '--'
  },
  {
    label: '是',
    value: true
  },
  {
    label: '否',
    value: false
  },
];
// 激活邮件时效
export const options1 = [
  {
    label: '1',
    value: 1
  },
  {
    label: '7',
    value: 7
  },
  {
    label: '30',
    value: 30
  },
];
// 最小密码长度
export const options2 = [
  {
    label: '6',
    value: 6
  },
  {
    label: '8',
    value: 8
  },
  {
    label: '10',
    value: 10
  },
];
// 密码有效期
export const options3 = [
  {
    label: '1个月',
    value: 1
  },
  {
    label: '3个月',
    value: 3
  },
  {
    label: '6个月',
    value: 6
  },
  {
    label: '12个月',
    value: 12
  },
  {
    label: '永久',
    value: -1
  },
];
// 输入密码错误次数
export const options4 = [
  {
    label: '3',
    value: 3
  },
  {
    label: '5',
    value: 5
  },
  {
    label: '10',
    value: 10
  },
];
// 自动解除锁定时间
export const options5 = [
  {
    label: '5',
    value: 5
  },
  {
    label: '10',
    value: 10
  },
  {
    label: '15',
    value: 15
  },
  {
    label: '30',
    value: 30
  },
  {
    label: '60',
    value: 60
  },
];
// 自动锁定时间
export const options6 = [
  {
    label: '1',
    value: 1
  },
  {
    label: '2',
    value: 2
  },
  {
    label: '3',
    value: 3
  },
  {
    label: '4',
    value: 4
  },
  {
    label: '5',
    value: 5
  },
  {
    label: '6',
    value: 6
  },
  {
    label: '7',
    value: 7
  },
  {
    label: '8',
    value: 8
  },
  {
    label: '9',
    value: 9
  },
  {
    label: '10',
    value: 10
  },
];
// 数据上报频率
export const options7 = [
  {
    label: '10分钟',
    value: 10
  },
  {
    label: '30分钟',
    value: 30
  },
  {
    label: '1小时',
    value: 60
  },
  {
    label: '2小时',
    value: 120
  },
  {
    label: '6小时',
    value: 360
  },
  {
    label: '12小时',
    value: 720
  },
  {
    label: '1天',
    value: 1440
  },
];
export const options8 = [
  {
    label: '仅一次',
    value: -1
  },
  {
    label: '10分钟',
    value: 10
  },
  {
    label: '30分钟',
    value: 30
  },
  {
    label: '1小时',
    value: 60
  },
  {
    label: '2小时',
    value: 120
  },
  {
    label: '6小时',
    value: 360
  },
  {
    label: '12小时',
    value: 720
  },
  {
    label: '1天',
    value: 1440
  },
];
// 位置信息上报频率
export const options9 = [
  {
    label: '实时',
    value: -1
  },
  {
    label: '10分钟',
    value: 10
  },
  {
    label: '30分钟',
    value: 30
  },
  {
    label: '1小时',
    value: 60
  },
  {
    label: '2小时',
    value: 120
  },
  {
    label: '6小时',
    value: 360
  },
  {
    label: '12小时',
    value: 720
  },
  {
    label: '1天',
    value: 1440
  },
];
// 日
export const options10 = [
  {
    label: '01',
    value: '01'
  },
  {
    label: '02',
    value: '02'
  },
  {
    label: '03',
    value: '03'
  },
  {
    label: '04',
    value: '04'
  },
  {
    label: '05',
    value: '05'
  },
  {
    label: '06',
    value: '06'
  },
  {
    label: '07',
    value: '07'
  },
  {
    label: '08',
    value: '08'
  },
  {
    label: '09',
    value: '09'
  },
  {
    label: '10',
    value: '10'
  },
  {
    label: '11',
    value: '11'
  },
  {
    label: '12',
    value: '12'
  },
  {
    label: '13',
    value: '13'
  },
  {
    label: '14',
    value: '14'
  },
  {
    label: '15',
    value: '15'
  },
  {
    label: '16',
    value: '16'
  },
  {
    label: '17',
    value: '17'
  },
  {
    label: '18',
    value: '18'
  },
  {
    label: '19',
    value: '19'
  },
  {
    label: '20',
    value: '20'
  },
  {
    label: '21',
    value: '21'
  },
  {
    label: '22',
    value: '22'
  },
  {
    label: '23',
    value: '23'
  },
  {
    label: '24',
    value: '24'
  },
  {
    label: '25',
    value: '25'
  },
  {
    label: '26',
    value: '26'
  },
  {
    label: '27',
    value: '27'
  },
  {
    label: '28',
    value: '28'
  },
  {
    label: '29',
    value: '29'
  },
  {
    label: '30',
    value: '30'
  },
  {
    label: '31',
    value: '31'
  },
];
export const options11 = [
  {
    label: '单应用模式',
    value: 1
  },
  {
    label: '多应用模式',
    value: 2
  },
];
export const options12 = [
  {
    label: 'Android 4.4',
    value: 'Android 4.4'
  },
  {
    label: 'Android 5.0',
    value: 'Android 5.0'
  },
  {
    label: 'Android 5.1',
    value: 'Android 5.1'
  },
  {
    label: 'Android 6.0',
    value: 'Android 6.0'
  },
  {
    label: 'Android 7.0',
    value: 'Android 7.0'
  }
];
export const options13 = [
  {
    label: '--',
    value: '--'
  },
  {
    label: '允许所有影片',
    value: '1000'
  },
  {
    label: '不允许影片',
    value: '0'
  },
  {
    label: 'G',
    value: '100'
  },
  {
    label: 'PG',
    value: '200'
  },
  {
    label: 'M',
    value: '350'
  },
  {
    label: 'MA15+',
    value: '375'
  },
  {
    label: 'R18+',
    value: '400'
  },
];
export const options14 = [
  {
    label: '--',
    value: '--'
  },
  {
    label: '允许所有电视节目',
    value: '1000'
  },
  {
    label: '不允许电视节目',
    value: '0'
  },
  {
    label: 'P',
    value: '100'
  },
  {
    label: 'C',
    value: '200'
  },
  {
    label: 'G',
    value: '300'
  },
  {
    label: 'PG',
    value: '400'
  },
  {
    label: 'M',
    value: '500'
  },
  {
    label: 'MV15+',
    value: '550'
  },
  {
    label: 'AV15+',
    value: '575'
  },
];
export const options15 = [
  {
    label: '--',
    value: '--'
  },
  {
    label: '允许所有应用',
    value: '1000'
  },
  {
    label: '不允许应用',
    value: '0'
  },
  {
    label: '4+',
    value: '100'
  },
  {
    label: '9+',
    value: '200'
  },
  {
    label: '12+',
    value: '300'
  },
  {
    label: '17+',
    value: '600'
  },
];
export const options16 = [
  {
    label: '--',
    value: '--'
  },
  {
    label: '美国',
    value: 'us'
  },
  {
    label: '日本',
    value: 'jp'
  },
  {
    label: '英国',
    value: 'gb'
  },
  {
    label: '新西兰',
    value: 'nz'
  },
  {
    label: '爱尔兰',
    value: 'ie'
  },
  {
    label: '德国',
    value: 'de'
  },
  {
    label: '法国',
    value: 'fr'
  },
  {
    label: '加拿大',
    value: 'ca'
  },
  {
    label: '澳大利亚',
    value: 'au'
  },
];
export const options17 = [
  {
    label: '--',
    value: '--'
  },
  {
    label: '永不',
    value: '0'
  },
  {
    label: '仅来自当前网站',
    value: '1'
  },
  {
    label: '来自我访问的网站',
    value: '1.5'
  },
  {
    label: '始终',
    value: '2'
  },
];
export const options18 = [
  {
    label: '一级',
    value: 1
  },
  {
    label: '二级',
    value: 2
  },
  {
    label: '三级',
    value: 3
  },
];
export const options19 = [
  {
    label: '时间围栏',
    value: 1
  },
  {
    label: '地理围栏',
    value: 2
  }
];
export const options20 = [
  {
    label: '重复周期',
    value: 1
  },
  {
    label: '时间段',
    value: 2
  }
];
// iOS版本选项
export const options21 = [
  {
    label: 'iOS 7',
    value: 'iOS 7'
  },
  {
    label: 'iOS 8',
    value: 'iOS 8'
  },
  {
    label: 'iOS 9',
    value: 'iOS 9'
  },
  {
    label: 'iOS 10.3',
    value: 'iOS 10.3'
  },
  {
    label: 'iOS 11',
    value: 'iOS 11'
  }
];
// 最小复杂密码字符数
export const options22 = [
  {
    label: '1',
    value: 1
  },
  {
    label: '2',
    value: 2
  },
  {
    label: '3',
    value: 3
  },
  {
    label: '4',
    value: 4
  },
];
// 锁定宽限时间
export const options23 = [
  {
    label: '--',
    value: '--'
  },
  {
    label: '立即',
    value: -1
  },
  {
    label: '1分钟',
    value: 1
  },
  {
    label: '5分钟',
    value: 5
  },
  {
    label: '15分钟',
    value: 15
  },
  {
    label: '1小时',
    value: 60
  },
  {
    label: '4小时',
    value: 240
  },
];
// 最多允许输入密码错误次数
export const options24 = [
  {
    label: '4',
    value: 4
  },
  {
    label: '5',
    value: 5
  },
  {
    label: '6',
    value: 6
  },
  {
    label: '7',
    value: 7
  },
  {
    label: '8',
    value: 8
  },
  {
    label: '9',
    value: 9
  },
  {
    label: '10',
    value: 10
  },
];
// 密码设置中 最小密码长度
export const options25 = [
  {
    label: '--',
    value: '--'
  },
  {
    label: '1',
    value: '1'
  },
  {
    label: '2',
    value: '2'
  },
  {
    label: '3',
    value: '3'
  },
  {
    label: '4',
    value: '4'
  },
  {
    label: '5',
    value: '5'
  },
  {
    label: '6',
    value: '6'
  },
  {
    label: '7',
    value: '7'
  },
  {
    label: '8',
    value: '8'
  },
  {
    label: '9',
    value: '9'
  },
  {
    label: '10',
    value: '10'
  },
  {
    label: '11',
    value: '11'
  },
  {
    label: '12',
    value: '12'
  },
  {
    label: '13',
    value: '13'
  },
  {
    label: '14',
    value: '14'
  },
  {
    label: '15',
    value: '15'
  },
  {
    label: '16',
    value: '16'
  }
];
// VPN中的连接类型
export const options26 = [
  {
    label: 'IKEv2',
    value: 'IKEv2'
  },
  {
    label: 'IPsec',
    value: 'IPsec'
  },
  {
    label: 'L2TP',
    value: 'L2TP'
  },
  {
    label: 'PPTP(iOS 9 和 OS X 10.11 及更早版本)',
    value: 'PPTP'
  },
  {
    label: 'Cisco AnyConnect',
    value: 'cisco'
  },
  {
    label: 'Juniper SSL',
    value: 'juniper'
  },
  {
    label: 'Pulse Secure',
    value: 'pulse'
  },
  {
    label: 'F5 SSL',
    value: 'F5'
  },
  {
    label: 'SonicWALL Mobile Connect',
    value: 'sonic'
  },
  {
    label: 'Aruba VIA',
    value: 'Aruba'
  },
  {
    label: 'Check Point Mobile VPN',
    value: 'VPN'
  },
  {
    label: '自定 SSL',
    value: 'SSL'
  },
];
// 要同步过去邮件的天数
export const options27 = [
  {
    label: '无限制',
    value: 0  // 0
  },
  {
    label: '1天',
    value: 1  // 1
  },
  {
    label: '3天',
    value: 3  // 3
  },
  {
    label: '1周',
    value: 7  // 7
  },
  {
    label: '2周',
    value: 14  // 14
  },
  {
    label: '1个月',
    value: 31  // 31
  },
];
// 鉴定凭证
export const options28 = [
  {
    label: '没有值',
    value: 'none'
  },
];
// 要同步过去邮件的天数
export const options29 = [
  {
    label: '没有值',
    value: '3'
  },
  {
    label: '4天',
    value: '4'
  },
  {
    label: '5天',
    value: '5'
  },
  {
    label: '6天',
    value: '6'
  },
];
// 全局HTTP代理类型
export const options30 = [
  {
    label: '自动',
    value: 1 // 'Auto'
  },
  {
    label: '手动',
    value: 2 // 'Manual'
  },
];
// 应用网络限制 漫游
export const options31 = [
  {
    label: '有',
    value: '3'
  },
  {
    label: '无',
    value: '4'
  },
];
// 应用网络限制 蜂窝
export const options32 = [
  {
    label: '有',
    value: '3'
  },
  {
    label: '无',
    value: '4'
  },
];
// 应用网络限制 蜂窝
export const options33 = [
  {
    label: 'IMAP',
    value: 'EmailTypeIMAP'  // 'EmailTypeIMAP' 本来值与实际值是一致的
  },
  {
    label: 'POP',
    value: 'EmailTypePOP'  // 'EmailTypePOP'
  },
];
// 邮件鉴定类型
export const options34 = [
  {
    label: '无',
    value: 'none'  // 'EmailAuthNone'
  },
  {
    label: '密码',
    value: 'password'  // 'EmailAuthPassword'
  },
  {
    label: 'MD5质询回应',
    value: 'MD5'  // 'EmailAuthCRAMMD5'
  },
  {
    label: 'NTLM',
    value: 'NTLM'  // 'EmailAuthNTLM'
  },
  {
    label: 'HTTP MD5 摘要',
    value: 'HTTP MD5'  // 'EmailAuthHTTPMD5'
  },
];
// web内容过滤
export const options35 = [
  {
    label: '内建:限制成人内容',
    value: 1
  },
  {
    label: '内建:只允许特定网站',
    value: 2
  },
  {
    label: '插件(第三方应用)',
    value: 3
  },
];
export const options36 = [
  {
    label: '无',
    value: 1
  },
  {
    label: '手动',
    value: 2
  },
  {
    label: '自动',
    value: 3
  },
];
export const options37 = [
  {
    label: '无',
    value: 1
  },
  {
    label: 'WEP',
    value: 2
  },
  {
    label: 'WPA/WPA2个人级',
    value: 3
  },
  {
    label: 'WPA2个人级（iOS 8 或更高版本，Apple TV 除外）',
    value: 4
  },
  {
    label: '任一（个人级）',
    value: 5
  },
  {
    label: '动态WEP',
    value: 6
  },
  {
    label: 'WPA/WPA2企业级',
    value: 7
  },
  {
    label: 'WPA2企业级（iOS 8 或更高版本，Apple TV 除外）',
    value: 8
  },
  {
    label: '任一（企业级）',
    value: 9
  },
];
export const options38 = [
  {
    label: '标准',
    value: 1
  },
  {
    label: '旧热点',
    value: 2
  },
  {
    label: 'Passpoint',
    value: 3
  },
];
export const options39 = [
  {
    label: '不限制QoS标记',
    value: 1
  },
  {
    label: '限制QoS标记',
    value: 2
  },
];
export const options40 = [
  {
    label: '无',
    value: 1
  },
  {
    label: '证书',
    value: 2
  },
  {
    label: '共享密钥/群组名称',
    value: 3
  },
];
export const options41 = [
  {
    label: '总是建立',
    value: 1
  },
  {
    label: '永不建立',
    value: 2
  },
  {
    label: '需要时建立',
    value: 3
  },
];
export const options42 = [
  {
    label: '1',
    value: 1
  },
  {
    label: '2',
    value: 2
  },
  {
    label: '5',
    value: 3
  },
  {
    label: '14',
    value: 4
  },
  {
    label: '15',
    value: 5
  },
  {
    label: '16',
    value: 6
  },
  {
    label: '17',
    value: 7
  },
  {
    label: '18',
    value: 8
  },
  {
    label: '19',
    value: 9
  },
  {
    label: '20',
    value: 10
  },
  {
    label: '21',
    value: 11
  },
];
export const options43 = [
  {
    label: '证书',
    value: 1
  },
  {
    label: '用户名/密码',
    value: 2
  },
];
export const options44 = [
  {
    label: 'OS默认',
    value: 1
  },
  {
    label: 'PAP',
    value: 2
  },
  {
    label: 'CHAP',
    value: 3
  },
  {
    label: 'MSCHAP',
    value: 4
  },
  {
    label: 'MSCHAPVv2',
    value: 5
  },
  {
    label: 'EAP (iOS9 和 OS X 10.11中新增)',
    value: 6
  },
];
export const options45 = [
  {
    label: '未配置适用的证书有效负载',
    value: 1
  },
];
// IPsec 设备鉴定
export const options46 = [
  {
    label: '证书',
    value: 1
  },
  {
    label: '共享密钥/群组名称',
    value: 2
  },
];
// 身份证书 用于鉴定
export const options47 = [
  {
    label: '在“证书”有效负载中添加证书',
    value: 1
  },
];
// 身份证书 用于鉴定
export const options48 = [
  {
    label: '无',
    value: 1
  },
  {
    label: '自动',
    value: 2
  },
  {
    label: '最大 (128位)',
    value: 3
  },
];
// Cisco 用户鉴定
export const options49 = [
  {
    label: '密码',
    value: 1
  },
  {
    label: '证书',
    value: 2
  },
  {
    label: '密码+证书',
    value: 3
  },
];
// Cisco 闲置时断开连接
export const options50 = [
  {
    label: '2分钟',
    value: 1
  },
];
export const options51 = [
  {
    label: '密码',
    value: 1
  },
  {
    label: '证书',
    value: 2
  },
];
// 证书类型
export const options52 = [
  {
    label: 'RSA',
    value: 1
  },
  {
    label: 'ECDSA256',
    value: 2
  },
  {
    label: 'ECDSA384',
    value: 3
  },
  {
    label: 'ECDSA521',
    value: 4
  },
];

export const options53 = [
  {
    label: '允许所有应用',
    value: 1
  },
  {
    label: '不允许部分应用',
    value: 2
  },
  {
    label: '仅允许部分应用',
    value: 3
  },
];
// IKE SA 参数 加密算法
export const options54 = [
  {
    label: 'DES',
    value: 1
  },
  {
    label: '3DES',
    value: 2
  },
  {
    label: 'AES-128',
    value: 3
  },
  {
    label: 'AES-256',
    value: 4
  },
  {
    label: 'AES-128-GCM',
    value: 5
  },
  {
    label: 'AES-256-GCM',
    value: 5
  },
];
// IKE SA 参数 完整性算法
export const options55 = [
  {
    label: 'SHA1-96',
    value: 1
  },
  {
    label: 'SHA1-160',
    value: 2
  },
  {
    label: 'SHA2-256',
    value: 3
  },
  {
    label: 'SHA2-384',
    value: 4
  },
  {
    label: 'SHA2-512',
    value: 5
  },
];
// 失效同层检测速率
export const options56 = [
  {
    label: '无',
    value: 1
  },
  {
    label: '低',
    value: 2
  },
  {
    label: '中',
    value: 3
  },
  {
    label: '高',
    value: 4
  },
];
// 休闲时断开连接
export const options57 = [
  {
    label: '永不',
    value: 1
  },
  {
    label: '间隔时间后',
    value: 2
  },
];
export const options58 = [
  {
    label: 'WEP',
    value: 1
  },
  {
    label: 'EAP/PEAP',
    value: 2
  },
  {
    label: 'EAP/TLS',
    value: 3
  },
  {
    label: 'WPA/WPA2',
    value: 4
  },
  {
    label: '任一/个人级',
    value: 5
  },
];
export const options59 = [
  {
    label: '--',
    value: '--'
  },
  {
    label: '1',
    value: '1'
  },
  {
    label: '2',
    value: '2'
  },
  {
    label: '3',
    value: '3'
  },
  {
    label: '4',
    value: '4'
  },
  {
    label: '5',
    value: '5'
  },
  {
    label: '6',
    value: '6'
  },
  {
    label: '7',
    value: '7'
  },
  {
    label: '8',
    value: '8'
  },
  {
    label: '9',
    value: '9'
  },
  {
    label: '10',
    value: '10'
  },
  {
    label: '11',
    value: '11'
  },
  {
    label: '12',
    value: '12'
  },
  {
    label: '13',
    value: '13'
  },
  {
    label: '14',
    value: '14'
  },
  {
    label: '15',
    value: '15'
  },
  {
    label: '16',
    value: '16'
  }
];



