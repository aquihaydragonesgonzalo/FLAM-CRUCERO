import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Map as MapIcon, Globe } from 'lucide-react';
import { Activity, Coords } from '../types';
import { GPX_TRACK_DATA } from '../routeData';
import { parseGPX } from '../utils';

interface Props {
    activities: Activity[];
    userLocation: Coords | null;
    focusedLocation: Coords | null;
}

const LAYERS = {
    standard: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap contributors'
    },
    satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }
};

const MapComponent: React.FC<Props> = ({ activities, userLocation, focusedLocation }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const layersRef = useRef<L.Layer[]>([]);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    
    const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;
        
        const map = L.map(mapContainerRef.current, {
            zoomControl: false // We will add zoom control manually if needed, or rely on default position
        }).setView([60.8638, 7.1187], 13);
        
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;

        // Render GPX Track
        try {
            const trackCoords = parseGPX(GPX_TRACK_DATA);
            if (trackCoords.length > 0) {
                const latLngs = trackCoords.map(c => [c.lat, c.lng] as L.LatLngTuple);
                L.polyline(latLngs, {
                    color: '#FFB347', // Color Sunset
                    weight: 5,
                    opacity: 0.8,
                    lineCap: 'round',
                    lineJoin: 'round'
                }).addTo(map).bindPopup("Ruta Flåmsbana");
            }
        } catch (error) {
            console.error("Error loading GPX track:", error);
        }

        return () => { map.remove(); mapInstanceRef.current = null; };
    }, []);

    // Handle Map Type Change
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Remove old layer
        if (tileLayerRef.current) {
            map.removeLayer(tileLayerRef.current);
        }

        // Add new layer
        const config = LAYERS[mapType];
        const newLayer = L.tileLayer(config.url, {
            maxZoom: 18,
            attribution: config.attribution
        });

        newLayer.addTo(map);
        newLayer.bringToBack(); // Ensure track and markers stay on top
        tileLayerRef.current = newLayer;

    }, [mapType]);

    // Handle Markers & Route Lines
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;
        
        layersRef.current.forEach(l => l.remove());
        layersRef.current = [];

        // Custom Icons
        const createIcon = (color: string) => L.divIcon({
            className: 'custom-pin',
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 2px 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });

        activities.forEach(act => {
            const marker = L.marker([act.coords.lat, act.coords.lng], { icon: createIcon('#2A5B87') })
                .addTo(map).bindPopup(`<b>${act.title}</b><br/>${act.locationName}`);
            layersRef.current.push(marker);

            if (act.endCoords) {
                    const endMarker = L.marker([act.endCoords.lat, act.endCoords.lng], { icon: createIcon('#3A7D44') })
                    .addTo(map).bindPopup(`<b>Fin: ${act.title}</b>`);
                layersRef.current.push(endMarker);
                
                const polyline = L.polyline([[act.coords.lat, act.coords.lng], [act.endCoords.lat, act.endCoords.lng]], { 
                    color: '#2A5B87', 
                    weight: 4, 
                    opacity: 0.6, 
                    dashArray: '10, 10' 
                }).addTo(map);
                layersRef.current.push(polyline);
            }
        });

        if (userLocation) {
            const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], { radius: 8, fillColor: '#3b82f6', color: '#fff', weight: 3, fillOpacity: 1 }).addTo(map);
            layersRef.current.push(userMarker);
        }
    }, [activities, userLocation]);

    // Handle Focus
    useEffect(() => {
        if(mapInstanceRef.current && focusedLocation) {
            mapInstanceRef.current.setView([focusedLocation.lat, focusedLocation.lng], 16, { animate: true, duration: 1.5 });
        }
    }, [focusedLocation]);

    return (
        <div className="w-full h-full relative">
            <div ref={mapContainerRef} className="w-full h-full bg-slate-100" />
            
            {/* Map Type Controls */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
                <button 
                    onClick={() => setMapType('standard')}
                    className={`p-3 flex items-center justify-center transition-colors ${mapType === 'standard' ? 'bg-fjord-50 text-fjord-600' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                    title="Mapa Estándar"
                >
                    <MapIcon size={20} />
                </button>
                <div className="h-[1px] w-full bg-slate-100"></div>
                <button 
                    onClick={() => setMapType('satellite')}
                    className={`p-3 flex items-center justify-center transition-colors ${mapType === 'satellite' ? 'bg-fjord-50 text-fjord-600' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                    title="Vista Satélite"
                >
                    <Globe size={20} />
                </button>
            </div>
        </div>
    );
};

export default MapComponent;