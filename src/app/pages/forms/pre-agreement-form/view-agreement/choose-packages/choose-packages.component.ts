import { Component, EventEmitter, Input, OnInit, output, Output, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-choose-packages',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './choose-packages.component.html',
  styleUrl: './choose-packages.component.scss',
})
export class ChoosePackagesComponent implements OnInit {
    @Output() totalAnnually = new EventEmitter<Number>();
    @Output() totalMonthly = new EventEmitter<Number>();

    @Output() totaltechAnnually = new EventEmitter<Number>();
    @Output() totaltechMonthly = new EventEmitter<Number>();
    
    @Output() totalanalyticAnnually = new EventEmitter<Number>();
    @Output() totalanalyticMonthly = new EventEmitter<Number>();

    @Output() isAnnualOrMonthly =  new EventEmitter<boolean>();
    @Output() clickedNext = new EventEmitter<boolean>();

  packagesArray: any = {
    'Smile Source': 'old_package',
    TruBlu: 'old_package',
    DDSOM: 'old_package',
    'AIDA Member': 'old_package',
    Custom: 'old_package',
    Event: 'new_package', // If values are exhausted, duplicates may occur
    'Outbound AE': 'old_package',
    'Outbound AE (Lite)': 'adit_lite_and_tech_analytics',
    'Outbound AE (Only Lite)': 'only_lite',
    'Only Lite - 1st Yr Promo': 'only_lite',
    Admin: 'old_package',
    'No Vendor Promo': 'no_vendor_promo',
    'Inbound Core': 'new_package',
    'Inbound Free Verifications': 'new_package',
    'Outbound Core': 'new_package',
    'Outbound Free Verifications': 'new_package',
    'Outbound Core - 1st Yr': 'new_package',
  };

  @Input() item = '';
  @Input() multiple_location = '';
  @Input() pricingArray: any;
  @Input() annulaOrMonth!:boolean
isAnnually: boolean = true;

  selectAddonPhone = false;
  selectAddonAnalytics = false;
  selectAddonVerification = false;

  aditCoreSelected = true
  pozativeSelected = true
  verificationsSelected = true


