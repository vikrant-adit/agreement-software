export const promotionPricing:any = {
  /** 
   * CATEGORY: PARTNER PROGRAMS
   * These are special partner/group rates with similar structure 
   * Features: Tech/Analytics pricing with fixed discounts, no activation fee, standard hardware credits
   */
  'Smile Source': {
    techMonthly: 599,
    techMonthly_Disc: 349,
    techAnnual: 549,
    techAnnual_Disc: 289,
    analyticMonthly: 699,
    analyticMonthly_Disc: 449,
    analyticAnnual: 649,
    analyticAnnual_Disc: 379,
    activation_fee: 0,
    hardwareCreditAnnually: 750,
    hardwareCreditMonthly: 300
  },
  TruBlu: {
    techMonthly: 599,
    techMonthly_Disc: 299,
    techAnnual: 549,
    techAnnual_Disc: 289,
    analyticMonthly: 699,
    analyticMonthly_Disc: 399,
    analyticAnnual: 649,
    analyticAnnual_Disc: 379,
    activation_fee: 0,
    hardwareCreditAnnually: 750,
    hardwareCreditMonthly: 300
  },
  DDSOM: {
    techMonthly: 599,
    techMonthly_Disc: 299,
    techAnnual: 549,
    techAnnual_Disc: 299,
    analyticMonthly: 699,
    analyticMonthly_Disc: 399,
    analyticAnnual: 649,
    analyticAnnual_Disc: 379,
    activation_fee: 0,
    hardwareCreditAnnually: 750,
    hardwareCreditMonthly: 300
  },
  'AIDA Member': {
    techMonthly: 599,
    techMonthly_Disc: 299,
    techAnnual: 549,
    techAnnual_Disc: 299,
    analyticMonthly: 699,
    analyticMonthly_Disc: 399,
    analyticAnnual: 649,
    analyticAnnual_Disc: 399,
    activation_fee: 0,
    hardwareCreditAnnually: 750,
    hardwareCreditMonthly: 300
  },

  /** 
   * CATEGORY: FLEXIBLE PRICING
   * These have min/max discount ranges for custom pricing
   * Features: Flexible price range with min/max values, activation fee
   */
  Custom: {
    techMonthly: 599,
    techMonthly_Disc: 449,
    techMonthly_Disc_Min: 349,
    techMonthly_Disc_Max: 449,

    techAnnual: 549,
    techAnnual_Disc: 399,
    techAnnual_Disc_Min: 299,
    techAnnual_Disc_Max: 399,

    analyticMonthly: 699,
    analyticMonthly_Disc: 549,
    analyticMonthly_Disc_Max: 549,
    analyticMonthly_Disc_Min: 449,

    analyticAnnual: 649,
    analyticAnnual_Disc: 499,
    analyticAnnual_Disc_Max: 499,
    analyticAnnual_Disc_Min: 399,

    activation_fee: 500,
    hardwareCreditAnnually: 750,
    hardwareCreditMonthly: 300
  },

  /** 
   * CATEGORY: CORE PRICING
   * Different structure using aditCore instead of tech/analytics
   * Features: Core product with add-ons, activation fee
   */
  Event: {
    aditCore_monthly: 299,
    aditCore_annually: 249,
    add_on_phones: 100,
    add_on_analytic: 100,
    add_on_verification: 150,
    activation_fee: 500,
    hardwareCreditAnnually: 750,
    hardwareCreditMonthly: 300
  },

  /** 
   * CATEGORY: OUTBOUND SALES PACKAGES
   * Outbound account exec packages with flexible pricing
   * Features: Multiple plan types, min/max ranges
   */
  'Outbound AE': {
    techMonthly: 599,
    techMonthly_Disc: 399,
    techMonthly_Disc_Min: 349,
    techMonthly_Disc_Max: 449,

    techAnnual: 549,
    techAnnual_Disc: 349,
    techAnnual_Disc_Min: 299,
    techAnnual_Disc_Max: 399,

    analyticMonthly: 699,
    analyticMonthly_Disc: 499,
    analyticMonthly_Disc_Max: 549,
    analyticMonthly_Disc_Min: 449,

    analyticAnnual: 649,
    analyticAnnual_Disc: 449,
    analyticAnnual_Disc_Max: 499,
    analyticAnnual_Disc_Min: 399,
    activation_fee: 500,
    hardwareCreditAnnually: 750,
    hardwareCreditMonthly: 500
  },

  /** 
   * CATEGORY: LITE PACKAGE OPTIONS
   * Special "Lite" versions with additional Lite fields
   * Features: Adds Lite package options with their own pricing
   */
  'Outbound AE (Lite)': {
    techMonthly: 599,
    techMonthly_Disc: 449,
    techMonthly_Disc_Min: 249,
    techMonthly_Disc_Max: 449,

    techAnnual: 549,
    techAnnual_Disc: 399,
    techAnnual_Disc_Min: 199,
    techAnnual_Disc_Max: 399,

    analyticMonthly: 699,
    analyticMonthly_Disc: 549,
    analyticMonthly_Disc_Max: 549,
    analyticMonthly_Disc_Min: 449,

    analyticAnnual: 649,
    analyticAnnual_Disc: 499,
    analyticAnnual_Disc_Max: 499,
    analyticAnnual_Disc_Min: 399,

    aditLiteMontly: 499,
    aditLiteMontly_Disc: 349,
    aditLiteMontly_Disc_Max: 349,
    aditLiteMontly_Disc_Min: 249,

    aditLiteAnnual: 449,
    aditLiteAnnual_Disc: 299,
    aditLiteAnnual_Disc_Max: 299,
    aditLiteAnnual_Disc_Min: 199,

    activation_fee: 500,
    hardwareCreditAnnually: 750,
    hardwareCreditMonthly: 500,
    hardwareCreditAditLiteAnnually: 0,
    hardwareCreditAditLiteMonthly: 0
  },

  /** 
   * CATEGORY: LITE-ONLY PACKAGES
   * Only contain Lite package options with no regular packages
   * Features: Lite-specific pricing with no hardware credits for Lite
   */
  'Outbound AE (Only Lite)': {
    aditLiteMontly: 499,
    aditLiteMontly_Disc: 349,
    aditLiteMontly_Disc_Max: 349,
    aditLiteMontly_Disc_Min: 249,

    aditLiteAnnual: 449,
    aditLiteAnnual_Disc: 299,
    aditLiteAnnual_Disc_Max: 299,
    aditLiteAnnual_Disc_Min: 199,

    activation_fee: 500,
    hardwareCreditAditLiteAnnually: 0,
    hardwareCreditAditLiteMonthly: 0
  },
  'Only Lite - 1st Yr Promo': {
    aditLiteMontly: 499,
    aditLiteMontly_Disc: 349,
    aditLiteMontly_Disc_Max: 349,
    aditLiteMontly_Disc_Min: 249,

    aditLiteAnnual: 449,
    aditLiteAnnual_Disc: 299,
    aditLiteAnnual_Disc_Max: 299,
    aditLiteAnnual_Disc_Min: 199,

    activation_fee: 500,
    hardwareCreditAditLiteAnnually: 0,
    hardwareCreditAditLiteMonthly: 0
  },

  /** 
   * CATEGORY: ADMINISTRATIVE
   * Special admin pricing with wide pricing ranges
   * Features: Very flexible pricing (0-999 range), no activation fee
   */
  Admin: {
    techMonthly: 599,
    techMonthly_Disc: 449,
    techMonthly_Disc_Min: 0,
    techMonthly_Disc_Max: 999,

    techAnnual: 549,
    techAnnual_Disc: 399,
    techAnnual_Disc_Min: 0,
    techAnnual_Disc_Max: 999,

    analyticMonthly: 699,
    analyticMonthly_Disc: 549,
    analyticMonthly_Disc_Max: 999,
    analyticMonthly_Disc_Min: 0,

    analyticAnnual: 649,
    analyticAnnual_Disc: 499,
    analyticAnnual_Disc_Max: 999,
    analyticAnnual_Disc_Min: 0,

    activation_fee: 0,
  },

  /** 
   * CATEGORY: SPECIAL PROMOTION
   * Unique structure with component-based pricing
   * Features: Individual component pricing
   */
  'No Vendor Promo': {
    pozative_Only_Monthly: 150,
    pozative_Only_Annually: 100,
    verifications_Only_Monthly: 150,
    verifications_Only_Annually: 100,
    aditCore_monthly: 299,
    aditCore_annually: 249,
    add_on_phones: 100,
    add_on_analytic: 100,
    add_on_verification: 100,
    activation_fee: 500,
  },

  /** 
   * CATEGORY: FREE PHONE/VERIFICATION PROMOS
   * Packages with special incentives
   * Features: Core pricing with free phone or verification incentives
   */
  'Inbound Free Phones': {
    aditCore_monthly: 349,
    aditCore_annually: 299,
    add_on_phones: 100,
    add_on_analytic: 100,
    add_on_verification: 150,
    activation_fee: 500,
    hardwareCreditAnnually: 500,
    hardwareCreditMonthly: 300,
    hardwareCreditAditLiteAnnually: 250,
  },
  'Outbound Free Phones': {
    aditCore_monthly: 349,
    aditCore_annually: 299,
    add_on_phones: 100,
    add_on_analytic: 100,
    add_on_verification: 150,
    activation_fee: 500,
    hardwareCreditAnnually: 500,
    hardwareCreditMonthly: 300,
    hardwareCreditAditLiteAnnually: 250,
  },
  'Inbound Core': {
    aditCore_monthly: 299,
    aditCore_annually: 249,
    add_on_phones: 100,
    add_on_analytic: 100,
    add_on_verification: 150,
    activation_fee: 500,
    hardwareCreditAnnually: 500,
    hardwareCreditMonthly: 300,
    hardwareCreditAditLiteAnnually: 250,
    hardwareCreditAditLiteMonthly:0
  },
  'Inbound Free Verifications': {
    aditCore_monthly: 349,
    aditCore_annually: 299,
    add_on_phones: 100,
    add_on_analytic: 100,
    add_on_verification: 100,
    activation_fee: 500,
    hardwareCreditAnnually: 250,
    hardwareCreditMonthly: 0,
    hardwareCreditAditLiteAnnually: 250,
    hardwareCreditAditLiteMonthly:0
  },
  'Outbound Core': {
    aditCore_monthly: 299,
    aditCore_annually: 249,
    add_on_phones: 100,
    add_on_analytic: 100,
    add_on_verification: 150,
    activation_fee: 500,
    hardwareCreditAnnually: 500,
    hardwareCreditMonthly: 500,
    hardwareCreditAditLiteAnnually: 250,
    hardwareCreditAditLiteMonthly: 0
  },
  'Outbound Free Verifications': {
    aditCore_monthly: 349,
    aditCore_annually: 299,
    add_on_phones: 100,
    add_on_analytic: 100,
    add_on_verification: 100,
    activation_fee: 500,
  },
  'Outbound Core - 1st Yr': {
    aditCore_monthly: 349,
    aditCore_annually: 299,
    add_on_phones: 100,
    add_on_analytic: 100,
    add_on_verification: 150,
    activation_fee: 500,
    hardwareCreditAnnually: 500,
    hardwareCreditMonthly: 500,
    hardwareCreditAditLiteAnnually: 250,
    hardwareCreditAditLiteMonthly: 0
  },

  /** 
   * CATEGORY: RESELLER PROGRAM
   * Special pricing for resellers
   * Features: Similar to partner programs but with activation fee
   */
  Reseller: {
    techMonthly: 599,
    techMonthly_Disc: 499,
    techAnnual: 549,
    techAnnual_Disc: 349,
    analyticMonthly: 699,
    analyticMonthly_Disc: 549,
    analyticAnnual: 649,
    analyticAnnual_Disc: 459,
    activation_fee: 100,
    hardwareCreditAnnually: 750,
    hardwareCreditMonthly: 300
  },
};
