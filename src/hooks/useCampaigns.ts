import { useQuery } from "@tanstack/react-query";
import { fetchCampaigns, fetchCampaignById } from "@/services/contractService";
import { Campaign } from "@/types";

export const useCampaigns = () => {
  return useQuery<Campaign[], Error>({
    queryKey: ["campaigns"],
    queryFn: fetchCampaigns,
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useCampaignDetails = (id: string) => {
  return useQuery<Campaign | null, Error>({
    queryKey: ["campaign", id],
    queryFn: () => fetchCampaignById(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
};
