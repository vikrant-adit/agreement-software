import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './users_management/users/users.component';
import { InPersonLeadFormComponent } from './pages/forms/in-person-lead-form/in-person-lead-form.component';
import { PreAgreementWelcomeComponent } from './pages/forms/pre-agreement-welcome/pre-agreement-welcome.component';
import { CreateUserComponent } from './users_management/users/create-user/create-user.component';
import { PreAgreementFormComponent } from './pages/forms/pre-agreement-form/pre-agreement-form.component';
import { PreAgreementFormVerificationComponent } from './pages/forms/pre-agreement-form-verification/pre-agreement-form-verification.component';
import { ReactivateFormComponent } from './pages/forms/reactivate-form/reactivate-form.component';
import { UpgradeDemoComponent } from './pages/forms/upgrade-demo/upgrade-demo.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RoleManageComponent } from './users_management/role-manage/role-manage.component';
import { PermissionsComponent } from './users_management/permissions/permissions.component';
import { VerifyOtpComponent } from './auth/verify-otp/verify-otp.component';
import { SettingsComponent } from './users_management/settings/settings.component';
import { AuthGuard } from './auth.guard';
export const routes: Routes = [
  {
    path: '',
    pathMatch:'full',
    redirectTo:'dashboard'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path:'users',
    component:UsersComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'dashboard',
    component:DashboardComponent,
     canActivate:[AuthGuard]
  },
  {
    path:'in-person-lead-form',
    component:InPersonLeadFormComponent,
     canActivate:[AuthGuard]
  },
  {
    path:'pre-agreement-welcome',
    component:PreAgreementWelcomeComponent,
     canActivate:[AuthGuard]
  },
  {
    path:'create-user',
    component:CreateUserComponent,
     canActivate:[AuthGuard]
  },
  {
    path:'pre-agreement-form',
    component:PreAgreementFormComponent,
     canActivate:[AuthGuard]
  },
  {
    path:'pre-agreement-form-verification',
    component:PreAgreementFormVerificationComponent,
     canActivate:[AuthGuard]
  },
  {
    path:'reactivate-form',
    component:ReactivateFormComponent,
     canActivate:[AuthGuard]
  },
  {
    path:'upgrade-demo',
    component:UpgradeDemoComponent,
     canActivate:[AuthGuard]
  },
  {
    path:'profile',
    component:ProfileComponent,
     canActivate:[AuthGuard]
  },
  {
    path:'roles',
    component:RoleManageComponent,
     canActivate:[AuthGuard]
  },
  {
    path:'permissions',
    component:PermissionsComponent,
     canActivate:[AuthGuard]
  },
  {
    path:'verify-otp',
    component:VerifyOtpComponent,
  },
  {
    path:'settings',
    component:SettingsComponent,
     canActivate:[AuthGuard]
  },
  {
    path:'update-user/:id',
    component:CreateUserComponent,
     canActivate:[AuthGuard]
  }
  
];
