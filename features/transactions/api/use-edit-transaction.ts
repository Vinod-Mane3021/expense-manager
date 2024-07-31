import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { client } from "@/lib/hono";
import { showToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)[":id"]["$patch"]
>["json"];

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions[":id"].$patch({
        param: { id },
        json,
      });
      if (response.status == HttpStatusCode.UNAUTHORIZED) {
        throw new Error(ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE);
      }
      if (response.status == HttpStatusCode.BAD_REQUEST) {
        throw new Error(ResponseMessage.INVALID_INPUTS);
      }
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      throw new Error("Failed to edit transaction");
    },
    onSuccess: () => {
      showToast.success("Transaction updated");
      // This will refetch the all transactions, every time I create new transaction
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: invalidate summary
    },
    onError: (err) => {
      showToast.error(err.message);
      console.error("error in editing transaction : ", err.message);
    },
  });

  return mutation;
};
