import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { client } from "@/db/hono";
import { showToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)["create"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["create"]["$post"]
>["json"];

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions.create.$post({ json });
      const data = await response.json();
      if ("error" in data) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      showToast.success("New transaction has been created.");
      // This will refetch the all transactions, every time I create new transaction
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (err) => {
      showToast.error(err.message);
      console.error("error in creating transaction : ", err.message);
    },
  });

  return mutation;
};
