import HttpStatusCode from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>["json"];

export const useDeleteAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts["bulk-delete"].$post({ json });
      if (response.status == HttpStatusCode.UNAUTHORIZED) {
        throw new Error(ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE);
      }
      if (!response.ok) {
        throw new Error("Failed to create account");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: (data, json) => {
      const idsLength = json.ids.length;
      const message = idsLength > 1 ? " account's deleted." : " account deleted.";
      toast.success(idsLength + message);
      // This will refetch the all accounts, every time I delete account
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      // TODO: also invalidate summary
    },
    onError: (error) => {
      toast.success("Failed to delete accounts.");
    },
  });
  return mutation;
};
