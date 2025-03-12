import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PermissionsService } from '../../../../services/permissons/permissions.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-assign-permission',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule,MatCheckboxModule],
  templateUrl: './assign-permission.component.html',
  styleUrl: './assign-permission.component.scss'
})
export class AssignPermissionComponent implements OnInit {
    readonly dialogRef = inject(MatDialogRef<AssignPermissionComponent>);
    readonly data = inject(MAT_DIALOG_DATA);
    private permissionService = inject(PermissionsService)
    allPermission:any[]=[]
    selectedPermission:any[]=[]
    mappedPermissions:any[]=[]
    ngOnInit(): void {
      console.log(this.data)
      this.permissionService.getPermissionsForRole(this.data).subscribe(selectedPermissions => {
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

    updatePermissions() {
      const selectedPermissionIds = this.mappedPermissions
        .filter(permission => permission.checked) // Get only checked ones
        .map(permission => permission.id); // Extract their IDs
    
      const roleId = this.data; // Assuming 'this.data' holds the role ID
    
      this.assignPermission(roleId, selectedPermissionIds);

    }
    
    assignPermission(roleId: number, permissionIds: number[]) {
      this.permissionService.assignPermissions(roleId, permissionIds).subscribe(() => {
        alert(`Permissions assigned to Selected Role Id ${roleId}`);
        this.dialogRef.close()
      });
    }
    
    addNremovePermission(event:any, id:any){
        this.mappedPermissions.forEach(perm=>{
          if(perm.id==id){
            perm.checked=event.checked
          }
        })
    }
}
