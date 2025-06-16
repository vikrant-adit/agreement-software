import { Component, inject, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Dashboard } from '../../../interfaces/dashboard.interface';
import { DashboardService } from '../../../services/dashboard//dashboard.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {MatDialogModule, MatDialog} from '@angular/material/dialog'
import { SelectColumnDialogComponent } from './select-column-dialog/select-column-dialog.component';
import { mockData } from '../../../assets/mock-data/mock-data';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    DatePipe,
    MatCheckboxModule,
    MatDialogModule,
    HeaderComponent,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(
    private dashboardService: DashboardService,
    private route: Router,
    private toasterService: ToastrService,
    // private dialog_box:MatDialog
  ) {}
  // displayedColumns: string[] = [
  //   'created_at',
  //   'sales_person_account_name',
  //   'sales_person_name',
  //   'multi_locations',
  //   'display_pricing',
  //   'display_techstack',
  //   'sales_person_promotion_type',
  //   'sales_person_client',
  //   'sales_person_email',
  //   'user_type',
  //   'activation_fee',
  //   'monthly_orginal_tech_bundle_price',
  //   'monthly_discnt_tech_bundle_price',
  //   'monthly_orginal_analytic_bundle_price',
  //   'monthly_discnt_analytic_bundle_price',
  //   'annual_orginal_tech_bundle_price',
  //   'annual_discnt_tech_bundle_price',
  //   'annual_orginal_analytic_bundle_price',
  //   'annual_discnt_analytic_bundle_price',
  //   'status',
  //   'action',
  // ];
  dataSource = new MatTableDataSource<Dashboard>();
  selected = '';
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 20];
  searchTerm: string = ''; // Search term
  private searchSubject: Subject<string> = new Subject<string>(); // Subject for search term
  readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  availableColumns = [
    { id: 'created_at', name: 'Date Requested', selected: true },
    { id: 'sales_person_account_name', name: 'Sales Person Account Name', selected: true },
    { id: 'sales_person_name', name: 'Sales Person Name', selected: true },
    {id:'newOrExistingClient',name:'Customer Type',selected:true},
    { id: 'multipleLocations', name: 'Multi Locations?', selected: true },
    { id: 'display_pricing', name: 'Display Pricing', selected: true },
    { id: 'display_techstack', name: 'Display Tech Stack', selected: true },
    { id: 'sales_person_promotion_type', name: 'Sales Person Promotion Type', selected: true },
    { id: 'sales_person_client', name: 'Sales Person Client', selected: true },
    { id: 'sales_person_email', name: 'Sales Person Email', selected: true },
    { id: 'user_type', name: 'User Type', selected: true },
    { id: 'activation_fee', name: 'Activation Fee', selected: true },
    { id: 'techMonthly', name: 'Tech Price (Monthly)', selected: true },
    { id: 'techMonthly_Disc', name: 'Disc. Tech Price (Monthly)', selected: true },
    { id: 'analyticMonthly', name: 'Analytic Price (Monthly)', selected: true },
    { id: 'analyticMonthly_Disc', name: 'Disc. Analytic Price (Monthly)', selected: true },
    { id: 'techAnnual', name: 'Tech Price (Annual)', selected: true },
    { id: 'techAnnual_Disc', name: 'Disc. Tech Price (Annual)', selected: true },
    { id: 'analyticAnnual', name: 'Analytic Price (Annual)', selected: true },
    { id: 'analyticAnnual_Disc', name: 'Disc. Analytic Price (Annual)', selected: true },
    { id: 'aditLiteMontly', name: 'Adit Lite Price (Monthly)', selected: true },
    { id: 'aditLiteMontly_Disc', name: 'Disc. Adit Lite Price (monthly)', selected: true },
    { id: 'aditLiteAnnual', name: 'Adit Lite Price (Annual)', selected: true },
    { id: 'aditLiteAnnual_Disc', name: 'Disc. Adit Lite Price (Annual)', selected: true },
    { id: 'aditCore_monthly', name: 'Adit Core Price (monthly)', selected: true },
    { id: 'aditCore_annually', name: 'Adit Core Price (Annual)', selected: true },
    { id: 'status', name: 'Status', selected: true }, 
  ];

  // Dynamically updated columns list
  displayedColumns = this.availableColumns
    .filter(col => col.selected)
    .map(col => col.id);

  // Update displayed columns when selection changes
  updateDisplayedColumns() {
    let col_array:any[]=[]
    this.availableColumns.forEach(col=>{
        if(col.selected){
          col_array=[...col_array,col.id]
        }
    })
    this.displayedColumns=[...col_array,'action']
    localStorage.setItem('displayedColumns', JSON.stringify(this.displayedColumns));

  }

  ngOnInit() {
    const storedColumns = localStorage.getItem('displayedColumns');
    if (storedColumns) {
      const displayedColumns = JSON.parse(storedColumns);

      // Update availableColumns based on displayedColumns
      this.availableColumns = this.availableColumns.map((col) => ({
        ...col,
        selected: displayedColumns.includes(col.id), // Set selected to true if the column is in displayedColumns
      }));
  
      // Set displayedColumns to include only those stored in localStorage
      this.displayedColumns = displayedColumns;
    } else {
      // Default columns if no stored columns are found
      this.displayedColumns = this.availableColumns
        .filter((col) => col.selected)
        .map((col) => col.id);
      this.displayedColumns = [...this.displayedColumns, 'action'];
    }
    // Subscribe to the searchSubject to trigger search with debounce
    this.readDateRange();
    this.searchSubject
      .pipe(
        debounceTime(600), // Wait for 600ms after the user stops typing
        distinctUntilChanged(), // Only trigger if the search term has changed
        switchMap((searchTerm: string) => {
          return this.dashboardService.getAgreements(
            this.currentPage,
            this.pageSize,
            searchTerm,
            this.selected,
            '',
            ''
          ); // Call the API with the current search term
        })
      )
      .subscribe({
        next: (response) => {
          this.dataSource = new MatTableDataSource(response.data);
          this.totalRecords = response.pagination.total;
          // this.pageSize = response.pagination.totalPages;
          this.currentPage = response.pagination.page;
          console.log(this.totalRecords,this.pageSize,this.currentPage)
          // Set paginator properties
          if (this.paginator) {
            this.paginator.length = this.totalRecords;
            this.paginator.pageIndex = this.currentPage - 1; // Set the page index for pagination
            this.paginator.pageSize = this.pageSize; // Set the page size
          }
        },
        error: (error) => {
          console.log(error, 'my error');
          this.showErrorToast(error);
        },
      });

    // Initially load data without search term
    this.loadData(this.currentPage, this.pageSize, '', this.selected);
  }
  
  loadData(page: number, limit: number, searchTerm: string, status: string) {
    this.dashboardService
      .getAgreements(page, limit, searchTerm, status, '', '')
      .subscribe(
        {
          next: (response) => {
            this.dataSource = new MatTableDataSource(response.data);
              this.totalRecords = response.pagination.total;
          // this.pageSize = response.pagination.totalPages;
          this.currentPage = response.pagination.page;
        
            // Set paginator properties
            if (this.paginator) {
              this.paginator.length = this.totalRecords;
              this.paginator.pageIndex = page - 1; // Set the page index for pagination
              this.paginator.pageSize = limit; // Set the page size
            }
          },
          error: (error) => {
            // if(error==="Invalid token"){
            //   this.route.navigate(['/login'])
            // }
            this.showErrorToast(error);
          }
        }
      );
  }
  showErrorToast(errorMessage: string): void {
    this.toasterService.error(errorMessage, 'Error');
  }
  // Call this when the user changes the page or page size
  pageChanged(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      this.selected
    );
  }

  // Call this when the user types in the search box
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();

    // Emit the search term to the searchSubject (to trigger debouncing)
    this.searchSubject.next(this.searchTerm);
  }

  applyStatusFilter() {
    this.loadData(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      this.selected
    );
  }
  createAgreement() {
    this.route.navigate(['/pre-agreement-welcome']);
  }

  readDateRange() {
    console.log(this.range.value,'gettting called');
    this.range.valueChanges.subscribe((res) => {
      if (res.start && res.end) {
        console.log(res);
        const start = this.formatDate(res.start);
        const end = this.formatDate(res.end);
        this.dashboardService
          .getAgreements(
            this.currentPage,
            this.pageSize,
            this.searchTerm,
            this.selected,
            start,
            end
          )
          .subscribe(  {
            next: (response) => {
              if(response.data.length==0){
                this.toasterService.info("No data found for selected date range.",'No Data')
              }
              this.dataSource = new MatTableDataSource(response.data);
              this.totalRecords = response.total;
            },
            error: (error) => {
              // if(error==="Invalid token"){
              //   this.route.navigate(['/login'])
              // }
              this.showErrorToast(error);
             
              
            }
          });
      }
    });
    
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openDialog(){
    let dialog =  this.dialog.open(SelectColumnDialogComponent, {
      maxWidth:'80vw',
      data:  this.availableColumns
    });

    dialog.afterClosed().subscribe(result => {
      console.log(result)
      if (result !== undefined) {
        this.availableColumns=result;
      }
      this.updateDisplayedColumns()
    });
  }


  //edit dagreement
  editAgreement(agreementId: string) {
    this.route.navigate(['/pre-agreement-form', agreementId]);
  }
  viewAgreement(agreementId: string, multipleLocations: boolean) {
    // Find the agreement in mock data
    const agreement = mockData.agreements.find(a => a.id === agreementId);
    
    if (agreement) {
      // Store the selected agreement in localStorage or a service for access in the view page
      localStorage.setItem('selectedAgreement', JSON.stringify(agreement));
      
      // Navigate to the view agreement page
      this.route.navigate(['/view-agreement', agreementId], {
        queryParams: {
          multipleLocations: multipleLocations
        }
      });
    } else {
      console.error('Agreement not found with ID:', agreementId);
      // Optionally show an error notification to the user
    }
  }

  markExpireAgreement(agreementId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to mark this agreement as expired?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, mark as expired!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the service to mark the agreement as expired
        this.dashboardService.updateAgreementStatus(agreementId, 'Expired').subscribe({
          next: (res) => {
            Swal.fire('Marked as Expired!', 'The agreement has been marked as expired.', 'success');
            console.log(res);
            // Optionally refresh the data or update the UI
            this.loadData(this.currentPage, this.pageSize, this.searchTerm, this.selected);
          },
          error: (err) => {
            Swal.fire('Error!', 'Failed to mark the agreement as expired.', 'error');
            console.error(err);
          },
        });
      }
    });
  }
  
}
