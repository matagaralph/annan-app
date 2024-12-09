import { AxiosError } from "axios";

export function logger(error: unknown) {
  if (error instanceof AxiosError) {
    console.error(`${error?.response?.data.message}`);
    console.error(
      `zoho_code: ${error?.response?.data.code}: status: ${error?.response?.status}`,
    );
  } else {
    console.log(error);
  }
}
