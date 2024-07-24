import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts["create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["create"]["$post"]>["json"];

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts.create.$post({ json });
      if(response.status == HttpStatusCode.UNAUTHORIZED) {
        throw new Error(ResponseMessage.UNAUTHORIZED_TO_ACCESS_RESOURCE);
      }
      if(!response.ok) {
        throw new Error("Failed to create account");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success("New account has been created.");
      // This will refetch the all accounts, every time I create new account
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (err) => {
      toast.error(err.message);
      console.error("err in creating acc : ", err.message)
    },
  });

  return mutation;
};


