import axios from "axios";

const API_KEY = '96eabf09bea51ae457a22b2dc80441f9';

export const getWeather = async (city, country) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&${country}a&appid=${API_KEY}&units=metric`)
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getSearchWeather = async (city) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getCoordinatesWeather = async (lat, lon) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


export const getAllCountries = async () => {
    try {
        const response = await axios.get(`https://countriesnow.space/api/v0.1/countries`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}



export const getForecast = async (lat, lon) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}


