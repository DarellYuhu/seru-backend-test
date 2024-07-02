declare type TResponse<T = unknown> = {
  status: "Success" | "Failed";
  message: string;
  data?: T;
  error?: T;
};
