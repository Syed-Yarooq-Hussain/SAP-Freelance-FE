import { API_STATUS } from "@/constants/api_status";
import { ApiResponse } from "@/types/api";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { CustomError } from "@/exceptions/custom-exception";

const baseURL = process.env.NEXT_PUBLIC_API_URL!;
const instance = axios.create({ baseURL });

export const request = async <P, R>(
  props: AxiosRequestConfig<P>
): Promise<ApiResponse<R>> => {
  try {
    const response = await instance(props);
    const result: ApiResponse<R> = response.data;

    if (result.status === API_STATUS.ERROR) {
      throw new CustomError(result.code, result.message);
    }

    return result;
  } catch (err: unknown) {
    const errorResponse: ApiResponse<R> = {
      message: "Something went wrongsss",
      code: 500,
      status: API_STATUS.ERROR,
      data: null,
    };

    if (err instanceof CustomError) {
      errorResponse.message = err.message;
      errorResponse.code = err.statusCode;
    } else if (err instanceof AxiosError) {
      errorResponse.message = err.message;
      errorResponse.code = Number(err.response?.status);
    } else if (err instanceof Error) {
      errorResponse.message = err.message;
    }

    return errorResponse;
  }
};
