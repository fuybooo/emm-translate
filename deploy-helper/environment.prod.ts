/**
 * 部署108环境时需要用该文件替换掉environments中的environment.prod.ts文件
 */
export const environment = {
  env: 'prod',
  production: true,
  path: '',
  staticPath: 'http://192.168.7.108',
  api_changeable: true,
  private_version: null, // version为1则表示该版本为只配置安卓，为null则为正常版本
  deployPath: '/quarkdata'
};
