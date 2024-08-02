import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { client } from "@/db/hono";
import { showToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-delete"].$post({ json });
      if (response.status == HttpStatusCode.UNAUTHORIZED) {
        throw new Error(ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE);
      }
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      const error = json.ids.length > 1 ? "Failed to delete transactions" : "Failed to delete transaction";
      throw new Error(error);
    },
    onSuccess: (data, json) => {
      const idsLength = json.ids.length;
      const message = idsLength > 1 ? " transactions deleted." : " transaction deleted.";
      showToast.success(idsLength + message);
      // This will refetch the all transactions, every time I delete transaction
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: also invalidate summary
    },
    onError: (error) => {
      showToast.error(error.message);
    },
  });
  return mutation;
};
