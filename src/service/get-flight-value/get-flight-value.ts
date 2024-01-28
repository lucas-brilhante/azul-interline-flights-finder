import axios, { AxiosError } from "axios";
import { FlightValue } from "../../interfaces/flight-value";
import type { GetFlightValueParams } from "./interfaces";

export const getFlightValue = async (
  params: GetFlightValueParams
): Promise<FlightValue | undefined> => {
  return fetch(
    "https://interline.tudoazul.com/exchange/api/v1/exchange/getPoints",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(params),
      method: "POST",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("getFlightValue::Request failed:", error.message);
      return undefined;
    });
};
