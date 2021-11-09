import axios from 'axios';
import config from "./../config";
import Cookie from "js-cookie"


// default
const apiLinkUrl = localStorage.getItem("baseApi")
axios.defaults.baseURL = apiLinkUrl || config.API_URL;

// content type
axios.defaults.headers.post['Content-Type'] = 'application/json';

// intercepting to capture errors
axios.interceptors.response.use((response) => {
    return response.data
}, (error) => {

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
        case 500: message = 'Internal Server Error'; break;
        case 401: message = 'Invalid credentials'; break;
        case 404: message = "Sorry! the data you are looking for could not be found"; break;
        default: message = error.message || error;
    }
    return Promise.reject(message);
});

/**
 * Sets the default authorization
 * @param {*} token 
 */
const setAuthorization = () => {
    const token = Cookie.get("token")
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}


class APIClient {
    /**
     * Fetches data from given url
     */
    get = async (url, params) => {
        return await axios.get(url, params);
    }

    /**
     * post given data to url
     */
    create = async (url, data, options) => {
        return await axios.post(url, data, options);
    }

    /**
     * Updates data
     */
    update = (url, data) => {
        return axios.put(url, data);
    }

    /**
     * Delete 
     */
    delete = (url) => {
        return axios.delete(url);
    }
}

export { APIClient, setAuthorization };