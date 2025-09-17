import { ApiResponse } from "@/types/api";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL!;
const instance = axios.create({ baseURL });

export const request = async <P, R>(
  props: AxiosRequestConfig<P>
): Promise<ApiResponse<R>> => {
  try {
    const response = await instance(props);
    const result = response.data;
    console.log("API Response:", result);
    return result;
  } catch (err: unknown) {
    const error = err as AxiosError;
    const errorResponse = {
      error: {
        message: "Something went wrong",
        code: error.response?.status,
      },
    };

    return errorResponse as ApiResponse<R>;
  }
};
