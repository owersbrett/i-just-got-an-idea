import axios, { AxiosResponse } from "axios";

export class API {
    public static  post = async (path: string, data: any, errorMessage: string,): Promise<AxiosResponse> => {

        return axios.post(path, data)
            .then((response) => {
                console.log(response);
                return response;
            }, (error) => {
                throw error;
            });
    }
}