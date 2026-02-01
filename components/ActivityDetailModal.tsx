import React, { useState, useEffect } from 'react';
import { X, Headphones, Play, Pause, Camera, Ticket, Instagram, Lightbulb, Clock } from 'lucide-react';
import { Activity, AudioTrack } from '../types';
import { TRAIN_AUDIO_GUIDE, CRUISE_AUDIO_GUIDE, STEGASTEIN_AUDIO_GUIDE, FLAM_CENTER_AUDIO_GUIDE } from '../constants';

interface Props {
    activity: Activity;
    onClose: () => void;
    initialAutoOpen?: boolean;
}

const ActivityDetailModal: React.FC<Props> = ({ activity, onClose, initialAutoOpen = false }) => {
    const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
    const [showAudio, setShowAudio] = useState(initialAutoOpen);

    // Cleanup audio on close
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    if (!activity) return null;

    const toggleTrack = (track: AudioTrack) => {
        if (playingTrackId === track.id) {
            window.speechSynthesis.cancel();
            setPlayingTrackId(null);
        } else {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(track.text);
            utterance.lang = 'es-ES';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            utterance.onend = () => setPlayingTrackId(null);
            utterance.onerror = () => setPlayingTrackId(null);
            
            window.speechSynthesis.speak(utterance);
            setPlayingTrackId(track.id);
        }
    };
    
    // Determine which audio guide to use (if any)
    let audioData: AudioTrack[] | null = null;
    let audioTitle = "";
    
    if (activity.id === '4') {
        audioData = TRAIN_AUDIO_GUIDE;
        audioTitle = "Audioguía a Bordo";
    } else if (activity.id === '6') {
        audioData = CRUISE_AUDIO_GUIDE;
        audioTitle = "Audioguía del Fiordo";
    } else if (activity.id === '7') {
        audioData = STEGASTEIN_AUDIO_GUIDE;
        audioTitle = "Audioguía Rumbo a las Nubes";
    } else if (activity.id === '8') {
        audioData = FLAM_CENTER_AUDIO_GUIDE;
        audioTitle = "Audioguía Flåm Centro";
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] modal-content">
                {/* Header */}
                <div className="bg-fjord-500 p-4 text-white relative flex-shrink-0">
                    <h3 className="text-xl font-bold pr-8">{activity.title}</h3>
                    <div className="flex items-center text-fjord-100 text-sm mt-1">
                        <Clock size={14} className="mr-1" />
                        {activity.startTime === activity.endTime ? activity.startTime : `${activity.startTime} - ${activity.endTime}`}
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 rounded-full p-1">
                        <X size={20} />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-5 overflow-y-auto">
                    {/* Audio Guide Toggle Section */}
                    {audioData && (
                        <div className="mb-6">
                            {!showAudio ? (
                                <button 
                                    onClick={() => setShowAudio(true)}
                                    className="w-full bg-gradient-to-r from-fjord-600 to-fjord-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-center font-bold transition-transform active:scale-95 animate-pulse-slow"
                                >
                                    <Headphones className="mr-2" size={24} />
                                    Abrir Audioguía y Textos
                                </button>
                            ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-inner animate-in fade-in slide-in-from-top-2">
                                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
                                        <h4 className="flex items-center text-fjord-600 font-bold">
                                            <Headphones className="mr-2" size={20}/> {audioTitle}
                                        </h4>
                                        <button onClick={() => setShowAudio(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full shadow-sm">
                                            <X size={16} />
                                        </button>
                                        </div>
                                        <div className="space-y-4">
                                        {audioData.map((track) => {
                                            const isPlaying = playingTrackId === track.id;
                                            return (
                                                <div key={track.id} className={`p-4 rounded-xl border transition-all ${isPlaying ? 'bg-white border-blue-400 shadow-md ring-1 ring-blue-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h5 className={`text-sm font-bold leading-tight flex-1 pr-2 ${isPlaying ? 'text-blue-700' : 'text-slate-800'}`}>
                                                            {track.title}
                                                        </h5>
                                                        <button 
                                                            onClick={() => toggleTrack(track)}
                                                            className={`p-2 rounded-full flex-shrink-0 transition-colors shadow-sm ${isPlaying ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                                        >
                                                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Text Transcript */}
                                                    <div className="text-sm text-slate-600 leading-relaxed font-light text-justify whitespace-pre-wrap">
                                                        {track.text}
                                                    </div>

                                                    {isPlaying && (
                                                        <div className="mt-3 pt-2 border-t border-blue-50 flex items-center justify-center">
                                                            <div className="flex space-x-1 h-3 items-end">
                                                                <div className="equalizer-bar w-1 bg-blue-500"></div>
                                                                <div className="equalizer-bar w-1 bg-blue-500"></div>
                                                                <div className="equalizer-bar w-1 bg-blue-500"></div>
                                                            </div>
                                                            <span className="text-xs text-blue-500 ml-2 font-medium">Reproduciendo...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        </div>
                                        <div className="mt-4 text-center">
                                        <button onClick={() => setShowAudio(false)} className="text-xs text-slate-400 underline">Cerrar Audioguía</button>
                                        </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mb-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Descripción</h4>
                        <p className="text-gray-700 leading-relaxed">{activity.fullDescription || activity.description}</p>
                    </div>
                    
                    <div className="mb-4 bg-orange-50 p-3 rounded-lg border border-orange-100">
                        <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1 flex items-center">
                            <Lightbulb size={12} className="mr-1" /> Consejo Pro
                        </h4>
                        <p className="text-sm text-orange-800 italic whitespace-pre-wrap">{activity.tips}</p>
                    </div>
                    
                    {/* Instagram Button */}
                    {activity.instagramUrl && (
                        <a href={activity.instagramUrl} target="_blank" rel="noopener noreferrer" 
                            className="flex items-center justify-center w-full mb-4 p-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
                            <Instagram className="mr-2" size={20} />
                            Ver Fotos en Instagram
                        </a>
                    )}
                    
                    {/* Actions */}
                    <div className="space-y-3 pt-2">
                        {activity.webcamUrl && (
                            <a href={activity.webcamUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full p-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                                <Camera className="mr-2" size={18} />
                                Ver Webcam en Vivo
                            </a>
                        )}
                        
                        {activity.ticketUrl && (
                            <a href={activity.ticketUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full p-3 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-colors">
                                <Ticket className="mr-2" size={18} />
                                Comprar Tickets Online
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetailModal;