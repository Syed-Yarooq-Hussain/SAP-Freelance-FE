import { API_STATUS } from "@/constants/api_status";
import { getCachedSession } from "@/services/sessionCache";
import type {
  FeatureTourResponse,
  OnboardingStatusResponse,
  OnboardingStep,
} from "@/types/onboarding";
import { API_ROUTES } from "@/utils/api_routes";
import { request } from "@/utils/request";

async function getAuthHeaders() {
  const session = await getCachedSession();
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Authorization token not found");
  }

  return { Authorization: `Bearer ${token}` };
}

export async function getOnboardingStatusService() {
  const headers = await getAuthHeaders();

  const res = await request<null, OnboardingStatusResponse>({
    url: API_ROUTES.ONBOARDING_STATUS,
    method: "GET",
    headers,
  });

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Failed to fetch onboarding status");
  }

  return res.data;
}

export async function patchOnboardingStepService(step: OnboardingStep) {
  const headers = await getAuthHeaders();

  const res = await request<{ step: OnboardingStep }, OnboardingStatusResponse>(
    {
      url: API_ROUTES.ONBOARDING_STEP,
      method: "PATCH",
      headers,
      data: { step },
    },
  );

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Failed to advance onboarding step");
  }

  return res.data;
}

export async function completeOnboardingService() {
  const headers = await getAuthHeaders();

  const res = await request<null, OnboardingStatusResponse>({
    url: API_ROUTES.ONBOARDING_COMPLETE,
    method: "POST",
    headers,
  });

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Failed to complete onboarding");
  }

  return res.data;
}

export async function getFeatureTourService(key: string) {
  const headers = await getAuthHeaders();

  const res = await request<null, FeatureTourResponse>({
    url: API_ROUTES.ONBOARDING_TOUR(key),
    method: "GET",
    headers,
  });

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Failed to fetch feature tour");
  }

  return res.data;
}

export async function patchFeatureTourService(
  key: string,
  status: FeatureTourResponse["status"],
) {
  const headers = await getAuthHeaders();

  const res = await request<
    { status: FeatureTourResponse["status"] },
    FeatureTourResponse
  >({
    url: API_ROUTES.ONBOARDING_TOUR(key),
    method: "PATCH",
    headers,
    data: { status },
  });

  if (res.status === API_STATUS.ERROR) {
    throw new Error(res.message || "Failed to update feature tour");
  }

  return res.data;
}
