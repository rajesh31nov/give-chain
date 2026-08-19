import { useQuery } from "@tanstack/react-query";
import { computeAnalytics } from "@/services/analyticsService";
import { AnalyticsSummary } from "@/types";

export const useAnalytics = () => {
  return useQuery<AnalyticsSummary, Error>({
    queryKey: ["analyticsSummary"],
    queryFn: computeAnalytics,
    staleTime: 1000 * 60, // 1 minute
  });
};
