import { Component, inject, OnInit } from '@angular/core';
import {MatRadioModule} from '@angular/material/radio'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  
} from '@angular/material/dialog';
MatButtonModule
@Component({
  selector: 'app-select-provider',
  standalone: true,
  imports: [FormsModule,MatDialogModule,MatIconModule,MatButtonModule,MatRadioModule,MatFormFieldModule,MatInputModule],
  templateUrl: './select-provider.component.html',
  styleUrl: './select-provider.component.scss'
})
export class SelectProviderComponent implements OnInit {
  verification_provider=[
    'Vyne',
    'Zuub',
    'AirPay',
    'E-Assist',
    'Weave',
    'Practice By Numbers',
    'Solution Reach',
    'NexHealth',
    'Dental Intel',
    'Revenue Well',
    'No Vendor',
    'Other'
  ]
  analytics_provider=[
    'Jarvis',
    'DI/Modento/LocalMed',
    'Practice By Numbers',
    'RecallMax',
    'EHR/PMS',
    'Other',
  ]
  current_phone_provider=[
    '8x8',
    'AT&T',
    'Bell',
    'Comcast',
    'GoTo Connect',
    'Intiveo',
    'Mango',
    'Nextiva',
    'Ooma',
    'Optimum',
    'Peer Logic',
    'Revenue Well',
    'RingCentral',
    'Shaw',
    'Spectrum',
    'Verizon',
    'Weave',
    'Other'
  ]
  provider_for_forms_etc=[
    'Birdeye',
    'CareCru',
    'Dear Doc',
    'Demand Force',
    'Dentrix Hub',
    'Dental Symphony',
    'Dentrix Patient Engage',
    'Doctible',
    'Enlive Forms',
    'Flex Dental',
    'Kasper',
    'Legwork',
    'Lighthouse 360',
    'DI/Modento/LocalMed',
    'M-Consent',
    'Nexhealth',
    'Opera DDS',
    'Patient Activator',
    'Patient Viewer',
    'Patient Xpress',
    'Podium',
    'Practice By Numbers',
    'Practice Mojo',
    'RecallMax',
    'Revenue Well',
    'Simplifeye',
    'Solution Reach',
    'Swell',
    'Vyne',
    'Weave',
    'YAPI',
    'ZocDoc',
    'No Texting System',
    'Other'
  ]
  providers:string[]=[]
    readonly dialogRef = inject(MatDialogRef<SelectProviderComponent>);
    readonly data = inject(MAT_DIALOG_DATA);
    ngOnInit(): void {
      console.log(this.data)  
      if(this.data=='Current Phone Provider?'){
        this.providers=this.current_phone_provider
       }else if(this.data=='Patient Texting?'||this.data=='Reminders & Recall?'||this.data=='Digital Forms?'||this.data=='Treatment Presentations & Payment Plans?'||this.data=='Current Payments Provider?'||this.data=='Reviews?'||this.data=='Online Scheduling?'||this.data=='Mass Texting?'||this.data=='Mass Emailing?'){
        this.providers=this.provider_for_forms_etc;
       }else if(this.data=='Analytics & Morning Huddle?'){
        this.providers=this.analytics_provider;
       }else if(this.data=='Verification Provider'){
        this.providers=this.verification_provider
       }
       this.filteredProviders = [...this.providers];

    }
    
    setValue(result:string){
      this.dialogRef.close(
        result
      )
    }
    //search apply
    searchTerm:any
    filteredProviders: string[] = []; // Filtered list of providers

    filterOptions(): void {
      // Filter the providers based on the search term
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      this.filteredProviders = this.providers.filter((provider) =>
        provider.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
  
}
