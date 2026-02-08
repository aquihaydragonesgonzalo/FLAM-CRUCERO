import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Map as MapIcon, Globe, Plus, MapPin, X, Save, Trash2, Search, Loader2 } from 'lucide-react';
import { Activity, Coords, CustomPOI } from '../types';
import { GPX_TRACK_DATA } from '../routeData';
import { parseGPX } from '../utils';

interface Props {
    activities: Activity[];
    userLocation: Coords | null;
    focusedLocation: Coords | null;
}

interface SearchResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
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
    const searchMarkerRef = useRef<L.Marker | null>(null);
    
    const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
    
    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Custom POI State
    const [customPOIs, setCustomPOIs] = useState<CustomPOI[]>([]);
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [pendingSpot, setPendingSpot] = useState<Coords | null>(null);
    const [newPoiTitle, setNewPoiTitle] = useState('');
    const [newPoiDesc, setNewPoiDesc] = useState('');

    // Load POIs from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('flam_custom_pois');
        if (saved) {
            try {
                setCustomPOIs(JSON.parse(saved));
            } catch (e) {
                console.error("Error loading POIs", e);
            }
        }
    }, []);

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

    // Handle Map Clicks for Adding POIs
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const handleMapClick = (e: L.LeafletMouseEvent) => {
            if (isAddingMode) {
                setPendingSpot({ lat: e.latlng.lat, lng: e.latlng.lng });
                setIsAddingMode(false); // Exit add mode, open modal
            }
        };

        map.on('click', handleMapClick);

        // Change cursor based on mode
        const container = map.getContainer();
        if (isAddingMode) {
            container.style.cursor = 'crosshair';
        } else {
            container.style.cursor = '';
        }

        return () => {
            map.off('click', handleMapClick);
        };
    }, [isAddingMode]);

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

    // Save New POI
    const savePOI = () => {
        if (!pendingSpot || !newPoiTitle) return;

        const newPOI: CustomPOI = {
            id: 'poi_' + Date.now(),
            lat: pendingSpot.lat,
            lng: pendingSpot.lng,
            title: newPoiTitle,
            description: newPoiDesc,
            timestamp: Date.now()
        };

        const updated = [...customPOIs, newPOI];
        setCustomPOIs(updated);
        localStorage.setItem('flam_custom_pois', JSON.stringify(updated));
        
        // Reset Form
        setPendingSpot(null);
        setNewPoiTitle('');
        setNewPoiDesc('');
    };

    const deletePOI = (id: string) => {
        const updated = customPOIs.filter(p => p.id !== id);
        setCustomPOIs(updated);
        localStorage.setItem('flam_custom_pois', JSON.stringify(updated));
        
        // Close popup if open (hacky but effective via re-render)
        const map = mapInstanceRef.current;
        if(map) map.closePopup();
    };

    // Render Markers (Itinerary + Custom)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;
        
        layersRef.current.forEach(l => l.remove());
        layersRef.current = [];

        // Helper: Create Icon
        const createIcon = (color: string) => L.divIcon({
            className: 'custom-pin',
            html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 2px 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });

        // 1. Itinerary Markers
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

        // 2. Custom POI Markers
        customPOIs.forEach(poi => {
            // Create a temporary container for the popup content to attach event listeners
            const container = document.createElement('div');
            container.innerHTML = `
                <div class="p-1 min-w-[150px]">
                    <h3 class="font-bold text-sm text-purple-700">${poi.title}</h3>
                    <p class="text-xs text-slate-600 my-1">${poi.description || 'Sin descripción'}</p>
                    <button id="del-btn-${poi.id}" class="flex items-center text-[10px] text-red-500 hover:text-red-700 mt-2 font-bold bg-red-50 px-2 py-1 rounded w-full justify-center">
                        Eliminar Marcador
                    </button>
                </div>
            `;

            const marker = L.marker([poi.lat, poi.lng], { icon: createIcon('#8b5cf6') }) // Violet Color
                .addTo(map)
                .bindPopup(container);
            
            // Attach delete listener when popup opens
            marker.on('popupopen', () => {
                const btn = document.getElementById(`del-btn-${poi.id}`);
                if (btn) {
                    btn.onclick = () => deletePOI(poi.id);
                }
            });

            layersRef.current.push(marker);
        });

        // 3. User Location
        if (userLocation) {
            const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], { radius: 8, fillColor: '#3b82f6', color: '#fff', weight: 3, fillOpacity: 1 }).addTo(map);
            layersRef.current.push(userMarker);
        }
    }, [activities, userLocation, customPOIs]);

    // Handle Focus
    useEffect(() => {
        if(mapInstanceRef.current && focusedLocation) {
            mapInstanceRef.current.setView([focusedLocation.lat, focusedLocation.lng], 16, { animate: true, duration: 1.5 });
        }
    }, [focusedLocation]);

    // --- Search Functionality ---
    const performSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchResults([]);

        try {
            // Viewbox covers Gudvangen (West 6.8) to Flåm/Aurland (East 7.3), South 60.7 to North 61.0
            const viewbox = '6.70,61.00,7.30,60.60'; // left,top,right,bottom
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&viewbox=${viewbox}&bounded=1&limit=5`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectResult = (result: SearchResult) => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const name = result.display_name.split(',')[0];

        // Clear previous search marker
        if (searchMarkerRef.current) {
            searchMarkerRef.current.remove();
        }

        // Fly to location
        map.setView([lat, lng], 16, { animate: true });

        // Add temporary search marker
        const marker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'search-pin',
                html: `<div style="background-color: #ef4444; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.5);"></div>`,
                iconSize: [14, 14]
            })
        }).addTo(map)
          .bindPopup(`<b>${name}</b>`)
          .openPopup();

        searchMarkerRef.current = marker;
        setSearchResults([]);
    };

    return (
        <div className="w-full h-full relative">
            <div ref={mapContainerRef} className="w-full h-full bg-slate-100" />
            
            {/* Search Bar */}
            <div className="absolute top-4 left-4 z-[1000] w-64">
                <form onSubmit={performSearch} className="relative shadow-lg rounded-xl">
                    <input 
                        type="text" 
                        placeholder="Buscar en Flåm/Gudvangen..." 
                        className="w-full h-12 pl-10 pr-4 rounded-xl border-none outline-none text-sm font-medium text-slate-700 bg-white/95 backdrop-blur shadow-sm focus:ring-2 focus:ring-fjord-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    {isSearching && <Loader2 className="absolute right-3 top-3.5 text-fjord-500 animate-spin" size={18} />}
                </form>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <div className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                        {searchResults.map((result) => (
                            <button 
                                key={result.place_id}
                                onClick={() => handleSelectResult(result)}
                                className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 text-xs text-slate-700 transition-colors"
                            >
                                <span className="font-bold block text-sm">{result.display_name.split(',')[0]}</span>
                                <span className="opacity-70 truncate block">{result.display_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Add POI Modal Overlay */}
            {pendingSpot && (
                <div className="absolute inset-0 z-[1100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-sm animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-purple-700 flex items-center"><MapPin className="mr-2" size={18}/> Nuevo Punto</h3>
                            <button onClick={() => setPendingSpot(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-slate-500 block mb-1">Nombre del lugar</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:border-purple-500 outline-none"
                                    placeholder="Ej: Tienda bonita"
                                    value={newPoiTitle}
                                    onChange={e => setNewPoiTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 block mb-1">Nota (opcional)</label>
                                <textarea 
                                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:border-purple-500 outline-none resize-none"
                                    rows={2}
                                    placeholder="Comentarios..."
                                    value={newPoiDesc}
                                    onChange={e => setNewPoiDesc(e.target.value)}
                                />
                            </div>
                            <button 
                                onClick={savePOI}
                                disabled={!newPoiTitle}
                                className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg shadow-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <Save size={16} className="mr-2"/> Guardar Marcador
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls Container */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-3">
                {/* Add Marker Button */}
                <button 
                    onClick={() => setIsAddingMode(!isAddingMode)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 transition-all active:scale-95 ${isAddingMode ? 'bg-purple-600 border-white text-white rotate-45' : 'bg-white border-purple-100 text-purple-600 hover:bg-purple-50'}`}
                    title={isAddingMode ? "Cancelar" : "Añadir Marcador"}
                >
                    <Plus size={24} />
                </button>

                {/* Info Toast when Adding */}
                {isAddingMode && (
                    <div className="absolute right-14 top-2 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-in slide-in-from-right-2">
                        Toca el mapa
                    </div>
                )}

                {/* Map Type Controls */}
                <div className="flex flex-col bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden w-12">
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
        </div>
    );
};

export default MapComponent;