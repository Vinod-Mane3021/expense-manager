import { db } from "@/lib/db";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetAccount = (id?: number) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["account", { id }],
    queryFn: async () => {
      const response = await client.api.accounts[":id"].$get({
        param: { id: String(id) },
      });

      if (response.ok) {
        const { data } = await response.json();
        return data;
      }

      throw new Error("Failed to fetch account");
    },
  });

  return query;
};
