import { client } from "@/db/hono";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;
  const accountId = params.get("accountId") || undefined;

  const query = useQuery({
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      if (response.ok) {
        const { data } = await response.json();
        console.log("data from back ")
        console.log({ data })
        return data;
      }

      throw new Error("Failed to fetch summary");
    },
  });

  return query;
};
