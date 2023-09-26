import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'forms',
    loadChildren: () => import('./form-builder/form-builder.module').then(m => m.FormBuilderModule)
  },
  {
    path: '',
    redirectTo: '/forms/builder',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
