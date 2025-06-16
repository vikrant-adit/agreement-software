import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { MatTabsModule } from '@angular/material/tabs';
import { RoleManageComponent } from "../role-manage/role-manage.component";
import { SystemSettingComponent } from './system-setting/system-setting.component';
import { PermissionsComponent } from '../permissions/permissions.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HeaderComponent, MatTabsModule, RoleManageComponent,PermissionsComponent,SystemSettingComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

}
