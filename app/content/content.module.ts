import {NgModule} from "@angular/core";
import {ContentComponent} from "./content.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {ContentAllFilesComponent} from "./component/all-files/content-all-files.component";
import {ContentAudioFilesComponent} from "./component/audio-files/content-audio-files.component";
import {ContentPictureFilesComponent} from "./component/picture-files/content-picture-files.component";
import {ContentVideoFilesComponent} from "./component/video-files/content-video-files.component";
import {ContentOtherFilesComponent} from "./component/other-files/content-other-files.component";
import {ContentRecycleBinComponent} from "./component/recycle-bin/content-recycle-bin.component";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpInterceptorService} from "../shared/service/http-interceptor.service";
import * as service from "./content.service";
import {ContentDistributeTableComponent} from "./component/common/content-distribute-table.component";
import {ContentRecycleBinTableComponent} from "./component/recycle-bin/content-recycle-bin-table.component";
import {ContentAllFilesTableComponent} from "./component/all-files/content-all-files-table.component";
import {ContentTagsAllComponent} from "./component/common/content-tags-all.component";
import {ContentTagsEditComponent} from "./component/common/content-tags-edit.component";
import {ContentUploadFilesComponent} from "./component/common/content-upload-files.component";
import {FileUploadModule} from "ng2-file-upload";
import {ContentFolderTreeComponent} from "./component/common/content-folder-tree.component";
import {ContentPermission, ContentTypeToIcon} from "./content.pipe";
@NgModule({
  declarations: [
    ContentComponent,
    ContentAllFilesComponent,
    ContentAudioFilesComponent,
    ContentPictureFilesComponent,
    ContentVideoFilesComponent,
    ContentOtherFilesComponent,
    ContentRecycleBinComponent,
    ContentAllFilesTableComponent,
    ContentRecycleBinTableComponent,
    ContentDistributeTableComponent,
    ContentTagsAllComponent,
    ContentTagsEditComponent,
    ContentFolderTreeComponent,
    ContentUploadFilesComponent,
    ContentTypeToIcon,
    ContentPermission,
  ],
  entryComponents: [
    ContentTagsAllComponent,
    ContentTagsEditComponent,
    ContentFolderTreeComponent,
    ContentUploadFilesComponent
  ],
  providers: [
    service.ContentFilesHttpService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}
  ],
  imports: [
    SharedModule,
    FileUploadModule,
    RouterModule.forChild(
      [
        {
          path: '',
          data: {title: '内容管理'},
          component: ContentComponent
        }
      ]
    )
  ]
})
export class ContentModule {
}
