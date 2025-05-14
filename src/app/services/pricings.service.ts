import { Injectable } from '@angular/core';
import { promotionPricing } from '../pages/forms/pre-agreement-form/pricingArr'
import { PROMOTION_TYPES, PromotionConfig } from '../models/promotion.model';

@Injectable({
  providedIn: 'root'
})
export class PricingsService {
  // Map each promotion to its type
  private promotionTypeMap: {[key: string]: string} = {
    'Smile Source': 'PARTNER_PROGRAM',
    'TruBlu': 'PARTNER_PROGRAM',
    'DDSOM': 'PARTNER_PROGRAM',
    'AIDA Member': 'PARTNER_PROGRAM',
    'Custom': 'FLEXIBLE_PRICING',
    'Event': 'CORE_PRICING',
    'Outbound AE': 'OUTBOUND_SALES',
    'Outbound AE (Lite)': 'LITE_PACKAGE',
    'Outbound AE (Only Lite)': 'LITE_ONLY',
    'Only Lite - 1st Yr Promo': 'LITE_ONLY',
    'Admin': 'ADMINISTRATIVE',
    'No Vendor Promo': 'SPECIAL_PROMOTION',
    'Inbound Free Phones': 'CORE_PRICING',
    'Outbound Free Phones': 'CORE_PRICING',
    'Inbound Core': 'CORE_PRICING',
    'Inbound Free Verifications': 'CORE_PRICING',
    'Outbound Core': 'CORE_PRICING',
    'Outbound Free Verifications': 'CORE_PRICING',
    'Outbound Core - 1st Yr': 'FREE_INCENTIVES',
    // 'Reseller': 'RESELLER'
  };

  constructor() { }

  getPromotionPricing(promotionName: any) {
    return promotionPricing[promotionName];
  }

  getPromotionConfig(promotionName: string): PromotionConfig {
    const type = this.promotionTypeMap[promotionName];
    return PROMOTION_TYPES[type];
  }

  getComponentType(promotionName: string): string {
    return this.getPromotionConfig(promotionName).componentType;
  }

  getAllPromotions() {
    return Object.keys(promotionPricing);
  }

  getPromotionsByType(type: string) {
    return Object.keys(this.promotionTypeMap)
      .filter(promo => this.promotionTypeMap[promo] === type);
  }
}
