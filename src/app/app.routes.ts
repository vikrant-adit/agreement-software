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
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';
import { ViewAgreementComponent } from './pages/forms/pre-agreement-form/view-agreement/view-agreement.component';
import { ViewAgreementMultipleComponent } from './pages/forms/pre-agreement-form/view-agreement-multiple/view-agreement-multiple.component';
import { PreAgreementTestComponent } from './pages/forms/pre-agreement-test/pre-agreement-test.component';
import { YourOrderComponent } from './pages/forms/your-order/your-order.component';
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
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path:'users',
    component:UsersComponent,
    canActivate:[AuthGuard],
    data: { permission: 'view_users' }
  },
  {
    path:'update-user/:id',
    component:CreateUserComponent,
     canActivate:[AuthGuard],
     data: { permission: 'edit_users' }
  }, 
  {
    path:'create-user',
    component:CreateUserComponent,
     canActivate:[AuthGuard],
     data: { permission: 'add_users' }
  },
  {
    path:'dashboard',
    component:DashboardComponent,
     canActivate:[AuthGuard],
     data: { permission: 'view_agreements' }
  },
  {
    path:'in-person-lead-form',
    component:InPersonLeadFormComponent,
     canActivate:[AuthGuard],
     data: { permission: 'add_agreements' }
  },
  {
    path:'pre-agreement-welcome',
    component:PreAgreementWelcomeComponent,
     canActivate:[AuthGuard],
     data: { permission: 'add_agreements' }
  },
  {
    path:'pre-agreement-form',
    component:PreAgreementFormComponent,
     canActivate:[AuthGuard],
     data: { permission: 'add_agreements' }
  },
  {
    path:'pre-agreement-form/:id',
    component:PreAgreementFormComponent,
     canActivate:[AuthGuard],
     data: { permission: 'add_agreements' }
  },
  //  {
  //   path:'pre-agreement-form',
  //   component:PreAgreementTestComponent,
  //    canActivate:[AuthGuard],
  //    data: { permission: 'add_agreements' }
  // },
  // {
  //   path:'pre-agreement-form/:id',
  //   component:PreAgreementTestComponent,
  //    canActivate:[AuthGuard],
  //    data: { permission: 'add_agreements' }
  // },
  {
    path:'view-agreement/:agreementId',
    component:ViewAgreementComponent,
    //  canActivate:[AuthGuard],
    //  data: { permission: 'add_agreements' }
  },
  {
    path:'view-agreements/:agreementId',
    component:ViewAgreementMultipleComponent,
    //  canActivate:[AuthGuard],
    //  data: { permission: 'add_agreements' }
  },
  {
    path:'pre-agreement-form-verification',
    component:PreAgreementFormVerificationComponent,
     canActivate:[AuthGuard],
     data: { permission: 'add_agreements' }
  },
  {
    path:'reactivate-form',
    component:ReactivateFormComponent,
     canActivate:[AuthGuard],
     data: { permission: 'add_agreements' }
  },
  {
    path:'upgrade-demo',
    component:UpgradeDemoComponent,
     canActivate:[AuthGuard],
     data: { permission: 'add_agreements' }
  },
  {
    path:'profile',
    component:ProfileComponent,
     canActivate:[AuthGuard],data: { permission: 'view_users' }
  },
  {
    path:'roles',
    component:RoleManageComponent,
     canActivate:[AuthGuard],
     data: { permission: 'view_roles' }
  },
  {
    path:'permissions',
    component:PermissionsComponent,
     canActivate:[AuthGuard],
     data: { permission: 'view_permission' }
  },
  {
    path:'verify-otp',
    component:VerifyOtpComponent,
  },
  {
    path:'settings',
    component:SettingsComponent,
     canActivate:[AuthGuard],
     data: { permission: 'view_settings' }
  },
   {
    path:'agreement/:agreementId',
    component:YourOrderComponent,
    //  canActivate:[AuthGuard],
    //  data: { permission: 'add_agreements' }
  },
  
];
