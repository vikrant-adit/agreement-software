import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PermissionsService } from '../../../../services/permissons/permissions.service';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-permission',
  standalone: true,
  imports: [FormsModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './assign-permission.component.html',
  styleUrl: './assign-permission.component.scss'
})
export class AssignPermissionComponent implements OnInit {
  permissions: any[] = [];
  assignedPermissions: string[] = [];
  role: any;
  selectedPermissions: number[] = [];

  constructor(
    private dialogRef: MatDialogRef<AssignPermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private permissionService: PermissionsService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadRolePermissions();
  }

  loadRolePermissions() {
    this.permissionService.getPermissionsForRole(this.data).subscribe({
      next: (res) => {
        if (res.success) {
          this.role = res.data.role;
          this.permissions = res.data.permissions;
          this.assignedPermissions = res.data.assignedPermissions;
          
          // Set initial selected permissions
          this.selectedPermissions = this.permissions
            .filter(p => this.assignedPermissions.includes(p.name))
            .map(p => p.id);
        }
      },
      error: (error) => {
        this.toastr.error('Failed to load role permissions');
        console.error('Error loading role permissions:', error);
      }
    });
  }

  onPermissionChange(permissionId: number, checked: boolean) {
    if (checked) {
      this.selectedPermissions.push(permissionId);
    } else {
      const index = this.selectedPermissions.indexOf(permissionId);
      if (index > -1) {
        this.selectedPermissions.splice(index, 1);
      }
    }
  }

  savePermissions() {
    this.permissionService.assignPermissions(this.data, this.selectedPermissions).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('Permissions assigned successfully');
          this.dialogRef.close(true);
        }
      },
      error: (error) => {
        this.toastr.error('Failed to assign permissions');
        console.error('Error assigning permissions:', error);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
