import { client } from "@/db/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      {
        const response = await client.api.accounts.$get();

        if (response.ok) {
          const { data } = await response.json();
          return data;
        }

        throw new Error("Failed to fetch accounts");
      }
    },
  });

  return query;
};
