import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../../services/roles/roles.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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

  constructor(private roleService: RolesService) {}

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
}
