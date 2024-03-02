import { useEffect, useState } from 'react';
import { getWeather, getAllCountries, getForecast, getCoordinatesWeather, getSearchWeather } from '../api/data';
import { FaLocationDot, FaTemperatureFull, FaWind } from "react-icons/fa6";
import { MdOutlineWaterDrop } from "react-icons/md";
import { WiStrongWind } from "react-icons/wi";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { DateTime } from 'luxon';

const Home = () => {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedData, setSelectedData] = useState('');
    const [selectedForecast, setSelectedForecast] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [searchCity, setSearchCity] = useState('');

    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;
        setSelectedCountry(selectedCountry);

        const countryData = countries.find(country => country.country === selectedCountry);
        setCities(countryData ? countryData.cities : []);
    };

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };

    const getCountriesInfo = async () => {
        const countriesInfo = await getAllCountries();
        setCountries(countriesInfo.data);
    };

    const getWeatherInfo = async () => {
        try {
            const weatherInfo = await getWeather(selectedCity, selectedCountry);
            setSelectedData(weatherInfo);

            const weatherForeCast = await getForecast(weatherInfo.coord.lat, weatherInfo.coord.lon);
            setSelectedForecast(weatherForeCast.list.splice(1, 4));
        } catch (error) {
            console.log(error);
        }
    };

    const getCoordinates = async () => {
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const coordinates = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        };
                        const weather = await getCoordinatesWeather(coordinates.latitude, coordinates.longitude);
                        setSelectedData(weather);
                        const weatherForeCast = await getForecast(weather.coord.lat, weather.coord.lon);
                        setSelectedForecast(weatherForeCast.list.splice(1, 4));
                    },
                    (error) => {
                        console.error('Error getting location:', error.message);
                    }
                );
            } else {
                console.error('Geolocation is not supported by your browser');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getCurrentTime = () => {
        try {
            if (selectedData) {
                const dt = Number(selectedData.dt);
                const timezoneOffsetMinutes = Number(selectedData.timezone) / 60;

                const formattedDate = DateTime.fromSeconds(dt)
                    .setZone('UTC')
                    .plus({ minutes: timezoneOffsetMinutes })
                    .toFormat('dd-MM-yyyy');

                const formattedTime = DateTime.fromSeconds(dt)
                    .setZone('UTC')
                    .plus({ minutes: timezoneOffsetMinutes })
                    .toFormat('hh:mm a');

                const timeZone = `${formattedDate} | Local Time: ${formattedTime}`;

                setCurrentTime(timeZone);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearchCity = async (e) => {
        const city = e.target.value;
        setSearchCity(city);
        try {
            const response = await getSearchWeather(city);
            setSelectedData(response)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCountriesInfo();
        getWeatherInfo();
    }, [selectedCountry, selectedCity]);

    useEffect(() => {
        if (selectedData) {
            getCurrentTime();
        }
    }, [selectedData]);

    return (
        <div className='container'>
            <div className='mainContainer' >
                <div className='homeContainer'>
                    <input type="text" value={searchCity} onChange={handleSearchCity} className='search' placeholder='search by city name' />
                    <div className='selectOption'>
                        <div>
                            <select id="country" value={selectedCountry} onChange={handleCountryChange} className='select-option'>
                                <option value="">Country...</option>
                                {countries.map((country, index) => (
                                    <option key={index} value={country.country}>{country.country.substring(0, 30)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select id="city" value={selectedCity} onChange={handleCityChange}>
                                <option value="">City...</option>
                                {cities.map((city, index) => (
                                    <option key={index} value={city}>{city.substring(0, 15)}</option>
                                ))}
                            </select>
                        </div>
                        <FaLocationDot className='icon location' onClick={getCoordinates} />
                    </div>
                    {
                        currentTime && selectedData ?
                            <p>{currentTime}</p> : null
                    }

                    {
                        selectedData ?
                            <>
                                <div>
                                    <div className='location'>
                                        <h1>
                                            {selectedData.name}, {selectedData.sys.country}
                                        </h1>
                                        <img src={`./weather/${selectedData.weather[0].icon}.png`} alt="" className="weatherCondition" />
                                    </div>
                                </div>
                                <div>
                                    <div className='temp'>
                                        <h1>{selectedData.main.temp}°</h1>
                                        <p>{selectedData.weather[0].main} / {selectedData.weather[0].description}</p>
                                    </div>
                                </div>
                            </>
                            : null
                    }
                </div>
                {
                    selectedData ?
                        <>
                            {
                                selectedForecast && selectedData ?
                                    <div className='forecastContainer'>
                                        {
                                            selectedForecast.map((curData, index) => (
                                                <div key={index} className='foreCast'>
                                                    <p >{new Date(curData.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    <img src={`./weather/${curData.weather[0].icon}.png`} alt="" className="weatherCondition" width={30} height={30} />
                                                    <p>{curData.main.temp}° C</p>
                                                </div >
                                            ))
                                        }
                                    </div>
                                    : null
                            }
                            {
                                selectedData ?
                                    <>
                                        <div className='otherContainer'>
                                            <div className='homeContainer'>
                                                <div>
                                                    <FaArrowUp />
                                                    <p>High</p>
                                                    <p className="fontStyle">{selectedData.main.temp_max}°C</p>
                                                </div>
                                            </div>
                                            <div className='homeContainer'>
                                                <div>
                                                    <FaTemperatureFull />
                                                    <p>Feels like</p>
                                                    <p className="fontStyle">{selectedData.main.feels_like}°C</p>
                                                </div>
                                            </div>
                                            <div className='homeContainer'>
                                                <div>
                                                    <FaArrowDown />
                                                    <p>Low</p>
                                                    <p className="fontStyle">{selectedData.main.temp_min}°C</p>
                                                </div>
                                            </div>
                                            <div className='homeContainer'>
                                                <div>
                                                    <FaWind />
                                                    <p>W wind</p>
                                                    <p className="fontStyle">{selectedData.wind.speed} mi/h</p>
                                                </div>
                                            </div>
                                            <div className='homeContainer'>
                                                <div>
                                                    <MdOutlineWaterDrop />
                                                    <p>Humidity</p>
                                                    <p className="fontStyle">{selectedData.main.humidity} %</p>
                                                </div>
                                            </div>
                                            <div className='homeContainer'>
                                                <div>
                                                    <WiStrongWind />
                                                    <p>Air pressure</p>
                                                    <p className="fontStyle">{selectedData.main.pressure} hPa</p>
                                                </div>
                                            </div>
                                        </div>
                                    </> : null
                            }

                            {
                                selectedData ?
                                    <div className='homeContainer'>
                                        <div className='sunTime'>
                                            <div>
                                                <p><FiSunrise /> Sun rise:</p>
                                                <p className="fontStyle">{new Date(selectedData.dt * 1000 - (selectedData.timezone * 1000)).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div>
                                                <p><FiSunset /> Sun rise:</p>
                                                <p className="fontStyle">{new Date(selectedData.dt * 1000 + (selectedData.timezone * 1000)).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                    : null
                            }
                        </>
                        : <h1 className='notFound'>No result found</h1>
                }
            </div>
        </div>
    )
}

export default Home;
