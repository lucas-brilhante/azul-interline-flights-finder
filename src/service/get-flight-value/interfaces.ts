export interface GetFlightValueParams {
  items: {
    origin: string;
    destination: string;
    cabin: string;
    partner: string;
    departureDate: string;
    classType: string;
    passengerType: string;
  };
  value: {
    value: number;
    currency: string;
  };
}
