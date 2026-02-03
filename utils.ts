import { Coords } from "./types";

export const calculateDistance = (c1: Coords, c2: Coords) => {
    if(!c1 || !c2) return 0;
    const R = 6371e3; 
    const φ1 = c1.lat * Math.PI/180;
    const φ2 = c2.lat * Math.PI/180;
    const Δφ = (c2.lat-c1.lat) * Math.PI/180;
    const Δλ = (c2.lng-c1.lng) * Math.PI/180;
    const a = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

export const calculateBearing = (start: Coords, end: Coords): number => {
    if (!start || !end) return 0;
    const startLat = start.lat * Math.PI / 180;
    const startLng = start.lng * Math.PI / 180;
    const endLat = end.lat * Math.PI / 180;
    const endLng = end.lng * Math.PI / 180;

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
              Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    const θ = Math.atan2(y, x);
    const brng = (θ * 180 / Math.PI + 360) % 360;
    return brng;
};

export const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
};

export const calculateDuration = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let diff = (eh*60+em) - (sh*60+sm);
    if(diff < 0) diff += 24*60;
    const h = Math.floor(diff/60);
    const m = diff%60;
    return h > 0 && m > 0 ? `${h}h ${m}m` : (h > 0 ? `${h}h` : `${m} min`);
};

export const calculateTimeGap = (endPrevious: string, startNext: string) => {
    const [eh, em] = endPrevious.split(':').map(Number);
    const [sh, sm] = startNext.split(':').map(Number);
    let diff = (sh*60+sm) - (eh*60+em);
    if (diff <= 0) return null;
    return diff < 60 ? `${diff} min` : `${Math.floor(diff/60)}h ${diff%60}m`;
};

export const parseGPX = (gpxData: string): Coords[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxData, "text/xml");
    const trkpts = xmlDoc.getElementsByTagName("trkpt");
    const coords: Coords[] = [];

    for (let i = 0; i < trkpts.length; i++) {
        const lat = parseFloat(trkpts[i].getAttribute("lat") || "0");
        const lon = parseFloat(trkpts[i].getAttribute("lon") || "0");
        if (lat && lon) {
            coords.push({ lat, lng: lon });
        }
    }
    return coords;
};