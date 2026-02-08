import React from 'react';
import { ChevronDown, Info, AlertTriangle, Ship, MapPin, Headphones, Ticket, Navigation, Footprints, Clock, Sun, CloudRain, CloudSnow, Cloud } from 'lucide-react';
import { Activity, Coords, HourlyForecast } from '../types';
import { calculateDuration, calculateTimeGap, calculateDistance, calculateBearing, formatDistance } from '../utils';

interface Props {
    itinerary: Activity[];
    onToggleComplete: (id: string) => void;
    onLocate: (c1: Coords, c2?: Coords) => void;
    userLocation: Coords | null;
    userHeading?: number;
    onSelectActivity: (activity: Activity, autoOpenAudio?: boolean) => void;
    hourlyWeather?: HourlyForecast[];
}

const Timeline: React.FC<Props> = ({ itinerary, onToggleComplete, onLocate, userLocation, userHeading = 0, onSelectActivity, hourlyWeather = [] }) => {
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    
    const getWeatherIcon = (code: number) => {
        if (code <= 3) return <Sun size={14} className="text-yellow-500" />;
        if (code <= 48) return <Cloud size={14} className="text-slate-400" />; // Fog/Cloudy
        if (code <= 69) return <CloudRain size={14} className="text-blue-400" />;
        return <CloudSnow size={14} className="text-slate-400" />;
    };

    return (
        <div className="pb-24 px-4 pt-4 max-w-lg mx-auto h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-fjord-500 mb-2">ITINERARIO FLAM 14 de mayo de 2026</h2>
            <p className="text-xs text-slate-500 mb-6 flex items-center">
                <Info size={12} className="mr-1"/> Toca una tarjeta para ver detalles
            </p>
            
            <div className="relative border-l-2 border-slate-200 ml-3 space-y-0">
                {itinerary.map((act, index) => {
                    const [sh, sm] = act.startTime.split(':').map(Number);
                    const [eh, em] = act.endTime.split(':').map(Number);
                    const startMinutes = sh * 60 + sm;
                    const endMinutes = eh * 60 + em;
                    
                    // Check if single point in time (start == end)
                    const isPointInTime = startMinutes === endMinutes;
                    
                    // Status Checks
                    const isActive = isPointInTime 
                        ? (currentTimeMinutes >= startMinutes && currentTimeMinutes < startMinutes + 15) // Point active for 15 mins visually
                        : (currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes);
                        
                    const isCritical = act.notes === 'CRITICAL';
                    const isDeparture = act.notes === 'DEPARTURE';
                    const duration = calculateDuration(act.startTime, act.endTime);
                    const hasAudio = ['4', '6', '7', '8'].includes(act.id);
                    
                    // Weather for this slot
                    const startHourStr = act.startTime.split(':')[0]; // "08"
                    const weather = hourlyWeather?.find(w => w.time.split(':')[0] === startHourStr);
                    
                    // Distance and Direction Calculation
                    let dist = 0;
                    let bearing = 0;
                    let direction = 0;
                    let isNearby = false;
                    
                    if (userLocation) {
                        dist = calculateDistance(userLocation, act.coords);
                        bearing = calculateBearing(userLocation, act.coords);
                        // Rotate arrow: Bearing to target - Device Heading
                        direction = (bearing - userHeading + 360) % 360;
                        isNearby = dist < 500; // Less than 500 meters
                    }

                    // Calculate Gap to next activity
                    let gapElement = null;
                    if (index < itinerary.length - 1) {
                        const nextAct = itinerary[index + 1];
                        const gap = calculateTimeGap(act.endTime, nextAct.startTime);
                        if (gap) {
                            // Check if NOW is in the gap
                            const [nsh, nsm] = nextAct.startTime.split(':').map(Number);
                            const nextStartMinutes = nsh * 60 + nsm;
                            const isGapNow = currentTimeMinutes >= endMinutes && currentTimeMinutes < nextStartMinutes;

                            gapElement = (
                                <div className="relative pl-6 py-2 my-1">
                                    {/* Dotted line for transit */}
                                    <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-slate-200 border-l-2 border-dotted border-slate-300"></div>

                                    {isGapNow && (
                                        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-full flex items-center z-10">
                                            <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow animate-pulse"></div>
                                            <div className="h-[2px] bg-red-500 w-12 opacity-50"></div>
                                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm">
                                                AHORA: EN TRÁNSITO
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-center">
                                        <div className={`flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full border ${isGapNow ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                            <Footprints size={12} />
                                            <span className="font-medium">{gap} de traslado / espera</span>
                                            <ChevronDown size={12} />
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    }

                    // Calculate Progress if Active
                    let progress = 0;
                    if (isActive && !isPointInTime) {
                        const totalDuration = endMinutes - startMinutes;
                        const elapsed = currentTimeMinutes - startMinutes;
                        progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
                    }

                    return (
                        <React.Fragment key={act.id}>
                            <div className={`pl-6 relative group transition-all duration-300 ${isActive ? 'my-4 scale-[1.02] z-10' : 'my-2'}`}>
                                {/* Dot on Timeline */}
                                <div 
                                    className={`absolute -left-[9px] top-6 w-5 h-5 rounded-full border-4 cursor-pointer transition-all z-20 ${
                                        act.completed ? 'bg-emerald-500 border-emerald-200' : 
                                        isActive ? 'bg-blue-500 border-white ring-4 ring-blue-200 shadow-lg' : 
                                        'bg-white border-slate-300'
                                    }`}
                                    onClick={(e) => { e.stopPropagation(); onToggleComplete(act.id); }}
                                >
                                    {act.completed && <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-[8px]">✓</div>}
                                </div>

                                {/* Card */}
                                <div 
                                    onClick={() => onSelectActivity(act)}
                                    className={`
                                        relative p-4 rounded-xl border transition-all cursor-pointer overflow-hidden
                                        ${isActive 
                                            ? 'active-card bg-white border-blue-500 shadow-xl' 
                                            : 'bg-white border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md'}
                                        ${act.completed ? 'opacity-60 bg-slate-50 grayscale-[0.5]' : ''}
                                        ${isCritical ? 'bg-red-50 border-red-200 ring-1 ring-red-100' : ''}
                                        ${isDeparture ? 'bg-slate-800 border-slate-700 text-white' : ''}
                                    `}
                                >
                                    {/* Progress Bar for Active Items */}
                                    {isActive && !isPointInTime && (
                                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-100">
                                            <div className="h-full bg-blue-500 transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="flex items-center flex-wrap gap-2 mb-1.5">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center ${
                                                    isDeparture ? 'bg-slate-600 text-slate-200' :
                                                    isActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    <Clock size={10} className="mr-1"/>
                                                    {isPointInTime ? act.startTime : `${act.startTime} - ${act.endTime}`}
                                                </span>
                                                {!isPointInTime && <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{duration}</span>}
                                                {isActive && <span className="text-[10px] font-bold text-blue-600 animate-pulse bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">En Curso</span>}
                                            </div>
                                            <h3 className={`font-bold text-lg leading-tight ${isCritical ? 'text-red-700' : isDeparture ? 'text-white' : 'text-slate-800'}`}>
                                                {act.title}
                                            </h3>
                                        </div>
                                        <div className="flex gap-1.5 pl-2 items-start">
                                            {/* Weather Icon (New) */}
                                            {weather && !isDeparture && (
                                                <div className="flex flex-col items-center bg-slate-50 border border-slate-100 p-1 rounded-md">
                                                    {getWeatherIcon(weather.code)}
                                                    <span className="text-[9px] font-bold text-slate-600 mt-0.5">{weather.temp}°</span>
                                                </div>
                                            )}

                                            {act.webcamUrl && (
                                                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 flex items-center h-[26px]">
                                                    CAM
                                                </span>
                                            )}
                                            {act.ticketUrl && <div className="p-1 bg-emerald-100 text-emerald-600 rounded-md"><Ticket size={14} /></div>}
                                            {isCritical && <AlertTriangle size={18} className="text-red-500 animate-bounce" />}
                                            {isDeparture && <Ship size={18} className="text-blue-300" />}
                                        </div>
                                    </div>

                                    <p className={`text-sm line-clamp-2 mb-3 ${isDeparture ? 'text-slate-300' : 'text-slate-600'}`}>{act.description}</p>

                                    <div className={`flex items-center justify-between mt-auto pt-3 border-t ${isDeparture ? 'border-slate-700' : 'border-slate-100'}`}>
                                        <div className={`flex items-center text-xs truncate max-w-[50%] ${isDeparture ? 'text-slate-400' : 'text-slate-500'}`}>
                                            <MapPin size={12} className="mr-1 flex-shrink-0" />
                                            <span className="truncate">{act.locationName}</span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            {/* Distance & Direction Indicator */}
                                            {userLocation && dist > 0 && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onLocate(act.coords); }}
                                                    className={`flex items-center font-bold text-xs px-2 py-1 rounded-lg transition-all shadow-sm active:scale-95
                                                        ${isNearby 
                                                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 ring-2 ring-emerald-50' 
                                                            : isDeparture 
                                                                ? 'bg-slate-700 text-emerald-400' 
                                                                : 'bg-white text-slate-600 border border-slate-200'
                                                        }`}
                                                >
                                                    <Navigation 
                                                        size={12} 
                                                        className={`mr-1.5 transition-transform duration-500 ${isNearby ? 'text-emerald-600' : 'text-blue-500'}`}
                                                        style={{ transform: `rotate(${direction}deg)` }} 
                                                        fill="currentColor" 
                                                    />
                                                    {formatDistance(dist)}
                                                    {isNearby && <MapPin size={10} className="ml-1.5 text-emerald-600 animate-bounce" fill="currentColor"/>}
                                                </button>
                                            )}

                                            {hasAudio && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onSelectActivity(act, true); }}
                                                    className="flex items-center text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all"
                                                >
                                                    <Headphones size={12} className="mr-1" />
                                                    Audio
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {gapElement}
                        </React.Fragment>
                    );
                })}
                
                {/* Footer */}
                <div className="text-center py-8 text-slate-400 text-xs mt-4">
                    <p className="font-medium">Flåm Guide 2026</p>
                    <p>Actualizado el 04 de febrero de 2026</p>
                    <p className="mt-1">© 2025 - 2026 Gonzalo Arenas de la Hoz</p>
                </div>
            </div>
        </div>
    );
};

export default Timeline;