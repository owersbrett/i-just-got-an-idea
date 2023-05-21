import axios, { AxiosResponse } from "axios";
import {Notification} from "@/common/types/notification";
export class API {
  public static ideas = "/api/ideas";
  public static entries = "/api/entries";
  public static users = "/api/users";
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
        console.log(response);
        return response;
      },
      (error) => {
        console.log(errorMessage)
        throw error;
      }
    );
  };
}
