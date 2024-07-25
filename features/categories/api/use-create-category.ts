import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { error } from "console";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.categories)["create"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)["create"]["$post"]
>["json"];

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories.create.$post({ json });
        const data = await response.json();
        if ("error" in data) {
          throw new Error(data.error);
        }
        return data;
    },
    onSuccess: () => {
      toast.success("New category has been created.");
      // This will refetch the all categories, every time I create new category
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return mutation;
};