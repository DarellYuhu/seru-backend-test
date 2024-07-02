type Metadata = {
  page: number;
  limit: number;
  totalItem: number;
  totalAll: number;
  totalPage: number;
};

declare type TResponse<T = unknown, M = Metadata> = {
  status: "Success" | "Failed";
  message: string;
  metadata?: M;
  data?: T;
  error?: T;
};
