import { toast } from "react-toastify";

const options = {
  position: "bottom-right"
};

const showToast = (content, isError) => {
  const { error, ok, statusCode } = content || {};
  if (typeof content === "object") {
    content =
      content?.msg?.message ||
      content?.msg?.name ||
      content?.message ||
      content?.msg ||
      content?.error ||
      content?.type;
  }
  if (typeof content !== "string") {
    if (typeof content === "object" && Object.keys(content).length === 0) {
      content = "System Error";
    } else {
      content = JSON.stringify(content);
    }
  }

  if (error || content?.startsWith("Cannot read") || ok === 0 || statusCode >= 400) {
    isError = true;
  }

  if (isError) {
    return toast.error(content, options);
  }
  return toast.success(content || "Ok", options);
};

export default showToast;
