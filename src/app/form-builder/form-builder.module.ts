import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormComponent} from './form/form.component';
import {ReviewAnswerComponent} from './review-answer/review-answer.component';
import {FormBuilderRoutingModule} from "./form-builder-routing.module";
import {NzModalModule} from "ng-zorro-antd/modal";
import {ReactiveFormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzDividerModule} from "ng-zorro-antd/divider";

@NgModule({
  declarations: [
    FormComponent,
    ReviewAnswerComponent
  ],
  imports: [
    CommonModule,
    NzModalModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzInputModule,
    NzCheckboxModule,
    FormBuilderRoutingModule,
    NzGridModule,
    NzDividerModule,
    NzSpaceModule
  ]
})
export class FormBuilderModule { }
