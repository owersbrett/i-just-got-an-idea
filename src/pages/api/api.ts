import axios, { AxiosError, AxiosResponse } from "axios";
import { Notification } from "@/common/types/notification";

export type SuccessCallback = (response: AxiosResponse<any>) => void;
export type ErrorCallback = (error: AxiosError) => void;
export class API {
  public static ideas = "/api/ideas";
  public static entries = "/api/entries";
  public static users = "/api/users";
  public static notification = "/api/notification";
  public static notifications = "/api/notifications";
  public static prompts = "/api/prompts";
  public static jargon = "/api/jargon";

  public static postError = async (userId: string, errorMessage: string): Promise<AxiosResponse> => {
    let errorNotification = Notification.new(userId, errorMessage, "error");
    return API.post(API.notifications, errorNotification, errorMessage);
  };

  public static post = async (path: string, data: any, errorMessage: string): Promise<AxiosResponse> => {
    return axios.post(path, data).then(
      (response) => {
        console.log("API.post: " +path);
        return response;
      },
      (error) => {
        console.error("API.post.error: " +errorMessage);
        throw error;
      }
    );
  };

  public static get = async (path: string, errorMessage: string): Promise<AxiosResponse> => {
    return axios.get(path).then(
      (response) => {
        console.info(response);
        return response;
      },
      (error) => {
        console.error(errorMessage);
        throw error;
      }
    );
  }

  public static setPoll = (
    pollingEndpoint: string,
    callback: SuccessCallback,
    errorCallback: ErrorCallback,
    delay: number
  ) => {
    let request = () => axios
      .get(pollingEndpoint, {
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then(callback, errorCallback);
    let id = setInterval(request, delay);
    return id;
  };
}
