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

    if (result.status === API_STATUS.ERROR) {
      throw new CustomError(result.code ?? 400, result.message);
    }

    return result;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        throw err;
      }

      throw new CustomError(
        err.response?.status ?? 500,
        err.response?.data?.message || err.message
      );
    }

    if (err instanceof CustomError) {
      throw err;
    }

    if (err instanceof Error) {
      throw new CustomError(500, err.message);
    }

    throw new CustomError(500, "Something went wrong");
  }
};
