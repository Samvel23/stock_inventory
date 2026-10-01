import {
  requestInterceptor,
  responseErrorInterceptor,
  responseInterceptor,
} from "@/api/interceptors";

import { apiClient } from "./apiClient";

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor,
);

export { apiClient };
