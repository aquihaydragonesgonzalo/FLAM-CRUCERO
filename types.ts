export interface Coords {
    lat: number;
    lng: number;
}

export interface Activity {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    locationName: string;
    endLocationName?: string;
    coords: Coords;
    endCoords?: Coords;
    description: string;
    fullDescription: string;
    tips: string;
    keyDetails: string;
    priceNOK: number;
    priceEUR: number;
    type: 'logistics' | 'food' | 'transport' | 'sightseeing' | 'shopping';
    completed: boolean;
    notes?: string;
    webcamUrl?: string;
    instagramUrl?: string;
    ticketUrl?: string;
}

export interface AudioTrack {
    id: number;
    title: string;
    text: string;
}

export interface Pronunciation {
    word: string;
    phonetic: string;
    simplified: string;
    meaning: string;
}

export interface WeatherData {
    hourly?: {
        time: string[];
        temperature_2m: number[];
        precipitation_probability: number[];
        weather_code: number[];
    };
    daily?: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weather_code: number[];
    };
}

export interface HourlyForecast {
    time: string;
    temp: number;
    precip: number;
    code: number;
}

export interface DailyForecast {
    date: string;
    max: number;
    min: number;
    code: number;
}

export interface AstronomyData {
    sunrise: string;
    sunset: string;
    duration: string;
}

export interface CustomExpense {
    id: string;
    title: string;
    priceNOK: number;
    priceEUR: number;
    type: 'extra';
}