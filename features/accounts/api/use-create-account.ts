import { HttpStatusCode } from "@/constants/http-status-code";
import { ResponseMessage } from "@/constants/response-messages";
import { client } from "@/lib/hono";
import { showToast } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)["create"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)["create"]["$post"]
>["json"];

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts.create.$post({ json });
      const data = await response.json();
      if ("error" in data) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      showToast.success("New account has been created.");
      // This will refetch the all accounts, every time I create new account
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (err) => {
      showToast.error(err.message);
      console.error("error in creating account : ", err.message);
    },
  });

  return mutation;
};
