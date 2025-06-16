import { Component, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { UserService } from '../../../../services/users/user.service';
import { EventRepsService } from '../../../../services/system-setting/event-reps.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-system-setting',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,NgxMatSelectSearchModule,MatSelectModule, MatIconModule, MatTooltipModule],
  templateUrl: './system-setting.component.html',
  styleUrl: './system-setting.component.scss'
})
export class SystemSettingComponent {
  users: any[] = [];
  userSearched: any;
  userList: any[] = [];
  
  constructor(private toastr: ToastrService) {}
  private searchTerms = new Subject<string>();
  private userService = inject(UserService);
  private eventService = inject(EventRepsService);

  ngOnInit(): void {
    this.loadUsers();

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.userService.getUsers(1, 10, term))
    ).subscribe(users => {
      this.users = users.data;
    });
  }

  search(event: Event): void {
    let searchTerm = (event.target as HTMLInputElement).value;
    this.searchTerms.next(searchTerm);
  }

  loadUsers(): void {
    this.eventService.getUsers().subscribe({
      next: (res) => {
        if (res.success) {
          this.userList = res.data;
        }
      },
      error: (error) => {
        this.toastr.error('Failed to load users');
        console.error('Error loading users:', error);
      }
    });
  }

  addUser(event: any): void {
    if (!event.value) return;
    
    this.eventService.addEventRep(event.value.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('User added successfully');
          this.loadUsers();
        }
      },
      error: (error) => {
        this.toastr.error('Failed to add user');
        console.error('Error adding user:', error);
      }
    });
  }

  deleteUser(id: number): void {
    this.eventService.deleteEventRep(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success('User deleted successfully');
          this.loadUsers();
        }
      },
      error: (error) => {
        this.toastr.error('Failed to delete user');
        console.error('Error deleting user:', error);
      }
    });
  }
}
