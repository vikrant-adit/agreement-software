export interface PromotionConfig {
    type: string;
    category: string;
    componentType: string;
    features: string[];
  }
  
  export const PROMOTION_TYPES: {[key: string]: PromotionConfig} = {
    'PARTNER_PROGRAM': {
      type: 'PARTNER_PROGRAM',
      category: 'PARTNER PROGRAMS',
      componentType: 'partner-pricing',
      features: ['Tech/Analytics pricing', 'Fixed discounts', 'No activation fee', 'Standard hardware credits']
    },
    'FLEXIBLE_PRICING': {
      type: 'FLEXIBLE_PRICING',
      category: 'FLEXIBLE PRICING',
      componentType: 'range-pricing',
      features: ['Flexible price range', 'Min/max values', 'Activation fee']
    },
    'CORE_PRICING': {
      type: 'CORE_PRICING',
      category: 'CORE PRICING',
      componentType: 'core-pricing',
      features: ['Core product with add-ons', 'Activation fee']
    },
    'OUTBOUND_SALES': {
      type: 'OUTBOUND_SALES',
      category: 'OUTBOUND SALES PACKAGES',
      componentType: 'range-pricing',
      features: ['Multiple plan types', 'Min/max ranges']
    },
    'LITE_PACKAGE': {
      type: 'LITE_PACKAGE',
      category: 'LITE PACKAGE OPTIONS',
      componentType: 'lite-pricing',
      features: ['Lite package options', 'Own pricing']
    },
    'LITE_ONLY': {
      type: 'LITE_ONLY',
      category: 'LITE-ONLY PACKAGES',
      componentType: 'lite-only-pricing',
      features: ['Lite-specific pricing', 'No hardware credits for Lite']
    },
    'ADMINISTRATIVE': {
      type: 'ADMINISTRATIVE',
      category: 'ADMINISTRATIVE',
      componentType: 'admin-pricing',
      features: ['Very flexible pricing', 'No activation fee']
    },
    'SPECIAL_PROMOTION': {
      type: 'SPECIAL_PROMOTION',
      category: 'SPECIAL PROMOTION',
      componentType: 'component-pricing',
      features: ['Individual component pricing']
    },
    'FREE_INCENTIVES': {
      type: 'FREE_INCENTIVES',
      category: 'FREE PHONE/VERIFICATION PROMOS',
      componentType: 'incentive-pricing',
      features: ['Core pricing', 'Free phone or verification incentives']
    },
    'RESELLER': {
      type: 'RESELLER',
      category: 'RESELLER PROGRAM',
      componentType: 'partner-pricing',
      features: ['Similar to partner programs', 'With activation fee']
    }
  };