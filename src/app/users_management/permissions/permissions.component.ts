import { Component } from '@angular/core';
import { PermissionsService } from '../../../services/permissons/permissions.service';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [FormsModule,MatTabsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,MatButtonModule],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss'
})
export class PermissionsComponent {
  editPermId: number | null = null;
  editPermName: string = '';
  editPermDescription:string=''
  permissions: any[] = [];
  newPermissionName: string = '';
  newPermissionDescription: string = '';
  roles: any[] = [];
  constructor(private permissionService: PermissionsService,private authService:AuthService) {}

  ngOnInit() {
    this.loadPermissions();
   
  }
  startEdit(role: any) {
    this.editPermId = role.id;
    this.editPermName = role.name;
    this.editPermDescription=role.description
  }

  updatePermission() {
    if (this.editPermId === null || !this.editPermName.trim() || !this.editPermDescription.trim()) return;
    this.permissionService.udpatePermission(this.editPermId, this.editPermName, this.editPermDescription).subscribe(() => {
      this.editPermId = null;
      this.editPermName = '';
           this.loadPermissions();

    });
  }

  deletePermission(id: number) {
    this.permissionService.deletePermission(id).subscribe(() => {
           this.loadPermissions();

    });
  }
  loadPermissions() {
    this.permissionService.getPermissions().subscribe((res:any) => {
      this.permissions = res.data;
    });
  }

  addPermission() {
    if (!this.newPermissionName.trim()) return;
    this.permissionService.addPermission(this.newPermissionName).subscribe(() => {
      this.newPermissionName = '';
      // this.newPermissionDescription = '';
      this.loadPermissions();
    });
  }

 
  
  assignPermission(roleId: number, permissionId: number[]) {
    this.permissionService.assignPermissions(roleId, permissionId).subscribe(() => {
      console.log(`Permission ${permissionId} assigned to Role ${roleId}`);
    });
  }
  
  hasPermission(permission: string): boolean {
    return this.authService.getUserPermissions().includes(permission);
  }

}
