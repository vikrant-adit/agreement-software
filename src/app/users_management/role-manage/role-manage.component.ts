import { Component, inject, OnInit } from '@angular/core';
import { RolesService } from '../../../services/roles/roles.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { AssignPermissionComponent } from './assign-permission/assign-permission.component';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role-manage',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './role-manage.component.html',
  styleUrl: './role-manage.component.scss'
})
export class RoleManageComponent implements OnInit {
  roles: any[] = [];
  newRole: string = '';
  editRoleId: number | null = null;
  editRoleName: string = '';
  private authService = inject(AuthService);

  constructor(
    private roleService: RolesService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (res) => {
        if (res.success) {
          this.roles = res.data;
        }
      },
      error: (error) => {
        this.toastr.error('Failed to load roles');
        console.error('Error loading roles:', error);
      }
    });
  }

  addRole() {
    if (!this.newRole.trim()) {
      this.toastr.warning('Please enter a role name');
      return;
    }

    this.roleService.addRole(this.newRole).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Role added successfully');
          this.newRole = '';
          this.loadRoles();
        }
      },
      error: (error) => {
        this.toastr.error('Failed to add role');
        console.error('Error adding role:', error);
      }
    });
  }

  startEdit(role: any) {
    this.editRoleId = role.id;
    this.editRoleName = role.name;
  }

  updateRole() {
    if (this.editRoleId === null || !this.editRoleName.trim()) {
      this.toastr.warning('Please enter a role name');
      return;
    }

    this.roleService.updateRole(this.editRoleId, this.editRoleName).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Role updated successfully');
          this.editRoleId = null;
          this.editRoleName = '';
          this.loadRoles();
        }
      },
      error: (error) => {
        this.toastr.error('Failed to update role');
        console.error('Error updating role:', error);
      }
    });
  }

  deleteRole(id: number) {
    if (confirm('Are you sure you want to delete this role?')) {
      this.roleService.deleteRole(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success('Role deleted successfully');
            this.loadRoles();
          }
        },
        error: (error) => {
          this.toastr.error('Failed to delete role');
          console.error('Error deleting role:', error);
        }
      });
    }
  }

  managePermission(id: number) {
    const dialogRef = this.dialog.open(AssignPermissionComponent, {
      minWidth: '30vw',
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
      }
    });
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}
