import { useQuery } from "@tanstack/react-query";
import { fetchContractEvents, deduplicateEvents } from "@/services/eventService";
import { NormalizedEvent } from "@/types";

export const useActivityFeed = (campaignIdFilter?: string) => {
  return useQuery<NormalizedEvent[], Error>({
    queryKey: ["activityFeed", campaignIdFilter || "all"],
    queryFn: async () => {
      const events = await fetchContractEvents(campaignIdFilter);
      return deduplicateEvents(events);
    },
    refetchInterval: 10000, // Refetch every 10 seconds for real-time feed updates
    staleTime: 5000,
  });
};
