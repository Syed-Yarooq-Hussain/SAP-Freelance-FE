import { CONSULTANT_STATUS } from "@/constants/status";

export const normalizeStatus = (status: string): string => {
  switch (status) {
    case CONSULTANT_STATUS.SHORTLISTED:
      return "Shortlisted";

    case CONSULTANT_STATUS.INTERVIEW_SCHEDULE:
      return "Interview Schedule";

    case CONSULTANT_STATUS.INTERVIEWED:
      return "Interviewed";

    case CONSULTANT_STATUS.OFFERED:
      return "Offered";

    case CONSULTANT_STATUS.HIRED:
      return "Hired";

    case CONSULTANT_STATUS.REJECTED:
      return "Rejected";

    default:
      return status;
  }
};
