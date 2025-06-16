import { Component, inject } from '@angular/core';
import { PermissionsService } from '../../../services/permissons/permissions.service';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [FormsModule, MatTabsModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss'
})
export class PermissionsComponent {
  editPermId: number | null = null;
  editPermName: string = '';
  editPermDescription: string = '';
  permissions: any[] = [];
  newPermissionName: string = '';
  newPermissionDescription: string = '';
  roles: any[] = [];
  
  private permissionService = inject(PermissionsService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  ngOnInit() {
    this.loadPermissions();
  }

  startEdit(permission: any) {
    this.editPermId = permission.id;
    this.editPermName = permission.name;
    this.editPermDescription = permission.description;
  }

  updatePermission() {
    if (this.editPermId === null || !this.editPermName.trim() || !this.editPermDescription.trim()) {
      this.toastr.warning('Please fill in all fields');
      return;
    }

    this.permissionService.udpatePermission(this.editPermId, this.editPermName, this.editPermDescription).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Permission updated successfully');
          this.editPermId = null;
          this.editPermName = '';
          this.editPermDescription = '';
          this.loadPermissions();
        }
      },
      error: (error) => {
        this.toastr.error('Failed to update permission');
        console.error('Error updating permission:', error);
      }
    });
  }

  deletePermission(id: number) {
    if (confirm('Are you sure you want to delete this permission?')) {
      this.permissionService.deletePermission(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success('Permission deleted successfully');
            this.loadPermissions();
          }
        },
        error: (error) => {
          this.toastr.error('Failed to delete permission');
          console.error('Error deleting permission:', error);
        }
      });
    }
  }

  loadPermissions() {
    this.permissionService.getPermissions().subscribe({
      next: (res) => {
        if (res.success) {
          this.permissions = res.data;
        }
      },
      error: (error) => {
        this.toastr.error('Failed to load permissions');
        console.error('Error loading permissions:', error);
      }
    });
  }

  addPermission() {
    if (!this.newPermissionName.trim()) {
      this.toastr.warning('Please enter a permission name');
      return;
    }

    this.permissionService.addPermission(this.newPermissionName, this.newPermissionDescription).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Permission added successfully');
          this.newPermissionName = '';
          this.newPermissionDescription = '';
          this.loadPermissions();
        }
      },
      error: (error) => {
        this.toastr.error('Failed to add permission');
        console.error('Error adding permission:', error);
      }
    });
  }

  assignPermission(roleId: number, permissionIds: number[]) {
    this.permissionService.assignPermissions(roleId, permissionIds).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Permissions assigned successfully');
        }
      },
      error: (error) => {
        this.toastr.error('Failed to assign permissions');
        console.error('Error assigning permissions:', error);
      }
    });
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}
