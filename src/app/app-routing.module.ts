import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StudentsComponent } from './students/students.component';
import { StudentStartComponent } from './students/student-start/student-start.component';
import { StudentDetailComponent } from './students/student-detail/student-detail.component';
import { StudentEditComponent } from './students/student-edit/student-edit.component';
import { CanDeactivateGuard } from './services/guards/can-deactivate-guard.service';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/guards/auth-guard.service';
import { LoginGuard } from './services/guards/login-guard.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'students', component: StudentsComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: StudentStartComponent },
      { path: 'new', component: StudentEditComponent, canDeactivate: [CanDeactivateGuard] },
      { path: ':id', component: StudentDetailComponent },
      { path: ':id/edit', component: StudentEditComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard, AuthGuard, LoginGuard]
})
export class AppRoutingModule {

}
