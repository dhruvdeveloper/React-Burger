import axios from 'axios';

const instance = axios.create({
    baseURL: "https://react-myburger-builder.firebaseio.com/"
});

export default instance;