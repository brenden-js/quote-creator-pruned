export type ServicePricing = {
  basePrice: number,
  tierOnePpsqft: number,
  tierTwoPpsqft: number
  tierThreePpsqft: number,
  tierFourPpsqft: number
}

export interface RegionData {
  type_1: ServicePricing,
  type_2: ServicePricing,
}

export type AllRegionData = {
  NLA: RegionData,
  SLA: RegionData,
  OC: RegionData,
  none: RegionData
}

export const allCachedRegionData: AllRegionData = {
    NLA: {
      'type_1': {
        basePrice: 159.00,
        tierOnePpsqft: .09,
        tierTwoPpsqft: .08,
        tierThreePpsqft: .07,
        tierFourPpsqft: .06
      },
      'type_2': {
        basePrice: 172.00,
        tierOnePpsqft: .09,
        tierTwoPpsqft: .08,
        tierThreePpsqft: .07,
        tierFourPpsqft: .06
      },
    },
    SLA: {
      'type_1': {
        basePrice: 179.00,
        tierOnePpsqft: .09,
        tierTwoPpsqft: .08,
        tierThreePpsqft: .07,
        tierFourPpsqft: .06
      },
      'type_2': {
        basePrice: 192.00,
        tierOnePpsqft: .09,
        tierTwoPpsqft: .08,
        tierThreePpsqft: .07,
        tierFourPpsqft: .06
      },
    },
    OC: {
      'type_1': {
        basePrice: 99.00,
        tierOnePpsqft: .09,
        tierTwoPpsqft: .08,
        tierThreePpsqft: .07,
        tierFourPpsqft: .06
      },
      'type_2': {
        basePrice: 112.00,
        tierOnePpsqft: .09,
        tierTwoPpsqft: .08,
        tierThreePpsqft: .07,
        tierFourPpsqft: .06
      },
    },
    none: {
      'type_1': {
        basePrice: 0.00,
        tierOnePpsqft: .00,
        tierTwoPpsqft: .00,
        tierThreePpsqft: .00,
        tierFourPpsqft: .06
      },
      'type_2': {
        basePrice: 0.00,
        tierOnePpsqft: .00,
        tierTwoPpsqft: .00,
        tierThreePpsqft: .00,
        tierFourPpsqft: .00
      },
    },
  }
const dynamicQuoteGenerator = (servicePricing: ServicePricing, sqft: number) => {
  if (!servicePricing) return 0
  if (!sqft) return 0
  // first 1k
  if (sqft <= 999) {
    return servicePricing.basePrice
  }

  // next 1k
  if (sqft <= 1999) {
    return servicePricing.basePrice + ((sqft - 999) * servicePricing.tierOnePpsqft)
  }

  // next 1k
  if (sqft <= 2999) {
    return servicePricing.basePrice + // first 1k
      1000 * servicePricing.tierOnePpsqft + // next 1k
      ((sqft - 1999) * servicePricing.tierTwoPpsqft) // remainder 1k
  }

  if (sqft <= 3999) {
    return servicePricing.basePrice + // first 1k
      1000 * servicePricing.tierOnePpsqft + // next 1k
      1000 * servicePricing.tierTwoPpsqft + // next 1k
      ((sqft - 2999)) * servicePricing.tierThreePpsqft // remainder
  }

  if (sqft > 3999) {
    return servicePricing.basePrice + // first 1k
      1000 * servicePricing.tierOnePpsqft + // next 1k
      1000 * servicePricing.tierTwoPpsqft + // next 1k
      1000 * servicePricing.tierThreePpsqft + // next 1k
      ((sqft - 3999)) * servicePricing.tierFourPpsqft  // remainder
  }
  return 0
}

export default dynamicQuoteGenerator;