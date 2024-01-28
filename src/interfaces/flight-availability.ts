interface Price {
  category: string;
  passenger: string;
  value: number;
  differenceValue: number | null;
  currency: string;
  classType: string;
}

interface Baggage {
  category: string;
  quantity: number;
  weight: number | null;
}

interface Fee {
  total: {
    value: number;
    currency: string;
  };
}

interface Fare {
  [key: string]: {
    cabinProduct: string;
    classOfService: string;
    fareBasis: string;
    fareTypes: string[];
  };
}

interface Recommendation {
  departureCategory: string;
  departureBookingClass: string;
  returnFlights: any[] | null;
  fee: Fee;
  fare: Fare;
  validateCompany: string;
  othersFee: any[];
}

interface FlightGroup {
  flightNumber: number;
  origin: string;
  originAirportName: string;
  destination: string;
  destinationAirportName: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  dateVariation: number;
  marketingCarrier: string;
  operatingCarrier: string;
  hasExchangeAirport: boolean;
  throughFlight: boolean;
}

interface FlightData {
  id: number;
  originAirport: string;
  originAirportName: string;
  finalDestination: string;
  finalDestinationName: string;
  departureDate: string;
  departureTime: string;
  finalArrivalDate: string;
  finalArrivalTime: string;
  dateVariation: number;
  firstFlightNumber: number;
  operatingCarriers: string[];
  prices: Price[];
  baggage: Baggage[];
  connection: number;
  hasExchangeAirport: boolean;
  throughFlight: number;
  fareOriginType: string;
  recommendations: Recommendation[];
  flightGroup: FlightGroup[];
  elapsedFlightTime: string;
}

export interface Flight {
  date: string;
  flights: FlightData[];
}

export interface FlightAvailability {
    departureFlights: Flight;
    origin: string;
    finalDestination: string;
}