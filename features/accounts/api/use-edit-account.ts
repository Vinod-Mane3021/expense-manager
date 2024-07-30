import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)[":id"]["$patch"]
>["json"];

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts[":id"].$patch({
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
      throw new Error("Failed to edit account");
    },
    onSuccess: () => {
      toast.success("Account updated");
      // This will refetch the all accounts, every time I create new account
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      // TODO: invalidate summary and transactions
    },
    onError: (err) => {
      toast.error(err.message);
      console.error("error in editing acc : ", err.message);
    },
  });

  return mutation;
};
