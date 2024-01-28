"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const configs_1 = require("./configs");
const get_available_flights_1 = require("./service/get-available-flights");
const get_flight_value_1 = require("./service/get-flight-value");
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    let currentDate = (0, dayjs_1.default)(configs_1.configs.startDate, "YYYY-MM-DD");
    const endDate = (0, dayjs_1.default)(configs_1.configs.endDate, "YYYY-MM-DD");
    let dateList = [];
    console.log("Starting aplication...");
    if (currentDate.isAfter(endDate)) {
        console.log("Error: Start Date is after than End Date");
        return;
    }
    console.log("Verifying Azul Interline Api...");
    const isRequestWorking = yield (0, get_available_flights_1.getAvailableFlights)({
        origin: configs_1.configs.origin,
        destination: configs_1.configs.destination,
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
    (yield Promise.all(dateList.map((date) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, get_available_flights_1.getAvailableFlights)({
            origin: configs_1.configs.origin,
            destination: configs_1.configs.destination,
            departureDateTime: date,
        });
    }))));
    const availableFlightsAsString = JSON.stringify(availableFlights, null, 2);
    try {
        console.log("Creating file with available flights...");
        yield promises_1.default.writeFile(path_1.default.resolve(__dirname, "available-flights.json"), availableFlightsAsString);
        console.log("File saved with success");
    }
    catch (err) {
        console.error("Error when save Available Flights File", err);
    }
    console.log("Getting the price of flights and calculating the cheapest...");
    const flights = yield Promise.all(availableFlights.map((availableFlight) => __awaiter(void 0, void 0, void 0, function* () {
        if (!availableFlight) {
            return undefined;
        }
        return yield Promise.all(availableFlight.departureFlights.flights.map((flight) => __awaiter(void 0, void 0, void 0, function* () {
            const formattedDepartureDate = flight.departureDate.split("/").reverse().join("-") +
                "T" +
                flight.departureTime +
                ":00";
            const flightValue = yield (0, get_flight_value_1.getFlightValue)({
                items: {
                    origin: configs_1.configs.origin,
                    destination: configs_1.configs.destination,
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
                origin: configs_1.configs.origin,
                destination: configs_1.configs.destination,
                departureDate: `${flight.departureDate} ${flight.departureTime}`,
                finalArrivalDate: `${flight.finalArrivalDate} ${flight.finalArrivalTime}`,
                value: flightValue === null || flightValue === void 0 ? void 0 : flightValue.value,
                currency: flightValue === null || flightValue === void 0 ? void 0 : flightValue.currency,
            };
        })));
    })));
    const cheapestFlightPerDay = flights.map((flight) => {
        if (!flight) {
            return undefined;
        }
        return flight.reduce((previousValue, currentValue) => {
            if (currentValue.value &&
                currentValue.currency &&
                (!previousValue.value || previousValue.value > currentValue.value)) {
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
        }, {});
    });
    const cheapestFlightsAsString = JSON.stringify(cheapestFlightPerDay, null, 2);
    try {
        console.log("Creating File with cheapest flights per day...");
        yield promises_1.default.writeFile(path_1.default.resolve(__dirname, "cheapest-flights-per-days.json"), cheapestFlightsAsString);
        console.log("File saved with success");
    }
    catch (err) {
        console.error("Error when save Cheapest Flights per Days file", err);
    }
});
initApp();
