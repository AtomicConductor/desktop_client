import * as axios from "axios";
import UnauthorizedError from "../errors/unauthorizedError";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  ({ response, message }) => {
    if (response) {
      const { status } = response;
      if (status === 401) {
        throw new UnauthorizedError();
      }
    }
    throw new Error(message);
  }
);

export default axiosInstance;
