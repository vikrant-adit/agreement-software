// import { Component, inject } from '@angular/core';
// import { PermissionsService } from '../../../services/permissons/permissions.service';
// import { FormsModule } from '@angular/forms';
// import { RolesService } from '../../../services/roles/roles.service';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// interface Permission {
//   id: number;
//   name: string;
//   description: string;
// }
// @Component({
//   selector: 'app-permissions',
//   standalone: true,
//   imports: [FormsModule,MatTabsModule, MatCheckboxModule],
//   templateUrl: './permissions.component.html',
//   styleUrl: './permissions.component.scss'
// })
// export class PermissionsComponent {
//   permissions: any[] = [];
//   newPermissionName: string = '';
//   newPermissionDescription: string = '';
//   selectedRoleId: number | null = null;
//   rolePermissions: any[] = [];
//   roles: any[] = [];
//   roleService=inject(RolesService);
//   constructor(private permissionService: PermissionsService) {}
//   loadRoles() {
//    this.roleService.getRoles().subscribe(data => {
//       this.roles = data;
//     });
//   }
//   ngOnInit() {
//     this.loadRoles()
//     this.loadPermissions();
   
//   }

//   loadPermissions() {
//     this.permissionService.getPermissions().subscribe(data => {
//       this.permissions = data;
//     });
//   }

//   addPermission() {
//     if (!this.newPermissionName.trim()) return;
//     this.permissionService.addPermission(this.newPermissionName, this.newPermissionDescription).subscribe(() => {
//       this.newPermissionName = '';
//       this.newPermissionDescription = '';
//       this.loadPermissions();
//     });
//   }

//   loadRolePermissions() {
//     if (!this.selectedRoleId) return;
//     this.permissionService.getPermissionsForRole(this.selectedRoleId).subscribe(data => {
//       this.rolePermissions = data;
//     });
//   }
//   permissionsMap: { [roleId: number]: Permission[] } = {};

//   onCheckboxChange(event: any, roleId: number, permissionId: number[]) {
//     if (event.checked) {
//       // Assign the permission
//       this.assignPermission(roleId, permissionId);
//     }
//   }
  
//   assignPermission(roleId: number, permissionId: number[]) {
//     this.permissionService.assignPermissions(roleId, permissionId).subscribe(() => {
//       console.log(`Permission ${permissionId} assigned to Role ${roleId}`);
//     });
//   }
  

//   isPermissionAssigned(permissionId: number): boolean {
//     return this.rolePermissions.some(permission => permission.id === permissionId);
//   }
  
//   assignPermissions(permissionIds: number[]) {
//     if (!this.selectedRoleId || permissionIds.length === 0) {
//       alert("Please select a role and at least one permission.");
//       return;
//     }

//     this.permissionService.assignPermissions(this.selectedRoleId, permissionIds).subscribe(() => {
//       this.loadRolePermissions();
//     });
//   }

//   getSelectedPermissions(): number[] {
//     const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked');
//     return Array.from(checkboxes).map(checkbox => Number(checkbox.value));
//   }
  
// }
import { Component, OnInit } from '@angular/core';
import { PermissionsService } from '../../../services/permissons/permissions.service';
import { RolesService } from '../../../services/roles/roles.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [MatTabsModule, MatCheckboxModule, FormsModule,ReactiveFormsModule],
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  roles: any[] = [];
  permissionList: any[] = [];
  permissionsMap: { [roleId: number]: any[] } = {}; // Stores assigned permissions per role

  constructor(
    private roleService: RolesService,
    private permissionService: PermissionsService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadAllPermissions();
  }

  // Fetch all roles
  loadRoles() {
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
      this.loadPermissionsForRoles(); // Load permissions for each role after fetching roles
    });
  }

  // Fetch all permissions
  loadAllPermissions() {
    this.permissionService.getPermissions().subscribe(data => {
      this.permissionList = data;
    });
  }

  // Fetch permissions for each role
  loadPermissionsForRoles() {
    this.roles.forEach(role => {
      this.permissionService.getPermissionsForRole(role.id).subscribe(data => {
        this.permissionsMap[role.id] = data;
      });
    });
  }

  // Check if a permission is already assigned to a role
  isPermissionAssigned(roleId: number, permissionId: number): boolean {
    return this.permissionsMap[roleId]?.some(p => p.id === permissionId);
  }

  // Handle checkbox change
  onCheckboxChange(event: any, roleId: number, permissionId: number[]) {
    if (event.checked) {
      this.assignPermission(roleId, permissionId);
    } else {
      // this.removePermission(roleId, permissionId);
    }
  }

  // API call to assign permission to a role
  assignPermission(roleId: number, permissionId: number[]) {
    this.permissionService.assignPermissions(roleId, permissionId).subscribe(() => {
      console.log(`Permission ${permissionId} assigned to Role ${roleId}`);
      this.loadPermissionsForRoles(); // Refresh the assigned permissions
    });
  }

  // API call to remove permission from a role
  // removePermission(roleId: number, permissionId: number) {
  //   this.permissionService.removePermissionFromRole(roleId, permissionId).subscribe(() => {
  //     console.log(`Permission ${permissionId} removed from Role ${roleId}`);
  //     this.loadPermissionsForRoles(); // Refresh the assigned permissions
  //   });
  // }
}