  techSelected:boolean=false
  analyticSelected:boolean=false
  //totals
  newPackageTotalAnnualy:number = 0;
  newPackageTotalMonthly:number = 0;
  toggleView(view: 'annually' | 'monthly') {
    this.isAnnually = view === 'annually';
    this.isAnnualOrMonthly.emit(this.isAnnually)
  }
  whichOneToShow: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['annulaOrMonth']) {
      console.log('Data changed:', this.annulaOrMonth);
      this.isAnnually=this.annulaOrMonth
      // React to data changes
    }
  }

  ngOnInit(): void {
    console.log('Pricing Array:', this.multiple_location);
    if(this.multiple_location=='yes'){
      this.techSelected=true
      this.analyticSelected=true
    }
    this.newPackageTotalMonthlyForNoVendorPromo =parseInt( this.pricingArray.aditCore_monthly )
    this.newPackageTotalAnnuallyForNoVendorPromo = parseInt(this.pricingArray.aditCore_annually )
    this.isAnnually=this.annulaOrMonth
    if (this.item && this.packagesArray.hasOwnProperty(this.item)) {
      const value = this.packagesArray[this.item];
      this.whichOneToShow = value;
      // console.log(`Key: ${key}, Value: ${value}`);
    } else {
      alert('Package not found');
    } 
    if(this.whichOneToShow=='old_package'){
      this.getPricingOverallForOld_pacakge()
    }else{
      this.getPricingOverallForOtherPacakge()
    }


    if(this.pricingArray.add_on_phones){
     this.phoneAddOnPriceAddNoVendor(this.pricingArray.add_on_phones)
    }
    if(this.pricingArray.add_on_analytic){
      this.analyticAddOnPriceAddNoVendor(this.pricingArray.add_on_analytic)
     }

     if(this.pricingArray.add_on_verification){
      this.verificationAddOnPriceAddNoVendor(this.pricingArray.add_on_verification)
     }
 

    // if(this.pricingArray.length>0){
    this.pozativeSelected=false
    this.verificationsSelected=false
  // Print totalMonthly
      
    // }

  }

  oldPacakSelection(packageSelected:any){
    if(packageSelected=='tech'){
      this.techSelected=true
      this.analyticSelected=false
      
      this.getPricingOverallForOld_pacakge()
    }else if(packageSelected=='analytic'){
      this.analyticSelected=true
      this.techSelected=false
      this.getPricingOverallForOld_pacakge()
    }
  }

  getPricingOverallForOld_pacakge(){
    const keysWithValues = Object.keys(this.pricingArray)
    .filter((key) => this.pricingArray[key] !== null) // Filter keys with non-null values
    .map((key) => ({ key, value: this.pricingArray[key] })); // Map to an array of objects with key and value
  console.log(keysWithValues)
    let totaltechAnnually = 0;
    let totaltechMonthly = 0;
    let totalAnalyticMonthly =0
    let totallAnalyticAnnually=0
    // Calculate totals
    keysWithValues.forEach((item) => {
      const numericValue = parseFloat(item.value); // Convert value to a number
      if (isNaN(numericValue)) return; // Skip invalid values
      if( item.key=='techMonthly'||item.key=='analyticAnnual' || item.key=='techAnnual' || item.key=='analyticMonthly' ){
        return
      }
      if(item.key.includes("tech")){
        if(item.key =='techMonthly_Disc'){
          totaltechMonthly += numericValue;
        }else if(item.key =='techAnnual_Disc'){
          totaltechAnnually += numericValue;
        } else {
          // Add to both totals for keys that don't contain "monthly" or "annually"
          totaltechAnnually += numericValue;
          totaltechMonthly += numericValue;
        }
      }else if(item.key.includes("analytic")){
        if(item.key =='analyticMonthly_Disc'){
          totalAnalyticMonthly += numericValue;
        }else if(item.key =='analyticAnnual_Disc'){
          totallAnalyticAnnually += numericValue;
        } else {
          // Add to both totals for keys that don't contain "monthly" or "annually"
          totallAnalyticAnnually += numericValue;
          totalAnalyticMonthly += numericValue;
        }
      }
     
    });


    if(this.multiple_location=='yes'){
      if(this.techSelected && this.analyticSelected){
        this.totalanalyticAnnually.emit(totallAnalyticAnnually)
        this.totalanalyticMonthly.emit(totalAnalyticMonthly)
        this.totaltechAnnually.emit(totaltechAnnually)
        this.totaltechMonthly.emit(totaltechMonthly)
      }else  if(!this.analyticSelected && !this.techSelected){
        this.totalanalyticAnnually.emit(0)
        this.totalanalyticMonthly.emit(0)
        this.totaltechAnnually.emit(0)
        this.totaltechMonthly.emit(0)
      }
    }else{
      if(this.techSelected){
        this.newPackageTotalAnnualy=totaltechAnnually;
        this.totalAnnually.emit(this.newPackageTotalAnnualy)
        this.newPackageTotalMonthly=totaltechMonthly
        this.totalMonthly.emit(this.newPackageTotalMonthly)
      }else if(this.analyticSelected){
        this.newPackageTotalAnnualy=totallAnalyticAnnually;
        this.totalAnnually.emit(this.newPackageTotalAnnualy)
        this.newPackageTotalMonthly=totalAnalyticMonthly
        this.totalMonthly.emit(this.newPackageTotalMonthly)
      }else  if(!this.analyticSelected && !this.techSelected){
        this.newPackageTotalAnnualy=0;
        this.totalAnnually.emit(0)
        this.newPackageTotalMonthly=0
        this.totalMonthly.emit(0)
      }
    }

  }


  getPricingOverallForOtherPacakge(){
    const keysWithValues = Object.keys(this.pricingArray)
    .filter((key) => this.pricingArray[key] !== null) // Filter keys with non-null values
    .map((key) => ({ key, value: this.pricingArray[key] })); // Map to an array of objects with key and value
  console.log(keysWithValues)
    let totalAnnually = 0;
    let totalMonthly = 0;
    
    // Calculate totals
    keysWithValues.forEach((item) => {
      const numericValue = parseFloat(item.value); // Convert value to a number
      if (isNaN(numericValue)) return; // Skip invalid values

      if (item.key.includes("annually")) {
        // Add to totalAnnually if the key contains "annually"
        totalAnnually += numericValue;
        
      } else if (item.key.includes("monthly")) {
        // Add to totalMonthly if the key contains "monthly"
        totalMonthly += numericValue;
        
      } else {
        // Add to both totals for keys that don't contain "monthly" or "annually"
        totalAnnually += numericValue;
        totalMonthly += numericValue;
       
      }
    });
    this.newPackageTotalAnnualy=totalAnnually;
    this.totalAnnually.emit(this.newPackageTotalAnnualy)
    this.newPackageTotalMonthly=totalMonthly
    this.totalMonthly.emit(this.newPackageTotalMonthly)
    console.log(`Total Annually: ${totalAnnually}`); // Print totalAnnually
    console.log(`Total Monthly: ${totalMonthly}`);
  }

  phoneAddOnPriceAdd(price:any) {
    this.selectAddonPhone=!this.selectAddonPhone
    if(!this.selectAddonPhone){
      this.newPackageTotalAnnualy= this.newPackageTotalAnnualy - parseInt(price);
      this.newPackageTotalMonthly= this.newPackageTotalMonthly - parseInt(price);
    }else{
      this.newPackageTotalAnnualy=parseInt(price) + this.newPackageTotalAnnualy;
      this.newPackageTotalMonthly=parseInt(price) + this.newPackageTotalMonthly;
    }
    this.totalAnnually.emit(this.newPackageTotalAnnualy)
    this.totalMonthly.emit(this.newPackageTotalMonthly)
    
  }
  analyticAddOnPriceAdd(price:any) {
    this.selectAddonAnalytics=!this.selectAddonAnalytics
    if(!this.selectAddonAnalytics){
      this.newPackageTotalAnnualy= this.newPackageTotalAnnualy - parseInt(price);
      this.newPackageTotalMonthly= this.newPackageTotalMonthly - parseInt(price);
      
    }else{
      this.newPackageTotalAnnualy=parseInt(price) + this.newPackageTotalAnnualy;
      this.newPackageTotalMonthly=parseInt(price) + this.newPackageTotalMonthly
    }
       this.totalAnnually.emit(this.newPackageTotalAnnualy)
      this.totalMonthly.emit(this.newPackageTotalMonthly)
  }
  verificationAddOnPriceAdd(price:any) {
    this.selectAddonVerification=!this.selectAddonVerification
    if(!this.selectAddonVerification){
      this.newPackageTotalAnnualy= this.newPackageTotalAnnualy - parseInt(price);
      this.newPackageTotalMonthly= this.newPackageTotalMonthly - parseInt(price);
      
    }else{
      this.newPackageTotalAnnualy=parseInt(price) + this.newPackageTotalAnnualy;
      this.newPackageTotalMonthly=parseInt(price) + this.newPackageTotalMonthly
      
    }

    this.totalAnnually.emit(this.newPackageTotalAnnualy)
    this.totalMonthly.emit(this.newPackageTotalMonthly)
   
  }



  //no vendor promo selection

  
  newPackageTotalMonthlyForNoVendorPromo:any
  newPackageTotalAnnuallyForNoVendorPromo:any
  packagePrice:any
   selectpackage(pacakgeName:string){

      if (pacakgeName === 'aditCore') {
        this.aditCoreSelected = true;
        this.pozativeSelected = false;
        this.verificationsSelected = false;
        this.newPackageTotalMonthlyForNoVendorPromo = parseInt(this.pricingArray.aditCore_monthly) 
        this.newPackageTotalAnnuallyForNoVendorPromo = parseInt(this.pricingArray.aditCore_annually) 
        this.totalAnnually.emit(this.newPackageTotalAnnuallyForNoVendorPromo)
        this.totalMonthly.emit(this.newPackageTotalMonthlyForNoVendorPromo)
        // this.packagePrice = totalPrice;
    }else if(pacakgeName=='pozative'){
      this.aditCoreSelected=false
      this.pozativeSelected=true
      this.verificationsSelected=false
      this.newPackageTotalMonthlyForNoVendorPromo = parseInt(this.pricingArray.pozative_Only_Monthly) 
      this.newPackageTotalAnnuallyForNoVendorPromo = parseInt(this.pricingArray.pozative_Only_Annually )
      this.totalAnnually.emit(this.newPackageTotalAnnuallyForNoVendorPromo)
      this.totalMonthly.emit(this.newPackageTotalMonthlyForNoVendorPromo)
      // this.packagePrice = totalPrice;
     }else if(pacakgeName=='verification'){
      this.aditCoreSelected=false
      this.pozativeSelected=false
      this.verificationsSelected=true
      this.newPackageTotalMonthlyForNoVendorPromo = parseInt(this.pricingArray.verifications_Only_Monthly )
      this.newPackageTotalAnnuallyForNoVendorPromo = parseInt(this.pricingArray.verifications_Only_Annually )
      this.totalAnnually.emit(this.newPackageTotalAnnuallyForNoVendorPromo)
      this.totalMonthly.emit(this.newPackageTotalMonthlyForNoVendorPromo)
      // this.packagePrice = totalPrice;
    }
   }

   phoneAddOnPriceAddNoVendor(price:any) {
    this.selectAddonPhone=!this.selectAddonPhone
    if(!this.selectAddonPhone){

      this.newPackageTotalAnnuallyForNoVendorPromo= this.newPackageTotalAnnuallyForNoVendorPromo - parseInt(price);
      this.newPackageTotalMonthlyForNoVendorPromo= this.newPackageTotalMonthlyForNoVendorPromo - parseInt(price);
      
    }else{
      this.newPackageTotalAnnuallyForNoVendorPromo=parseInt(price) + this.newPackageTotalAnnuallyForNoVendorPromo;
      this.newPackageTotalMonthlyForNoVendorPromo=parseInt(price) + this.newPackageTotalMonthlyForNoVendorPromo
      
    }
    this.totalAnnually.emit(this.newPackageTotalAnnuallyForNoVendorPromo)
    this.totalMonthly.emit(this.newPackageTotalMonthlyForNoVendorPromo)
    
   
  }
  analyticAddOnPriceAddNoVendor(price:any) {
    this.selectAddonAnalytics=!this.selectAddonAnalytics
    if(!this.selectAddonAnalytics){
      this.newPackageTotalAnnuallyForNoVendorPromo= this.newPackageTotalAnnuallyForNoVendorPromo - parseInt(price);
      this.newPackageTotalMonthlyForNoVendorPromo= this.newPackageTotalMonthlyForNoVendorPromo - parseInt(price);
      
    }else{
      this.newPackageTotalAnnuallyForNoVendorPromo=parseInt(price) + this.newPackageTotalAnnuallyForNoVendorPromo;
      this.newPackageTotalMonthlyForNoVendorPromo=parseInt(price) + this.newPackageTotalMonthlyForNoVendorPromo
    }
       this.totalAnnually.emit(this.newPackageTotalAnnuallyForNoVendorPromo)
      this.totalMonthly.emit(this.newPackageTotalMonthlyForNoVendorPromo)
      
  }
  verificationAddOnPriceAddNoVendor(price:any) {
    this.selectAddonVerification=!this.selectAddonVerification
    if(!this.selectAddonVerification){
      this.newPackageTotalAnnuallyForNoVendorPromo= this.newPackageTotalAnnuallyForNoVendorPromo - parseInt(price);
      this.newPackageTotalMonthlyForNoVendorPromo= this.newPackageTotalMonthlyForNoVendorPromo - parseInt(price);
      
    }else{
      this.newPackageTotalAnnuallyForNoVendorPromo=parseInt(price) + this.newPackageTotalAnnuallyForNoVendorPromo;
      this.newPackageTotalMonthlyForNoVendorPromo=parseInt(price) + this.newPackageTotalMonthlyForNoVendorPromo
      
    }

    this.totalAnnually.emit(this.newPackageTotalAnnuallyForNoVendorPromo)
    this.totalMonthly.emit(this.newPackageTotalMonthlyForNoVendorPromo)
    
  }


  goNext(){
    if(this.techSelected ||this.analyticSelected){
      this.clickedNext.emit(true)

    }

    console.log('clicked next')
  }
}
