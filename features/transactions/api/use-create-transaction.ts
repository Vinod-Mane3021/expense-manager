import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)["create"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["create"]["$post"]
>["json"];

export const useCreateTransactions = () => {
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
      toast.success("New transaction has been created.");
      // This will refetch the all transactions, every time I create new transaction
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: invalidate summery
    },
    onError: (err) => {
      toast.error(err.message);
      console.error("error in creating transaction : ", err.message);
    },
  });

  return mutation;
};
