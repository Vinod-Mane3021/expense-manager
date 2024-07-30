import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetCategory = (id?: number) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["category", { id }],
    queryFn: async () => {
      const response = await client.api.categories[":id"].$get({
        param: { id: String(id) },
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
