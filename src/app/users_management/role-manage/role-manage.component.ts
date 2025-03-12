import { Component, inject, OnInit } from '@angular/core';
import { RolesService } from '../../../services/roles/roles.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { AssignPermissionComponent } from './assign-permission/assign-permission.component';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-role-manage',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatInputModule,MatFormFieldModule],
  templateUrl: './role-manage.component.html',
  styleUrl: './role-manage.component.scss'
})
export class RoleManageComponent implements OnInit {
  roles: any[] = [];
  newRole: string = '';
  editRoleId: number | null = null;
  editRoleName: string = '';
  private authService=inject(AuthService)
  constructor(private roleService: RolesService, private dialog:MatDialog) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  addRole() {
    if (!this.newRole.trim()) return;
    this.roleService.addRole(this.newRole).subscribe(() => {
      this.newRole = '';
      this.loadRoles();
    });
  }

  startEdit(role: any) {
    this.editRoleId = role.id;
    this.editRoleName = role.name;
  }

  updateRole() {
    if (this.editRoleId === null || !this.editRoleName.trim()) return;
    this.roleService.updateRole(this.editRoleId, this.editRoleName).subscribe(() => {
      this.editRoleId = null;
      this.editRoleName = '';
      this.loadRoles();
    });
  }

  deleteRole(id: number) {
    this.roleService.deleteRole(id).subscribe(() => {
      this.loadRoles();
    });
  }
  managePermission(id:number){
    this.dialog.open(AssignPermissionComponent,
      {
        minWidth:'30vw',
        data:id
      }
    )
  }
  hasPermission(permission: string): boolean {
    return this.authService.getUserPermissions().includes(permission);
  }
  
}
