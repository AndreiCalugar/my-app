declare module "amadeus" {
  export default class Amadeus {
    constructor(config: { clientId: string; clientSecret: string });

    get(endpoint: string, params: any): Promise<any>;

    referenceData: {
      locations: {
        hotels: {
          byCity: {
            get(params: {
              cityCode: string;
              radius?: number;
              radiusUnit?: "KM" | "MILE";
              amenities?: string[];
              ratings?: string[];
              hotelSource?: "BEDBANK" | "DIRECTCHAIN" | "ALL";
            }): Promise<any>;
          };
        };
      };
    };

    shopping: {
      hotelOffers: {
        get(params: {
          hotelIds?: string[];
          cityCode?: string;
          checkInDate: string;
          checkOutDate: string;
          roomQuantity: number;
          adults: number;
          priceRange?: string;
          currency?: string;
          paymentPolicy?: string;
          bestRateOnly?: boolean;
          includeClosed?: boolean;
        }): Promise<any>;
      };
    };
  }
}
