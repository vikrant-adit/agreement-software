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

import { RolesService } from '../../../../services/roles/roles.service';
import { UserService } from '../../../../services/users/user.service';
import { PermissionsService } from '../../../../services/permissons/permissions.service';
import { HeaderComponent } from '../../../header/header.component';
import { AuthService } from '../../../../services/auth.service';
@Component({
  standalone: true,
  imports: [
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
  private permissionService = inject(PermissionsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userId: number | null = null;
  roles: any[] = [];
  permissionList: any[] = [];
  viewPermission = false;
  edit=false
  constructor(private fb: FormBuilder,private authService:AuthService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      roleId: [],
      overridePermission: [false],
      extraPermissions: [[]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.edit=true
        this.userId = +id;
        this.getUserDetails(this.userId);
      }else{
        this.edit=false
      }
    });

    this.getRoles();
  }

  selectedPermission:any[]=[]
  getUserDetails(id: number) {
    this.userService.getUser(id).subscribe((user) => {
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        username: user.username,
        roleId: user.role_id,
        overridePermission: user.override_permisson===1?true:false,
        extraPermissions:user.extraPermissions
      });
        if(user.override_permisson==1){
          this.viewPermission=true
        }
      // Password should not be prefilled for security reasons
      this.userForm.get('password')?.setValidators([]);
      this.userForm.get('password')?.updateValueAndValidity();
      this.permissionService.getPermissions().subscribe((permissions) => {
        console.log(permissions,"asdaseqweqweqweqweqwe")
        this.permissionList = permissions.map((permission) => ({
          ...permission,
          checked: user.extraPermissions.includes(permission.id), // Mark selected
        }));
        console.log(this.permissionList)
      });
    
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
  
    console.log("Updated extraPermissions:", this.userForm.value.extraPermissions);
  }
  

  generatePassword(inputElement: HTMLInputElement) {
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
            console.error("Update Error:", err);
          alert(err)
          }
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
            console.error("Create Error:", err);
          alert(err)
          }
        });
      }
    } else {
      alert("Please fill all required fields correctly.");
    }
  }
  
  
  
  

  getRoles() {
    this.roleService.getRoles().subscribe((data) => {
      this.roles = data;
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
      allPermission:any[]=[]
      mappedPermissions:any[]=[]
      selectedRoleId:any
      getRadioInfo(event:any){
        if(event.value){
          if(event.value!=this.selectedRoleId){
           this.userForm.get('extraPermissions')?.setValue([])
            this.selectedRoleId=event.value
          }
        }
        
            this.permissionService.getPermissionsForRole(event.value).subscribe(selectedPermissions => {
        this.selectedPermission = selectedPermissions;
      
        this.permissionService.getPermissions().subscribe(allPermissions => {
          this.allPermission = allPermissions;
      
          // Transform allPermission to mark selected permissions
          this.mappedPermissions = this.allPermission.map(permission => ({
            ...permission,
            checked: this.selectedPermission.some(selected => selected.id === permission.id) // Assuming permissions have an 'id' property
          }));
        });
      });
      }
   
      addExtraPermission(event: any, permissionId: number) {
     
        let selectedPermissions = this.userForm.value.extraPermissions || [];
      
        if (event.checked) {
          if (!selectedPermissions.includes(permissionId)) {
            selectedPermissions.push(permissionId);
              this.mappedPermissions.forEach(perm=>{
            if(perm.id==permissionId){
              perm.checked=event.checked
            }
          })
            
          }
        } else {
          selectedPermissions = selectedPermissions.filter((id: number) => id !== permissionId);
          this.mappedPermissions.forEach(perm=>{
            if(perm.id==permissionId){
              perm.checked=event.checked
            }
          })
        }
      
        // Explicitly patch the updated permissions to ensure form reflects changes
        this.userForm.patchValue({ extraPermissions: [...selectedPermissions] });
      
        console.log("Newly added extraPermissions:", this.userForm.value.extraPermissions);
      }

      hasPermission(permission: string): boolean {
        return this.authService.getUserPermissions().includes(permission);
      }
}
