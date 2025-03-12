// users.component.ts
import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { UsersInterface } from '../../../interfaces/users.interface';
import { UserService } from '../../../services/users/user.service';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, map, Observable, Subject, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
@Component({
    selector: 'app-dashboard',
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [DatePipe, HeaderComponent, MatIconModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatToolbarModule, MatTableModule, MatPaginatorModule, MatSelectModule, MatDatepickerModule],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
    // displayedColumns: string[] = ['id', 'name', 'email', 'designation', 'user_group', 'created_at', 'actions'];
    displayedColumns: string[] = ['id', 'name', 'email', 'created_at', 'actions'];

    dataSource = new MatTableDataSource<UsersInterface>;
    totalRecords: number = 0;
    pageSize: number = 10;
    currentPage: number = 1;
    pageSizeOptions: number[] = [5, 10, 20];
    searchTerm: string = '';
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    private searchSubject: Subject<string> = new Subject<string>();
   private authService =inject(AuthService);

    constructor(private userService: UserService,private toasterService:ToastrService,private router:Router) { }

    ngOnInit() {
        this.loadUsers();
        this.setupSearch();
    }

     loadUsers(): void {
        this.fetchUsers(this.currentPage, this.pageSize, this.searchTerm);
    }

     fetchUsers(page: number, pageSize: number, searchTerm: string = ''): void {
        this.userService.getUsers(page, pageSize, searchTerm).subscribe({
          next: res => {
            this.updateTableData(res.data, res.total, page, pageSize);
        },
          error: (error) => {
            this.showErrorToast(error);
          }
        }
       );
    }

     updateTableData(data: UsersInterface[], total: number, page: number, pageSize: number): void {
        this.dataSource.data = data;
        this.totalRecords = total;
        this.updatePaginator(total, page, pageSize);
    }

     updatePaginator(total: number, page: number, pageSize: number): void {
        if (this.paginator) {
            this.paginator.length = total;
            this.paginator.pageIndex = page - 1;
            this.paginator.pageSize = pageSize;
        }
    }

     setupSearch(): void {
        this.searchSubject
            .pipe(
                debounceTime(600),
                distinctUntilChanged(),
                switchMap((searchTerm: string) => this.userService.getUsers(this.currentPage, this.pageSize, searchTerm))
            )
            .subscribe({
          next: res => {
            this.updateTableData(res.data, res.total, this.currentPage, this.pageSize);
        },
          error: (error) => {
            this.showErrorToast(error);
          }
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchTerm = filterValue.trim().toLowerCase();
        this.searchSubject.next(this.searchTerm);
    }

    pageChanged(event: any): void {
        this.currentPage = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.loadUsers();
    }
    showErrorToast(errorMessage: string): void {
      this.toasterService.error(errorMessage, 'Error');
    }

    createForm(){
      this.router.navigate(['/create-user'])
    }

    editUser(id:any){
      this.router.navigate(['/update-user',id])
    }
    deleteUser(id:any){
      this.userService.deleteUser(id).subscribe(res=>{
        this.toasterService.success(res.message)
      })
    }
    hasPermission(permission: string): boolean {
      return this.authService.getUserPermissions().includes(permission);
    }
    
}