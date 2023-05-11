export const API_BASE_URL = "https://www.ijustgotanidea.com/api/";

export const API_ENDPOINTS = {
  IDEA: {
    GET_ALL: `${API_BASE_URL}/ideas`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/ideas/${id}`,
    CREATE: `${API_BASE_URL}/ideas`,
    UPDATE: (id: string) => `${API_BASE_URL}/ideas/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/ideas/${id}`,
  },
  TASK: {
    GET_ALL: `${API_BASE_URL}/tasks`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/tasks/${id}`,
    CREATE: `${API_BASE_URL}/tasks`,
    UPDATE: (id: string) => `${API_BASE_URL}/tasks/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/tasks/${id}`,
  },
  PROJECT: {
    GET_ALL: `${API_BASE_URL}/projects`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/projects/${id}`,
    CREATE: `${API_BASE_URL}/projects`,
    UPDATE: (id: string) => `${API_BASE_URL}/projects/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/projects/${id}`,
  },
  USER: {
    GET_ALL: `${API_BASE_URL}/users`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
    CREATE: `${API_BASE_URL}/users`,
    UPDATE: (id: string) => `${API_BASE_URL}/users/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
  },
};
