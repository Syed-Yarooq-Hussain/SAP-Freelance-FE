import { API_STATUS } from "@/constants/api_status";
import { CustomError } from "@/exceptions/custom-exception";
import { clearCachedSession } from "@/services/sessionCache";
import type { ApiResponse } from "@/types/api";
import { APP_ROUTES } from "@/utils/app_routes";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { signOut } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_URL!;
const instance = axios.create({ baseURL });

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Unauthorized (401). Session expired. Logging out.");

      try {
        clearCachedSession();
        await signOut({ redirect: false });
      } catch (e) {
        console.error("Error during forced logout:", e);
      }

      if (typeof window !== "undefined") {
        window.location.href = APP_ROUTES.LOGIN;
      }
    }

    return Promise.reject(error);
  }
);

export const request = async <P, R>(
  props: AxiosRequestConfig<P>
): Promise<ApiResponse<R>> => {
  try {
    const response = await instance(props);
    const result: ApiResponse<R> = response.data;

    // Validate result exists and has expected structure
    if (!result) {
      throw new CustomError(500, "Invalid response from server");
    }

    // Check if API returned an error status
    if (result.status === API_STATUS.ERROR) {
      const errorMessage = result.message || "An error occurred";
      const errorCode = result.code ?? 400;
      throw new CustomError(errorCode, errorMessage);
    }

    return result;
  } catch (err: unknown) {
    // If it's already a CustomError, re-throw it
    if (err instanceof CustomError) {
      throw err;
    }

    // Handle Axios errors
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        throw err;
      }

      const errorMessage = err.response?.data?.message || err.message || "Request failed";
      const errorCode = err.response?.status ?? 500;
      throw new CustomError(errorCode, errorMessage);
    }

    // Handle generic Error instances
    if (err instanceof Error) {
      throw new CustomError(500, err.message || "An unexpected error occurred");
    }

    // Fallback for unknown error types
    throw new CustomError(500, "Something went wrong");
  }
};
