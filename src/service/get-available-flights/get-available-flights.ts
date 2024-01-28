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
        cookie:
          "utag_main_v_id=018d4a7622ef00946c471c13386005065006605d00bd0; rxVisitor=1706357757456B6SR68FHMTF39FNLCKR7BHS3UE2K3I9F; CONSENTMGR=ts:1706359029190%7Cconsent:true; utag_main_vapi_domain=tudoazul.com; utag_main__ga=018d4a7622ef00946c471c13386005065006605d00bd0; cro_test=true; AMCVS_04EA1613539237590A490D4D%40AdobeOrg=1; au_vtid=_1706367346705; s_cc=true; _stLang=pt; _funilid=fluxo-compra; s_sq=%5B%5BB%5D%5D; dtCookie=v_4_srv_22_sn_UGKHPD0PUQU0DLBD6D8KR3H66GJVI1PH_app-3Ad748d36491f1b858_1_app-3Abef320eaaad88b11_1_ol_0_perc_100000_mul_1; cto_bundle=1ekW3F83WEo5bXBzMmdOb2NWMDVvMHJNWWJKSU1OZk1PdzV2ZkNHbUo3cjdaeTNNRDQxajBYRm1WOHVrTk42JTJCSFElMkI1RUYwcCUyRjQ3cU9WQjNIbE8zMHFCVEI1bExCOUlPRlNqYjE2aThvWnBZMkF3Yld6a3BLZDAwd2lwWUJRR011R0U1aXY1SEFvcyUyQkU2dFNiSGlWbGFSdXRpUlFZaUlmM0JxbTJZalBEc25OZHdqUSUzRA; previousVisit=oneWay|FOR|1N|Pinto%20Martins%20International%2C%20Fortaleza%20-%20BR|LIS|1N|Lisboa%2C%20Lisbon%20-%20PT|2024-05-14T03:00:00.000Z||1|0|0|ECONOMY|A|-|#oneWay|FOR|1N|Pinto%20Martins%20International%2C%20Fortaleza%20-%20BR|LIS|1N|Lisboa%2C%20Lisbon%20-%20PT|2024-11-23T03:00:00.000Z||1|0|0|ECONOMY|A|-|#oneWay|FOR|1N|Pinto%20Martins%20International%2C%20Fortaleza%20-%20BR|LIS|1N|Lisboa%2C%20Lisbon%20-%20PT|2024-11-20T03:00:00.000Z||1|0|0|ECONOMY|A|-|; _clck=1xgqskg%7C2%7Cfis%7C0%7C1487; AMCV_04EA1613539237590A490D4D%40AdobeOrg=-330454231%7CMCMID%7C82188076791313032043950240601300143209%7CMCAAMLH-1707034196%7C4%7CMCAAMB-1707034196%7C6G1ynYcLPuiQxYZrsz_pkqfLG9yMXBpb2zX5dvJdYQJzPXImdj0y%7CMCOPTOUT-1706436596s%7CNONE%7CvVersion%7C3.1.2%7CMCSYNCSOP%7C411-19757; ak_bmsc=5CB0C4EC883377953A8A74B39E7DDFFA~000000000000000000000000000000~YAAQB0LbF6AnyUCNAQAAXjgeTxZe2clgt2a5h1oSygUEvxiOXaOZj6cAroq6cthvsgP3/v1QiWwmzfDW14gybCE96x3PmpeFyldD9s4eB6cD8Q23GGKLOFBdbnpZ1LVKcDdtMJ9s2Sl/c7RQ/fGRMrip4nkfCfSwxspBYycOQJZfGG3C5u0ZrcWApIXAbK9dWx3vmGl7/tXQpN1H+pV0dHmyiBg2UmPG0wLAelKjImNMqtA8M2sw3jLjEjd+jriY30XXJbR6rMTVqS/zn5OSttKqlhEULmhgoKH+5n3IsqZm9VaJ6AIg8C2Lv1RptH2Mj7hJsA/zJMG8dTejajd2QIhnW/7XSu+8hUkk8T+gXkzt7BfiQFAa/DBzHZT51b1HKw0GUnG0sIdAc2RcHmYN0X3WNMlaOApY0X+oCMMyda2HA76DAJu45gNu8yBYjKKRiUgYKoTtZfl6S0RwiZGs3tBJEphfCHJ5jBxvxyAtocNNLCLq6OgN; bm_sz=1825B6E433E0B5E25D1B31424F9564F3~YAAQ7qQSAkjNcRONAQAAsfVGTxZD2it+WW3GE+MDYmCdDcVmg4TnlulAvpKYFYWVNBvvae72v9Z2fpxd+P/MbF9qULKr3iroa8gD4AnrPad9stbUGVvxJoANF/qgHXWy0pU5FuJmMdz4lKAhz1H/qKDFfujN6KZUOYrZK1q55BDhQLo3ixdKpY1RN59QGnToN+PDNzyTq2golxvFOe9FnsOX6I9AIIM5PSMlZP+kp4II4JZWTqCv7OynOmw9h4R6T+i4Hyo+U9vMC9J9LuWa0xzx/wi+VzOTQrDL0oGRyqtop7Vk7+1MIAJlzWy30Pyb6R6x48N/jclSVyuPgM1JqKKINH2F7wMDt4jeFPeBzQMZDTLMcjwc~4539193~3355458; utag_main__sn=7; utag_main_ses_id=1706432070854%3Bexp-session; utag_main_dc_visit=7; dtSa=-; utag_main__ss=0%3Bexp-session; utag_main_dc_region=us-east-1%3Bexp-session; bm_sv=361C0FA4BBB890F666518B359B73640A~YAAQ7KQSAhqDFgONAQAAlVhXTxbigNkLE+94X/eDxHxKzCsKn0SVoQiBtkORbYApFlx0GDckfq+UrKdQQQSktDy9V3ZG0zM3VxO3ch3NI1s9vmMkUBw0/o7xxpvsJPd4V8pNeTY+mVBXuFo4Xdz6Fu7qBNimg4bLkBDmW5RAg00unEtZt789QdKTz1aUNv2qZijA2EKdzvWzHtNV/nsolHKf/dKLltFk1h0oIFX84k1xCHmkXm1ahUaKcnJilHWkUCrf~1; utag_main__pn=2%3Bexp-session; utag_main__se=5%3Bexp-session; utag_main__st=1706434942253%3Bexp-session; utag_main_dc_event=5%3Bexp-session; _prevPage=; _uetsid=c9bda4f0bd1011eeae90d7c1d0fe4665; _uetvid=c9bdad30bd1011ee964d71b7404e2e69; _abck=9C0E7B5467E7DA32A54B70F275423B0C~0~YAAQ7KQSAjmDFgONAQAATGFXTwuO5ZqRP7LsVCqau76z1A630EBrVqC20QQHHRPI+VSxodzEZ1BN4dp1TXSolUjgCW5kyVZYiNir4nbgF1K0zO1hkO08bb6UlTPfRrmR1FjkXDR0Ty6jipdKA2Yi4N/mM1YF6XjTE6GOMCmE+WfBxk8QdsAskVjoYSEOmy2+eicFVbRvMBAgSNkNK7JRXF2wB6n94iMvhooessl0tZKq5BpkyxDazz+GCIWhvB+M1IOG8M59i9Agdg0CpTaxuvAN9Izc/M3Sikqh2ULbT7JQ0HIa9BJ6zduqmYowWAc/yG1OVXYn257EBDDO3+J/OXgsYsbd0kzaWMQR4hkIm9PMC4udfQo2lZCXxtejqciNHdu0r64Qu1KVlrL8hPhw1Zeg0znXyte2OQ==~-1~-1~-1; _clsk=xfb6m2%7C1706433144041%7C8%7C0%7Cs.clarity.ms%2Fcollect; rxvt=1706434969108|1706431201209; dtPC=22$33142964_176h2vGFRCCQUPUWMBRLLHTVVMULJKODIARIFB-0e0",

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
