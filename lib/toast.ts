import { toast, ExternalToast } from "sonner";

// Define the type for the wrapper function
type ShowToast = typeof toast;

// Default action for all toasts
const defaultAction = {
    label: "Close",
    onClick: () => {}
};

// Create the wrapper function
const showToast: ShowToast = ((message: string | React.ReactNode, data?: ExternalToast) => {
    // Add the default action to the data if it doesn't already have one
    const updatedData = {
        ...data,
        action: data?.action || defaultAction
    };
    return toast(message, updatedData);
}) as ShowToast;

// Extend the wrapper function with the same methods as toast
showToast.success = (message: string | React.ReactNode, data?: ExternalToast) => {
    const updatedData = {
        ...data,
        action: data?.action || defaultAction
    };
    return toast.success(message, updatedData);
};

showToast.info = (message: string | React.ReactNode, data?: ExternalToast) => {
    const updatedData = {
        ...data,
        action: data?.action || defaultAction
    };
    return toast.info(message, updatedData);
};

showToast.warning = (message: string | React.ReactNode, data?: ExternalToast) => {
    const updatedData = {
        ...data,
        action: data?.action || defaultAction
    };
    return toast.warning(message, updatedData);
};

showToast.error = (message: string | React.ReactNode, data?: ExternalToast) => {
    const updatedData = {
        ...data,
        action: data?.action || defaultAction
    };
    return toast.error(message, updatedData);
};

showToast.custom = (jsx: (id: number | string) => React.ReactElement, data?: ExternalToast) => {
    const updatedData = {
        ...data,
        action: data?.action || defaultAction
    };
    return toast.custom(jsx, updatedData);
};

showToast.message = (message: string | React.ReactNode, data?: ExternalToast) => {
    const updatedData = {
        ...data,
        action: data?.action || defaultAction
    };
    return toast.message(message, updatedData);
};

// @ts-expect-error
showToast.promise = <ToastData>(promise: Promise<ToastData>, data?: ExternalToast) => {
    const updatedData = {
        ...data,
        action: data?.action || defaultAction
    };
    return toast.promise(promise, updatedData);
};

showToast.dismiss = (id?: number | string) => toast.dismiss(id);
showToast.loading = (message: string | React.ReactNode, data?: ExternalToast) => {
    const updatedData = {
        ...data,
        action: data?.action || defaultAction
    };
    return toast.loading(message, updatedData);
};

showToast.getHistory = () => toast.getHistory();

// Now you can use showToast with the default action
showToast.info("You have not changed any value");

export { showToast };
