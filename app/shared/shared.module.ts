import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {TranslateModule} from "@ngx-translate/core";
import {CustomScrollbarDirective} from "./custom-scrollbar/custom-scrollbar.directive";
import {CustomFormComponent} from "./custom-form/custom-form.component";
import {MapTrailComponent} from "./custom-map/map-trail.component";
import {CustomSearchComponent} from "./custom-search/custom-search.component";
import {ApplicationListWidgetComponent} from "./component/application-list-widget.component";
import {ImportFileComponent} from "./component/import-file.component";
import {ExportFileComponent} from "./component/export-file.component";
import {CustomSelectGroupComponent} from "./custom-form/custom-select-group.component";
import {FileUploadModule} from "ng2-file-upload";
import {DaySelectComponent} from "./component/day-select.component";
import {MapGeoEnclosureComponent} from "./custom-map/map-geo-enclosure.component";
import {CustomTransferComponent} from "./custom-transfer/custom-transfer.component";
import {DeviceGroupComponent} from "../device/device-group/device-group.component";
import {ApplicationListComponent} from "./component/application-list.component";
import {AppStoreListComponent} from "./component/app-store-list.component";
import {DeviceListComponent} from "../device/device/device-list.component";
import {DeviceDetailComponent} from "../device/device-detail.component";
import {DeviceGroupFormComponent} from "../device/device-group/device-group-form.component";
import {ModifyPasswordComponent} from "./component/modify-password.component";
import {CustomFormItemValuePipe} from "./custom-form/custom-form.pipe";
import {FileSizePipe} from "./shared.pipe";
import {CommandStatePipe, PolicyPipe, IllegalPolicy, IllegalPipe} from "./pipe/policy.pipe";
import {DeviceRemoteComponent} from "./component/device-remote.component";
import {DeviceDirectiveComponent} from "./component/device-directive.component";
import {PermissionDirective} from "./directive/permission.directive";
import {ButtonClickDirective} from "./directive/button-click.directive";
@NgModule({
  declarations: [
    CustomScrollbarDirective,
    ExportFileComponent,
    ImportFileComponent,
    CustomFormComponent,
    CustomSearchComponent,
    MapTrailComponent,
    MapGeoEnclosureComponent,
    ApplicationListWidgetComponent,
    CustomSelectGroupComponent,
    DaySelectComponent,
    CustomTransferComponent,
    DeviceGroupComponent,
    ApplicationListComponent,
    AppStoreListComponent,
    DeviceListComponent,
    DeviceDetailComponent,
    DeviceGroupFormComponent,
    ModifyPasswordComponent,
    CustomFormItemValuePipe,
    FileSizePipe,
    PolicyPipe,
    IllegalPolicy,
    IllegalPipe,
    CommandStatePipe,
    DeviceRemoteComponent,
    DeviceDirectiveComponent,
    PermissionDirective,
    ButtonClickDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    TranslateModule,
    FileUploadModule
  ],
  entryComponents: [
    ExportFileComponent,
    ImportFileComponent,
    MapTrailComponent,
    MapGeoEnclosureComponent,
    CustomFormComponent,
    CustomSelectGroupComponent,
    CustomTransferComponent,
    ApplicationListComponent,
    AppStoreListComponent,
    DeviceGroupFormComponent,
    ModifyPasswordComponent,
    DeviceRemoteComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    TranslateModule,
    CustomScrollbarDirective,
    ExportFileComponent,
    ImportFileComponent,
    CustomFormComponent,
    FileSizePipe,
    CustomSearchComponent,
    MapTrailComponent,
    MapGeoEnclosureComponent,
    ApplicationListWidgetComponent,
    CustomSelectGroupComponent,
    DaySelectComponent,
    CustomTransferComponent,
    DeviceGroupComponent,
    ApplicationListComponent,
    AppStoreListComponent,
    DeviceListComponent,
    DeviceDetailComponent,
    DeviceGroupFormComponent,
    ModifyPasswordComponent,
    DeviceRemoteComponent,
    DeviceDirectiveComponent,
    PermissionDirective,
    ButtonClickDirective
  ]
})
export class SharedModule {}
