import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularComponent } from './formular/formular.component';

const routes: Routes = [
  {path: 'v', component: FormularComponent},
  {
    path: '',
    redirectTo: 'v',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
