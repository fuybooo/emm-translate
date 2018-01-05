import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {PolicyEnclosureComponent} from './policy-enclosure.component';
import {PolicyViolationComponent} from './policy-violation.component';
import {PolicyLauncherComponent} from './policy-launcher.component';
import {PolicyUrlComponent} from './policy-url.component';
import {PolicyItemDataReportComponent} from "./policy-item/policy-item-data-report.component";
import {PolicyItemPositionComponent} from "./policy-item/policy-item-position.component";
import {PolicyItemVersionComponent} from "./policy-item/policy-item-version.component";
import {PolicyItemFunctionComponent} from "./policy-item/policy-item-function.component";
import {PolicyItemNetworkComponent} from "./policy-item/policy-item-network.component";
import {PolicyItemLauncherComponent} from "./policy-item/policy-item-launcher.component";
import {PolicySecurityComponent} from "./policy-security/policy-security.component";
import {PolicySecurityAddIpComponent} from "./policy-security/policy-security-add-ip.component";
import {HttpInterceptorService} from "../shared/service/http-interceptor.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {PolicyDeviceComponent} from "./policy-device.component";
import {PolicyContentOperateComponent} from "./policy-content/policy-content-operate.component";
import {PolicyDeviceConfigComponent} from "./policy-device-config.component";
import {PolicyContentComponent} from "./policy-content/policy-content.component";
import {PolicyObjectComponent} from "./policy-object.component";
import {PolicyItemApplicationComponent} from "./policy-item/policy-item-application.component";
import {PolicyItemWifiComponent} from "./policy-item/policy-item-wifi.component";
import {PolicyItemEnclosureComponent} from "./policy-item/policy-item-enclosure.component";
import {PolicySimpleAppComponent} from "./policy-simple-app.component";
import {PolicyItemSimpleAppComponent} from "./policy-item/policy-item-simple-app.component";
import {PolicyViolationContentComponent} from "./policy-violation-content.component";
import {PolicyItemPasswordComponent} from "./policy-item/policy-item-password.component";
import {PolicyItemVpnComponent} from "./policy-item/policy-item-vpn.component";
import {PolicyItemAirPrintComponent} from "./policy-item/policy-item-air-print.component";
import {PolicyItemAirPlayComponent} from "./policy-item/policy-item-air-play.component";
import {PolicyItemCalendarConfigurationComponent} from "./policy-item/policy-item-calendar-configuration.component";
import {PolicyItemCalendarSubscriptionComponent} from "./policy-item/policy-item-calendar-subscription.component";
import {PolicyItemAddressBookSynchronizationComponent} from "./policy-item/policy-item-address-book-synchronization.component";
import {PolicyItemFontConfigurationComponent} from "./policy-item/policy-item-font-configuration.component";
import {PolicyItemWebClipComponent} from "./policy-item/policy-item-web-clip.component";
import {PolicyItemHttpGlobalAgentComponent} from "./policy-item/policy-item-http-global-agent.component";
import {PolicyItemApplicationAccessRestrictionComponent} from "./policy-item/policy-item-application-access-restriction.component";
import {PolicyItemLockScreenConfigurationComponent} from "./policy-item/policy-item-lock-screen-configuration.component";
import {PolicyItemGoogleAccountConfigurationComponent} from "./policy-item/policy-item-google-account-configuration.component";
import {PolicyItemEmailConfigurationComponent} from "./policy-item/policy-item-email-configuration.component";
import {PolicyItemExchangeEmailComponent} from "./policy-item/policy-item-exchange-email.component";
import {PolicyItemNotificationConfigurationComponent} from "./policy-item/policy-item-notification-configuration.component";
import {PolicyItemSsoConfigurationComponent} from "./policy-item/policy-item-sso-configuration.component";
import {PolicyItemFieldConfigurationComponent} from "./policy-item/policy-item-field-configuration.component";
import {PolicyItemLdapConfigurationComponent} from "./policy-item/policy-item-ldap-configuration.component";
import {PolicyItemWebContentFilteringComponent} from "./policy-item/policy-item-web-content-filtering.component";
import {PolicyItemMainScreenComponent} from "./policy-item/policy-item-main-screen.component";
import {PolicyItemMacOsServerConfigurationComponent} from "./policy-item/policy-item-mac-os-server-configuration.component";
@NgModule({
  declarations: [
    PolicySecurityComponent,
    PolicyDeviceComponent,
    PolicyDeviceConfigComponent,
    PolicyContentComponent,
    PolicyContentOperateComponent,
    PolicyEnclosureComponent,
    PolicyViolationComponent,
    PolicyViolationContentComponent,
    PolicyLauncherComponent,
    PolicySimpleAppComponent,
    PolicyUrlComponent,
    PolicySecurityAddIpComponent,
    PolicyObjectComponent,
    PolicyItemApplicationComponent,
    PolicyItemDataReportComponent,
    PolicyItemPositionComponent,
    PolicyItemVersionComponent,
    PolicyItemFunctionComponent,
    PolicyItemNetworkComponent,
    PolicyItemLauncherComponent,
    PolicyItemPasswordComponent,
    PolicyItemWifiComponent,
    PolicyItemEnclosureComponent,
    PolicyItemSimpleAppComponent,
    PolicyItemVpnComponent,
    PolicyItemAirPrintComponent,
    PolicyItemAirPlayComponent,
    PolicyItemCalendarConfigurationComponent,
    PolicyItemCalendarSubscriptionComponent,
    PolicyItemAddressBookSynchronizationComponent,
    PolicyItemFontConfigurationComponent,
    PolicyItemWebClipComponent,
    PolicyItemHttpGlobalAgentComponent,
    PolicyItemApplicationAccessRestrictionComponent,
    PolicyItemLockScreenConfigurationComponent,
    PolicyItemGoogleAccountConfigurationComponent,
    PolicyItemEmailConfigurationComponent,
    PolicyItemExchangeEmailComponent,
    PolicyItemNotificationConfigurationComponent,
    PolicyItemSsoConfigurationComponent,
    PolicyItemFieldConfigurationComponent,
    PolicyItemMacOsServerConfigurationComponent,
    PolicyItemLdapConfigurationComponent,
    PolicyItemWebContentFilteringComponent,
    PolicyItemMainScreenComponent,
  ],
  entryComponents: [
    PolicySecurityAddIpComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {path: '', redirectTo: '/security', pathMatch: 'full'},
      {path: 'security', component: PolicySecurityComponent, data: {title: '安全策略'}},
      {path: 'device', component: PolicyDeviceComponent, data: {title: '设备策略'}},
      {
        path: 'operate/:system/:operate/:policyType/:id',
        component: PolicyContentOperateComponent,
        data: {title: '设备策略'}
      },
      {path: 'deviceConfig', component: PolicyDeviceConfigComponent, data: {title: '设备配置'}},
      {path: 'fencing', component: PolicyEnclosureComponent, data: {title: '围栏设置'}},
      {path: 'violation', component: PolicyViolationComponent, data: {title: '违规策略'}},
      {path: 'securityDesk', component: PolicyLauncherComponent, data: {title: '安全桌面'}},
      {path: 'url', component: PolicyUrlComponent, data: {title: '违规网址'}},
      {path: 'sensitiveWord', component: PolicyUrlComponent, data: {title: '敏感词'}},
      {path: 'simpleDesk', component: PolicySimpleAppComponent, data: {title: '单一应用'}},
    ])
  ]
})
export class PolicyModule {
}
