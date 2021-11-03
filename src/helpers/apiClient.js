import axios from 'axios';
import config from "./../config";


// default
axios.defaults.baseURL = config.API_URL;

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
const setAuthorization = (token) => {
    const tokenNew = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiIzZTQ4ZjFjZTlmMDE1Y2M1OWJkN2JmMDYwNTY4MWYyOCIsInVuaXF1ZV9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIxNjQ0MDE5MjAwIiwibmJmIjoxNjM1NDM0MDM1LCJleHAiOjE2NDM5OTQwMDAsImlhdCI6MTYzNTQzNDAzNX0.vCnO_OoXnxH39iaQ-JaCya_CT9EDZgthyx9rAWXL_ks"
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + tokenNew;
}


class APIClient {
    /**
     * Fetches data from given url
     */
    get = (url, params) => {
        return axios.get(url, params);
    }

    /**
     * post given data to url
     */
    create = (url, data, options) => {
        return axios.post(url, data, options);
    }

    /**
     * Updates data
     */
    update = (url, data) => {
        return axios.patch(url, data);
    }

    /**
     * Delete 
     */
    delete = (url) => {
        return axios.put(url);
    }
}

export { APIClient, setAuthorization };