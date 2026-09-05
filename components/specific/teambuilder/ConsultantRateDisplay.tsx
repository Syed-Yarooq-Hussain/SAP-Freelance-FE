import type { TeamBuilderRow } from "@/types/teamBuilder";
import { formatHourlyRate } from "@/utils/rates";
import { Box, Typography } from "@mui/material";

type ConsultantRateDisplayProps = Pick<
  TeamBuilderRow,
  | "rateValue"
  | "baseRate"
  | "profitMarginPercentage"
  | "currency"
  | "showAdminPricing"
>;

export default function ConsultantRateDisplay({
  rateValue,
  baseRate,
  profitMarginPercentage,
  currency = "USD",
  showAdminPricing = false,
}: ConsultantRateDisplayProps) {
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#1E293B" }}>
        {formatHourlyRate(rateValue, currency)}/hr
      </Typography>
      {showAdminPricing ? (
        <Typography sx={{ fontSize: "10px", color: "#64748B", whiteSpace: "nowrap" }}>
          Base {formatHourlyRate(baseRate, currency)} · Margin {profitMarginPercentage ?? 0}%
        </Typography>
      ) : null}
    </Box>
  );
}
