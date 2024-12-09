import axios from "axios";
import { logger } from "./logger";

async function getAccessToken() {
  try {
    const { data } = await axios.post(
      "https://accounts.zoho.eu/oauth/v2/token",
      null,
      {
        params: {
          refresh_token: process.env.ZOHO_REFRESH_TOKEN,
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          redirect_uri: "https://google.com",
          grant_type: "refresh_token",
        },
      },
    );
    return data.access_token;
  } catch (error: unknown) {
    logger(error);
  }
}

const zohoApi = axios.create({
  baseURL: "https://www.zohoapis.eu/inventory/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  params: {
    organization_id: process.env.ZOHO_ORGANISATION_ID,
  },
});

zohoApi.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();
  config.headers.Authorization = `Zoho-oauthtoken ${accessToken}`;
  return config;
});

function formatDate(isoString: string) {
  const date = new Date(isoString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function mapAddress(address: Address) {
  if (!address)
    return {
      address: "",
      attention: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    };

  return {
    address: address.address1 || "",
    attention: `${address.first_name || ""} ${address.last_name || ""}`.trim(),
    city: address.city || "",
    zip: address.zip || "",
    country: address.country || "",
  };
}

async function fetchAllData<T>(
  endpoint: string,
  property: string,
): Promise<T[]> {
  let allData: T[] = [];
  let currentPage = 1;

  while (true) {
    const response = await zohoApi.get(endpoint, {
      params: {
        page: currentPage,
      },
    });
    allData = allData.concat(response.data[property]);
    const pageContext = response.data.page_context;
    if (!pageContext.has_more_page) {
      break;
    }
    currentPage++;
  }

  return allData;
}

export { zohoApi, formatDate, mapAddress, fetchAllData };
