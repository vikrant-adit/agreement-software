import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RolesService } from '../../../../services/roles/roles.service';
import { UserService } from '../../../../services/users/user.service';
import { HeaderComponent } from '../../../header/header.component';
import { AuthService } from '../../../../services/auth.service';

interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions: Permission[];
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

@Component({
  standalone: true,
  imports: [
    MatTooltipModule,
    HeaderComponent,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatRadioModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  private roleService = inject(RolesService);
  private userService = inject(UserService);
  // private permissionService = inject(PermissionsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userId: number | null = null;
  roles: Role[] = [];
  rolesList: any[] = [];
  permissionList: any[] = [];
  viewPermission = false;
  edit = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role_id: [],
      overridePermission: [false],
      extraPermissions: [[]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.edit = true;
        this.userId = +id;
        this.getUserDetails(this.userId);
      } else {
        this.edit = false;
      }
    });

    this.getRoles();
  }

  selectedPermission: any[] = [];
  getUserDetails(id: number) {
    this.userService.getUser(id).subscribe((user) => {
      this.userForm.patchValue({
        name: user.data.name,
        email: user.data.email,
        username: user.data.username,
        role_id: user.data.role.id,
        // overridePermission: user.data.override_permisson === 1 ? true : false,
        // extraPermissions: user.data.extraPermissions,
      });
     const mockEvent = { value: user.data.role.id };
    this.getRadioInfo(mockEvent);
      // if (user.override_permisson == 1) {
      //   this.viewPermission = true;
      // }
      // Password should not be prefilled for security reasons
      this.userForm.get('password')?.setValidators([]);
      this.userForm.get('password')?.updateValueAndValidity();
      // this.permissionService.getPermissions().subscribe((permissionsData: any) => {
      //   let permissions = permissionsData.data;
      //   console.log(permissions, 'asdaseqweqweqweqweqwe');
      //   this.permissionList = permissions.map((permission: any) => ({
      //     ...permission,
      //     checked: user.extraPermissions.includes(permission.id), // Mark selected
      //   }));
      //   console.log(this.permissionList);
      // });
    });
  }

  onCheckboxChange(event: any, permissionId: number) {
    let selectedPermissions = this.userForm.value.extraPermissions || [];

    if (event.checked) {
      if (!selectedPermissions.includes(permissionId)) {
        selectedPermissions.push(permissionId);
      }
    } else {
      selectedPermissions = selectedPermissions.filter((id: number) => id !== permissionId);
    }

    // Explicitly patch the updated permissions to ensure form reflects changes
    this.userForm.patchValue({ extraPermissions: [...selectedPermissions] });

    console.log('Updated extraPermissions:', this.userForm.value.extraPermissions);
  }

  generatePassword(inputElement: HTMLInputElement) {0
    const tempPassword = Math.random().toString(36).slice(-8);
    this.userForm.patchValue({ password: tempPassword });

    if (inputElement) {
      inputElement.value = tempPassword;
    }
  }

  submitUser() {
    if (this.userForm.valid) {
      if (this.userId) {
        // Update user
        this.userService.updateUser(this.userId, this.userForm.value).subscribe({
          next: (res) => {
            alert(res.message);
            this.router.navigate(['/users']); // Redirect after update
          },
          error: (err) => {
            console.error('Update Error:', err);
            alert(err);
          },
        });
      } else {
        // Create new user
        this.userService.createUser(this.userForm.value).subscribe({
          next: (res) => {
            alert(res.message);
            this.userForm.reset();
            this.router.navigate(['/users']); // Redirect after creation
          },
          error: (err) => {
            console.error('Create Error:', err);
            alert(err);
          },
        });
      }
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  getRoles() {
    this.roleService.getRoleswithPermissions().subscribe((response: any) => {
      if (response.success) {
        this.roles = response.data.roles;
        this.rolesList = response.data.rolesList;
        
        // Process allPermissions from the response
        if (response.data.allPermissions && Array.isArray(response.data.allPermissions)) {
          // Store allPermissions in component property
          this.allPermission = response.data.allPermissions;
          
          // Map permissions with checked status (all false by default)
          this.mappedPermissions = response.data.allPermissions.map((permission: any) => ({
            ...permission,
            checked: false
          }));
          
          // If we're in edit mode and a role is already selected, check permissions accordingly
          if (this.selectedRoleId && this.edit) {
            const selectedRole = this.roles.find(role => role.id === this.selectedRoleId);
            if (selectedRole && selectedRole.permissions) {
              const rolePermissionIds = selectedRole.permissions.map(p => p.id);
              
              // Mark permissions as checked if they belong to the selected role
              this.mappedPermissions.forEach(permission => {
                permission.checked = rolePermissionIds.includes(permission.id);
              });
            }
          }
          
          console.log('Mapped permissions:', this.mappedPermissions);
        }
        
        console.log(this.rolesList, 'rolesList');
        console.log(this.roles, 'roles');
      }
    });
  }

  override() {
    this.viewPermission = !this.viewPermission;
    if (this.viewPermission) {
      this.userForm.get('overridePermission')?.setValue(true);
    } else {
      this.userForm.get('overridePermission')?.setValue(false);
    }
  }

  //get permission for selected role
  allPermission: any[] = [];
  mappedPermissions: any[] = [];
  selectedRoleId: any;
  getRadioInfo(event: any) {
    console.log(event, 'event');
    if (event.value) {
      if (event.value != this.selectedRoleId) {
        // Reset extraPermissions when role changes
        this.userForm.get('extraPermissions')?.setValue([]);
        this.selectedRoleId = event.value;
        
        // Find the selected role object
        const selectedRole = this.roles.find(role => role.id === this.selectedRoleId);
        
        if (selectedRole && selectedRole.permissions) {
          // Get IDs of permissions assigned to this role
          const rolePermissionIds = selectedRole.permissions.map(p => p.id);
          
          // Update mappedPermissions to reflect the role's permissions
          this.mappedPermissions.forEach(permission => {
            // Set checked to true if the permission is in the role's permissions
            permission.checked = rolePermissionIds.includes(permission.id);
          });
          
          // If we want to prefill extraPermissions with the role's permissions
          // (useful if override is enabled by default)
          if (this.viewPermission) {
            this.userForm.get('extraPermissions')?.setValue([...rolePermissionIds]);
          }
          
          console.log('Updated permissions based on role selection:', this.mappedPermissions);
        } else {
          // If no role found or no permissions for role, reset all to unchecked
          this.mappedPermissions.forEach(permission => {
            permission.checked = false;
          });
        }
      }
    }
  }

  addExtraPermission(event: any, permissionId: number) {
    let selectedPermissions = this.userForm.value.extraPermissions || [];

    if (event.checked) {
      if (!selectedPermissions.includes(permissionId)) {
        selectedPermissions.push(permissionId);
        this.mappedPermissions.forEach((perm) => {
          if (perm.id == permissionId) {
            perm.checked = event.checked;
          }
        });
      }
    } else {
      selectedPermissions = selectedPermissions.filter((id: number) => id !== permissionId);
      this.mappedPermissions.forEach((perm) => {
        if (perm.id == permissionId) {
          perm.checked = event.checked;
        }
      });
    }

    // Explicitly patch the updated permissions to ensure form reflects changes
    this.userForm.patchValue({ extraPermissions: [...selectedPermissions] });

    console.log('Newly added extraPermissions:', this.userForm.value.extraPermissions);
  }

  hasPermission(permission: string): boolean {
    return this.authService.getUserPermissions().includes(permission);
  }
}
