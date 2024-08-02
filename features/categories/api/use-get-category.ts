import { client } from "@/db/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["category", { id }],
    queryFn: async () => {
      const response = await client.api.categories[":id"].$get({
        param: { id },
      });

      if (response.ok) {
        const { data } = await response.json();
        return data;
      }
      
      throw new Error("Failed to fetch categories");
    },
  });

  return query;
};
