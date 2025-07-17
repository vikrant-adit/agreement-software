// Bundle types and configurations
export interface BundleField {
  name: string;
  label: string;
  min?: number;
  max?: number;
  cssClass: string;
  isAddOn: boolean;
  enabled: boolean;
  validators: any[]; // Using any[] instead of ValidatorFn[] for simplicity
}

export interface BundleGroup {
  id: string;
  title: string;
  enabled: boolean;
  isNoVendorPackage: boolean;
  fields: BundleField[];
}

export const bundleGroups: BundleGroup[] = [
  // Tech Stack Bundle
  {
    id: 'tech',
    title: 'Tech Stack Bundle',
    enabled: true,
    isNoVendorPackage: true,
    fields: [
      {
        name: 'techMonthly',
        label: 'Monthly Price',
        min: 0,
        cssClass: 'tech-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      },
      {
        name: 'techMonthly_Disc',
        label: 'Monthly Discounted Price',
        min: 0,
        cssClass: 'tech-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      },
      {
        name: 'techAnnual',
        label: 'Annual Price',
        min: 0,
        cssClass: 'tech-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      },
      {
        name: 'techAnnual_Disc',
        label: 'Annual Discounted Price',
        min: 0,
        cssClass: 'tech-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      }
    ]
  },
  
  // Analytics Bundle
  {
    id: 'analytics',
    title: 'Analytics Bundle',
    enabled: true,
    isNoVendorPackage: true,
    fields: [
      {
        name: 'analyticMonthly',
        label: 'Monthly Price',
        min: 0,
        cssClass: 'analytics-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      },
      {
        name: 'analyticMonthly_Disc',
        label: 'Monthly Discounted Price',
        min: 0,
        cssClass: 'analytics-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      },
      {
        name: 'analyticAnnual',
        label: 'Annual Price',
        min: 0,
        cssClass: 'analytics-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      },
      {
        name: 'analyticAnnual_Disc',
        label: 'Annual Discounted Price',
        min: 0,
        cssClass: 'analytics-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      }
    ]
  },
  
  // Adit Lite Bundle
  {
    id: 'aditLite',
    title: 'Adit Lite Package',
    enabled: true,
    isNoVendorPackage: true,
    fields: [
      {
        name: 'aditLiteMontly',
        label: 'Monthly Price',
        min: 0,
        cssClass: 'adit-lite-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      },
      {
        name: 'aditLiteMontly_Disc',
        label: 'Monthly Discounted Price',
        min: 0,
        cssClass: 'adit-lite-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      },
      {
        name: 'aditLiteAnnual',
        label: 'Annual Price',
        min: 0,
        cssClass: 'adit-lite-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      },
      {
        name: 'aditLiteAnnual_Disc',
        label: 'Annual Discounted Price',
        min: 0,
        cssClass: 'adit-lite-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      }
    ]
  },
  
  // Adit Core Bundle
  {
    id: 'aditCore',
    title: 'Adit Core Package',
    enabled: true,
    isNoVendorPackage: true,
    fields: [
      {
        name: 'aditCore_monthly',
        label: 'Monthly Price',
        min: 0,
        cssClass: 'adit-core-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      },
      {
        name: 'aditCore_annually',
        label: 'Annual Price',
        min: 0,
        cssClass: 'adit-core-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      }
    ]
  },
    // pozative Bundle
  {
    id: 'pozative',
    title: 'Pozative Only',
    enabled: true,
    isNoVendorPackage: true,
    fields: [
      {
        name: 'pozative_Only_Monthly', // Update to match pricingArr.ts
        label: 'Monthly Price',
        min: 0,
        cssClass: 'pozative-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      },
      {
        name: 'pozative_Only_Annually', // Update to match pricingArr.ts
        label: 'Annual Price',
        min: 0,
        cssClass: 'pozative-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      }
    ]
  },
  // verifications Bundle
  {
    id: 'verifications',
    title: 'Verification Only',
    enabled: true,
    isNoVendorPackage: true,
    fields: [
      {
        name: 'verifications_Only_Monthly', // Update to match pricingArr.ts
        label: 'Monthly Price',
        min: 0,
        cssClass: 'verification-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      },
      {
        name: 'verifications_Only_Annually', // Update to match pricingArr.ts
        label: 'Annual Price',
        min: 0,
        cssClass: 'verification-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      }
    ]
  },
  // Add-ons Bundle
  {
    id: 'addOns',
    title: 'Add-on Services',
    enabled: true,
    isNoVendorPackage: true,
    fields: [
      {
        name: 'add_on_phones',
        label: 'Phones Add-on',
        min: 0,
        cssClass: 'add-on-bundle',
        isAddOn: true,
        enabled: false,
        validators: []
      },
      {
        name: 'add_on_analytic',
        label: 'Analytics Add-on',
        min: 0,
        cssClass: 'add-on-bundle',
        isAddOn: true,
        enabled: false,
        validators: []
      },
      {
        name: 'add_on_verification',
        label: 'Verification Add-on',
        min: 0,
        cssClass: 'add-on-bundle',
        isAddOn: true,
        enabled: false,
        validators: []
      }
    ]
  },
  
  // No Vendor Promo Special Components
  // {
  //   id: 'noVendorComponents',
  //   title: 'No Vendor Components',
  //   enabled: true,
  //   isNoVendorPackage: true,
  //   fields: [
  //     {
  //       name: 'pozative_Only_Monthly',
  //       label: 'Pozative Only (Monthly)',
  //       min: 0,
  //       cssClass: 'no-vendor-component',
  //       isAddOn: true,
  //       enabled: false,
  //       validators: []
  //     },
  //     {
  //       name: 'pozative_Only_Annually',
  //       label: 'Pozative Only (Annual)',
  //       min: 0,
  //       cssClass: 'no-vendor-component',
  //       isAddOn: true,
  //       enabled: false,
  //       validators: []
  //     },
  //     {
  //       name: 'verifications_Only_Monthly',
  //       label: 'Verifications Only (Monthly)',
  //       min: 0,
  //       cssClass: 'no-vendor-component',
  //       isAddOn: true,
  //       enabled: false,
  //       validators: []
  //     },
  //     {
  //       name: 'verifications_Only_Annually',
  //       label: 'Verifications Only (Annual)',
  //       min: 0,
  //       cssClass: 'no-vendor-component',
  //       isAddOn: true,
  //       enabled: false,
  //       validators: []
  //     }
  //   ]
  // },

  // Fees and Credits
  {
    id: 'fees',
    title: 'Activation Fees',
    enabled: true,
    isNoVendorPackage: false,
    fields: [
      {
        name: 'activation_fee',
        label: 'Activation Fee',
        min: 0,
        cssClass: 'fees-bundle',
        isAddOn: false,
        enabled: true,
        validators: []
      }
  
    ]
  },
  // {
  //   id: 'noOfDays',
  //   title: 'No of Days',
  //   enabled: true,
  //   isNoVendorPackage: false,
  //   fields: [
  //     {
  //       name: 'no_of_days',
  //       label: 'No of Days',
  //       min: 0,
  //       cssClass: 'fees-bundle',
  //       isAddOn: false,
  //       enabled: true,
  //       validators: []
  //     }
  
  //   ]
  // }
];