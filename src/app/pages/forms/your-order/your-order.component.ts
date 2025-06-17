import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../../header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { OnlineFormAgreementService } from '../../../../services/online form/online-form-agreement.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-your-order',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    HeaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatDividerModule
  ],
  templateUrl: './your-order.component.html',
  styleUrl: './your-order.component.scss'
})
export class YourOrderComponent implements OnInit {
  private agreementService = inject(OnlineFormAgreementService);
  private route = inject(ActivatedRoute);
  agreementId: string = '';
  ifPackageisAditCore: boolean = false;
  addOnPhone: boolean = false;
  addOnAnalytic: boolean = false;
  addOnVerification: boolean = false;
  isAnnually: boolean = false;
  no_of_days: number = 0;
  multiple_location:string = 'no';
  locations: any[] = [];
  selectedSubscriptionPrice: number = 0;
  activation_fee: number = 0;
  hardware_Total: number = 0;
  hardwareCreditApplied: number = 0;
  totalPayment: number = 0;
  nextPaymentDate: string = '';
  selectedPackageName: string = '';
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.agreementId = params['agreementId'];
    });

       this.agreementService.getAgreement(this.agreementId).subscribe((res) =>{

       })
  }
    makeFirstLetterCapital(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
