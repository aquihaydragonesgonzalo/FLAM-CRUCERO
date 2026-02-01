import React from 'react';
import { ChevronDown, Info, AlertTriangle, Ship, MapPin, Headphones, Ticket } from 'lucide-react';
import { Activity, Coords } from '../types';
import { calculateDuration, calculateTimeGap } from '../utils';
import { UPDATE_DATE } from '../constants';

interface Props {
    itinerary: Activity[];
    onToggleComplete: (id: string) => void;
    onLocate: (c1: Coords, c2?: Coords) => void;
    userLocation: Coords | null;
    onSelectActivity: (activity: Activity, autoOpenAudio?: boolean) => void;
}

const Timeline: React.FC<Props> = ({ itinerary, onToggleComplete, onLocate, userLocation, onSelectActivity }) => {
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    
    return (
        <div className="pb-24 px-4 pt-4 max-w-lg mx-auto h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-fjord-500 mb-2">Itinerario Lujo Matutino</h2>
            <p className="text-xs text-slate-500 mb-6 flex items-center">
                <Info size={12} className="mr-1"/> Toca una tarjeta para ver detalles
            </p>
            
            <div className="relative border-l-2 border-slate-200 ml-3">
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
                                <div className="relative pl-6 py-4">
                                    {isGapNow && (
                                        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-full flex items-center z-10">
                                            <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow"></div>
                                            <div className="h-[2px] bg-red-500 w-full opacity-50"></div>
                                            <span className="absolute right-0 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                                                AHORA {now.getHours()}:{String(now.getMinutes()).padStart(2,'0')}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-center">
                                        <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full border border-slate-200 flex items-center">
                                            <ChevronDown size={12} className="mr-1" />
                                            {gap} traslado / libre
                                        </span>
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
                            <div className="pl-6 relative group">
                                {/* Dot */}
                                <div 
                                    className={`absolute -left-[9px] top-4 w-5 h-5 rounded-full border-4 cursor-pointer transition-all bg-white z-10 ${
                                        act.completed ? 'border-emerald-500' : isActive ? 'border-blue-500 scale-125' : 'border-slate-300'
                                    }`}
                                    onClick={(e) => { e.stopPropagation(); onToggleComplete(act.id); }}
                                >
                                    {act.completed && <div className="w-full h-full bg-emerald-500 rounded-full scale-50" />}
                                </div>

                                {/* Card */}
                                <div 
                                    onClick={() => onSelectActivity(act)}
                                    className={`
                                        relative p-4 rounded-xl border shadow-sm transition-all cursor-pointer overflow-hidden
                                        ${isActive ? 'bg-white border-blue-400 ring-2 ring-blue-100 shadow-blue-100' : 'bg-white border-slate-200 hover:border-blue-300'}
                                        ${act.completed ? 'opacity-70 bg-slate-50' : ''}
                                        ${isCritical ? 'bg-red-50 border-red-200' : ''}
                                        ${isDeparture ? 'bg-slate-800 border-slate-700 text-white' : ''}
                                    `}
                                >
                                    {isActive && !isPointInTime && (
                                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-100">
                                            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                                    isDeparture ? 'bg-slate-700 text-slate-200' :
                                                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {isPointInTime ? act.startTime : `${act.startTime} - ${act.endTime}`}
                                                </span>
                                                {!isPointInTime && <span className="text-xs text-slate-400 font-medium">{duration}</span>}
                                                {isActive && <span className="text-[10px] font-bold text-blue-600 animate-pulse">⚡ EN CURSO</span>}
                                            </div>
                                            <h3 className={`font-bold text-lg leading-tight ${isCritical ? 'text-red-700' : isDeparture ? 'text-white' : 'text-slate-800'}`}>
                                                {act.title}
                                            </h3>
                                        </div>
                                        <div className="flex gap-2 pl-2 items-center">
                                            {act.webcamUrl && (
                                                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                                                    CAM
                                                </span>
                                            )}
                                            {act.ticketUrl && <Ticket size={18} className="text-emerald-500" />}
                                            {isCritical && <AlertTriangle size={20} className="text-red-500" />}
                                            {isDeparture && <Ship size={20} className="text-blue-300" />}
                                        </div>
                                    </div>

                                    <p className={`text-sm line-clamp-2 mb-2 ${isDeparture ? 'text-slate-300' : 'text-slate-600'}`}>{act.description}</p>

                                    <div className={`flex items-center justify-between mt-2 pt-2 border-t ${isDeparture ? 'border-slate-700' : 'border-slate-100'}`}>
                                        <div className={`flex items-center text-xs ${isDeparture ? 'text-slate-400' : 'text-slate-500'}`}>
                                            <MapPin size={12} className="mr-1" />
                                            {act.locationName}
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            {hasAudio && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onSelectActivity(act, true); }}
                                                    className="flex items-center text-xs font-bold text-white bg-purple-600 px-3 py-1.5 rounded-full shadow-sm hover:bg-purple-700 active:scale-95 transition-all"
                                                >
                                                    <Headphones size={14} className="mr-1" />
                                                    Audioguía
                                                </button>
                                            )}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onLocate(act.coords, act.endCoords); }}
                                                className="p-1.5 hover:bg-slate-100 rounded-full text-fjord-600"
                                            >
                                                <MapPin size={16} className={isDeparture ? 'text-blue-300' : ''} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {gapElement}
                        </React.Fragment>
                    );
                })}
                
                {/* Copyright Footer */}
                <div className="text-center py-8 text-slate-400 text-xs mt-4">
                    <p className="font-medium">Flåm Guide 2026</p>
                    <p>Actualizado el {UPDATE_DATE}</p>
                    <p className="mt-1">© 2025 - 2026 Gonzalo Arenas de la Hoz</p>
                </div>
            </div>
        </div>
    );
};

export default Timeline;