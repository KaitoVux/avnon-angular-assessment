import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormComponent} from "./form/form.component";
import {ReviewAnswerComponent} from "./review-answer/review-answer.component";


const routes: Routes = [
  {
    path: 'builder',
    component: FormComponent
  },
  {
    path: 'answers',
    component: ReviewAnswerComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormBuilderRoutingModule {
}
