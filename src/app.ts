import dayjs from "dayjs";
import fs from "fs/promises";
import path from "path";
import { configs } from "./configs";
import { dummy1 } from "./dummy1";
import { dummy2 } from "./dummy2";
import { dummy3 } from "./dummy3";
import type { CheapestFlight } from "./interfaces/cheapest-flight";
import { getAvailableFlights } from "./service/get-available-flights";
import { getFlightValue } from "./service/get-flight-value";

const initApp = async () => {
  let currentDate = dayjs(configs.startDate, "YYYY-MM-DD");
  const endDate = dayjs(configs.endDate, "YYYY-MM-DD");
  let dateList = [];

  console.log("Starting aplication...");

  if (currentDate.isAfter(endDate)) {
    console.log("Error: Start Date is after than End Date");
    return;
  }

  console.log("Verifying Azul Interline Api...");
  const isRequestWorking = await getAvailableFlights({
    origin: configs.origin,
    destination: configs.destination,
    departureDateTime: currentDate.format("YYYY-MM-DD"),
  });

  if (!isRequestWorking) {
    console.log("Error when trying access Azul Interline Api.");
    return;
  }

  while (currentDate.isBefore(endDate)) {
    const formattedDate = currentDate.format("YYYY-MM-DD");
    dateList.push(formattedDate);
    currentDate = currentDate.add(1, "day");
  }

  console.log("Getting all flights by selected date range...");

  const availableFlights =
    // [dummy1, dummy2, dummy3] ||
    (await Promise.all(
      dateList.map(async (date) => {
        return await getAvailableFlights({
          origin: configs.origin,
          destination: configs.destination,
          departureDateTime: date,
        });
      })
    ));

  const availableFlightsAsString = JSON.stringify(availableFlights, null, 2);
  try {
    console.log("Creating file with available flights...");
    await fs.writeFile(
      path.resolve(__dirname, "available-flights.json"),
      availableFlightsAsString
    );
    console.log("File saved with success");
  } catch (err) {
    console.error("Error when save Available Flights File", err);
  }

  console.log("Getting the price of flights and calculating the cheapest...");

  const flights = await Promise.all(
    availableFlights.map(async (availableFlight) => {
      if (!availableFlight) {
        return undefined;
      }

      return await Promise.all(
        availableFlight.departureFlights.flights.map(async (flight) => {
          const formattedDepartureDate =
            flight.departureDate.split("/").reverse().join("-") +
            "T" +
            flight.departureTime +
            ":00";

          const flightValue = await getFlightValue({
            items: {
              origin: configs.origin,
              destination: configs.destination,
              departureDate: formattedDepartureDate,
              partner: flight.operatingCarriers[0],
              cabin: "ECONOMY",
              classType: "PUBLIC",
              passengerType: "ADT",
            },
            value: {
              currency: flight.prices[0].currency,
              value: flight.prices[0].value,
            },
          });

          return {
            origin: configs.origin,
            destination: configs.destination,
            departureDate: `${flight.departureDate} ${flight.departureTime}`,
            finalArrivalDate: `${flight.finalArrivalDate} ${flight.finalArrivalTime}`,
            value: flightValue?.value,
            currency: flightValue?.currency,
          };
        })
      );
    })
  );

  const cheapestFlightPerDay = flights.map((flight) => {
    if (!flight) {
      return undefined;
    }

    return flight.reduce<CheapestFlight>((previousValue, currentValue) => {
      if (
        currentValue.value &&
        currentValue.currency &&
        (!previousValue.value || previousValue.value > currentValue.value)
      ) {
        return {
          origin: currentValue.origin,
          destination: currentValue.destination,
          departureDate: currentValue.departureDate,
          finalArrivalDate: currentValue.finalArrivalDate,
          value: currentValue.value,
          currency: currentValue.currency,
        };
      }

      return previousValue;
    }, {} as CheapestFlight);
  });

  const cheapestFlightsAsString = JSON.stringify(cheapestFlightPerDay, null, 2);
  try {
    console.log("Creating File with cheapest flights per day...");
    await fs.writeFile(
      path.resolve(__dirname, "cheapest-flights-per-days.json"),
      cheapestFlightsAsString
    );
    console.log("File saved with success");
  } catch (err) {
    console.error("Error when save Cheapest Flights per Days file", err);
  }
};

initApp();
