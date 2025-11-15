// Weather API service using Open-Meteo (free, no API key required)

export interface WeatherData {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    humidity: number;
    location: string;
}

export interface ForecastDay {
    date: string;
    dayOfWeek: string;
    tempMax: number;
    tempMin: number;
    weatherCode: number;
}

export interface WeatherDescription {
    description: string;
    icon: string;
}

/**
 * Get weather description and icon based on WMO weather code
 * https://open-meteo.com/en/docs
 */
export function getWeatherDescription(code: number): WeatherDescription {
    const weatherCodes: Record<number, WeatherDescription> = {
        0: { description: 'Clear sky', icon: '☀️' },
        1: { description: 'Mainly clear', icon: '🌤️' },
        2: { description: 'Partly cloudy', icon: '⛅' },
        3: { description: 'Overcast', icon: '☁️' },
        45: { description: 'Foggy', icon: '🌫️' },
        48: { description: 'Foggy', icon: '🌫️' },
        51: { description: 'Light drizzle', icon: '🌦️' },
        53: { description: 'Drizzle', icon: '🌦️' },
        55: { description: 'Heavy drizzle', icon: '🌧️' },
        61: { description: 'Light rain', icon: '🌧️' },
        63: { description: 'Rain', icon: '🌧️' },
        65: { description: 'Heavy rain', icon: '⛈️' },
        71: { description: 'Light snow', icon: '🌨️' },
        73: { description: 'Snow', icon: '❄️' },
        75: { description: 'Heavy snow', icon: '❄️' },
        77: { description: 'Snow grains', icon: '❄️' },
        80: { description: 'Light showers', icon: '🌦️' },
        81: { description: 'Showers', icon: '🌧️' },
        82: { description: 'Heavy showers', icon: '⛈️' },
        85: { description: 'Light snow showers', icon: '🌨️' },
        86: { description: 'Snow showers', icon: '❄️' },
        95: { description: 'Thunderstorm', icon: '⛈️' },
        96: { description: 'Thunderstorm with hail', icon: '⛈️' },
        99: { description: 'Thunderstorm with hail', icon: '⛈️' },
    };

    return weatherCodes[code] || { description: 'Unknown', icon: '🌡️' };
}

/**
 * Get user's location using browser geolocation API
 */
export async function getUserLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                reject(new Error(`Failed to get location: ${error.message}`));
            }
        );
    });
}

/**
 * Fetch weather data from Open-Meteo API
 */
export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit&wind_speed_unit=mph`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch weather: ${response.status}`);
        }

        const data = await response.json();

        return {
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code,
            windSpeed: Math.round(data.current.wind_speed_10m),
            humidity: data.current.relative_humidity_2m,
            location: 'Current Location',
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

/**
 * Fetch 7-day weather forecast from Open-Meteo API
 */
export async function fetchWeatherForecast(latitude: number, longitude: number): Promise<ForecastDay[]> {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch forecast: ${response.status}`);
        }

        const data = await response.json();

        // Check if daily data exists
        if (!data.daily || !data.daily.time) {
            throw new Error('No forecast data available');
        }

        const forecast: ForecastDay[] = [];

        // Get 7 days of forecast
        for (let i = 0; i < 7 && i < data.daily.time.length; i++) {
            const date = new Date(data.daily.time[i]);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

            forecast.push({
                date: data.daily.time[i],
                dayOfWeek,
                tempMax: Math.round(data.daily.temperature_2m_max[i]),
                tempMin: Math.round(data.daily.temperature_2m_min[i]),
                weatherCode: data.daily.weather_code[i],
            });
        }

        return forecast;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        throw error;
    }
}
