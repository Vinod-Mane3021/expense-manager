import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.categories)["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<(typeof client.api.categories)["bulk-delete"]["$post"]>["json"];

export const useDeleteCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories["bulk-delete"].$post({ json });
      if (response.status == HttpStatusCode.UNAUTHORIZED) {
        throw new Error(ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE);
      }
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      const error = json.ids.length > 1 ? "Failed to delete categories." : "Failed to delete category.";
      throw new Error(error);
    },
    onSuccess: (data, json) => {
      const idsLength = json.ids.length;
      const message = idsLength > 1 ? " categories deleted." : " category deleted.";
      toast.success(idsLength + message);
      // This will refetch the all categories, every time I delete category
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // TODO: also invalidate summary
    },
    onError: (error, { ids }) => {
      toast.error(error.message);
    },
  });
  return mutation;
};
