import { configs } from "../../configs";
import { FlightAvailability } from "../../interfaces/flight-availability";
import type { GetAvailableFlightsParams } from "./interfaces";

export const getAvailableFlights = async ({
  origin,
  destination,
  departureDateTime,
}: GetAvailableFlightsParams): Promise<FlightAvailability | undefined> => {
  return fetch(
    `https://interline.tudoazul.com/catalog/api/v1/availability?&tripType=ONE_WAY&origin=${origin}&destination=${destination}&adult=1&child=0&infant=0&typeOfFlight=ALL&companiesIdentity=-&cabinCategory=ECONOMY&departureDateTime=${departureDateTime}T00:00:00-03:00`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "pt-BR,pt;q=0.9",
        "sec-ch-ua":
          '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie: configs.cookies,
        Referer: `https://interline.tudoazul.com/flights/OW/${origin}/${destination}/-/-/${departureDateTime}/-/1/0/0/0/0/ALL/F/ECONOMY/-/-/-/-/A/-`,
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erro ao fazer a requisição:", error.message);
      return undefined;
    });
};
