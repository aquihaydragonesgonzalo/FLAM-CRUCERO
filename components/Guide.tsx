import React, { useState, useEffect } from 'react';
import { AlertTriangle, Anchor, Camera, Sun, CloudRain, CloudSnow, Clock, Droplets, CloudSun, Volume2, ArrowRight, Sunrise, Sunset, FileDown, Loader2 } from 'lucide-react';
import { jsPDF } from "jspdf";
import { Coords, HourlyForecast, DailyForecast, AstronomyData, WeatherData } from '../types';
import { PRONUNCIATIONS, UPDATE_DATE, INITIAL_ITINERARY } from '../constants';

interface Props {
    userLocation: Coords | null;
}

const Guide: React.FC<Props> = ({ userLocation }) => {
    const [playing, setPlaying] = useState<string | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<DailyForecast[]>([]);
    const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
    const [astronomy, setAstronomy] = useState<AstronomyData | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    // Fetch Weather & Solar Data
    useEffect(() => {
        // Weather
        fetch('https://api.open-meteo.com/v1/forecast?latitude=60.86&longitude=7.11&current=temperature_2m,weather_code,is_day&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=5')
            .then(res => res.json())
            .then(data => {
                setWeather(data);
                
                // Process Hourly (07:00 - 18:00 for today)
                if (data.hourly) {
                    const hourly: HourlyForecast[] = [];
                    // Loop through first 24 indices (Today)
                    for(let i = 0; i < 24; i++) {
                        const timeStr = data.hourly.time[i]; // "2025-12-04T07:00"
                        const hourStr = timeStr.split('T')[1].split(':')[0];
                        const hour = parseInt(hourStr, 10);
                        
                        if (hour >= 7 && hour <= 18) {
                            hourly.push({
                                time: `${hourStr}:00`,
                                temp: Math.round(data.hourly.temperature_2m[i]),
                                precip: data.hourly.precipitation_probability[i],
                                code: data.hourly.weather_code[i]
                            });
                        }
                    }
                    setHourlyForecast(hourly);
                }

                // Process 5-day forecast
                if(data.daily) {
                    const days = data.daily.time.map((t: string, i: number) => ({
                        date: t,
                        max: data.daily.temperature_2m_max[i],
                        min: data.daily.temperature_2m_min[i],
                        code: data.daily.weather_code[i]
                    }));
                    setForecast(days);
                }
            })
            .catch(e => console.log('Weather offline'));

        // Solar/Astronomy
        fetch('https://api.open-meteo.com/v1/forecast?latitude=60.86&longitude=7.11&daily=sunrise,sunset,daylight_duration&timezone=Europe%2FBerlin&forecast_days=1')
            .then(res => res.json())
            .then(data => {
                if (data.daily) {
                    setAstronomy({
                        sunrise: data.daily.sunrise[0], // ISO String
                        sunset: data.daily.sunset[0],   // ISO String
                        duration: (data.daily.daylight_duration[0] / 3600).toFixed(1)
                    });
                }
            })
            .catch(e => console.log("Astronomy offline"));
    }, []);

    const playAudio = (text: string) => {
        if ('speechSynthesis' in window) {
            setPlaying(text);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'no-NO'; // Norwegian
            utterance.rate = 0.9;
            utterance.onend = () => setPlaying(null);
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Tu navegador no soporta audio.");
        }
    };

    const getWeatherIcon = (code: number) => {
        if (code <= 3) return <Sun className="text-yellow-500" />;
        if (code <= 60) return <CloudRain className="text-blue-400" />;
        return <CloudSnow className="text-gray-400" />;
    };

    const handleSOS = () => {
        if (!userLocation) {
            alert("Necesitamos tu ubicación primero. Asegúrate de tener el GPS activo.");
            return;
        }
        const text = `🆘 SOS! Necesito ayuda. Mi ubicación actual en Flåm es: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const openTranslator = () => {
        window.open('https://translate.google.com/?sl=no&tl=es&op=images', '_blank');
    };
    
    const openMSCApp = () => {
        window.open('https://play.google.com/store/apps/details?id=com.msccruises.mscforme', '_blank');
    };

    const generatePDF = () => {
        setIsGeneratingPdf(true);
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            let y = 20;

            // Header
            doc.setFontSize(22);
            doc.setTextColor(42, 91, 135); // Fjord Color
            doc.text("Guía de Viaje: Flåm 2026", pageWidth / 2, y, { align: "center" });
            
            y += 10;
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generado el: ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: "center" });
            
            y += 15;
            doc.setLineWidth(0.5);
            doc.setDrawColor(200);
            doc.line(10, y, pageWidth - 10, y);
            y += 10;

            // Content Loop
            INITIAL_ITINERARY.forEach((item, index) => {
                // Page Break Check
                if (y > 250) {
                    doc.addPage();
                    y = 20;
                }

                const isDeparture = item.notes === 'DEPARTURE';
                const isCritical = item.notes === 'CRITICAL';

                // Time Box
                doc.setFontSize(10);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(255, 255, 255);
                
                let timeColor = [42, 91, 135]; // Default Blue
                if (isCritical) timeColor = [220, 38, 38]; // Red
                if (isDeparture) timeColor = [30, 41, 59]; // Dark Slate
                
                doc.setFillColor(timeColor[0], timeColor[1], timeColor[2]);
                doc.roundedRect(10, y - 4, 35, 6, 1, 1, 'F');
                doc.text(`${item.startTime} - ${item.endTime}`, 12, y);

                // Location Name
                doc.setTextColor(100);
                doc.setFont(undefined, 'normal');
                doc.text(`@ ${item.locationName}`, 50, y);

                y += 8;

                // Title
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0);
                doc.text(item.title, 10, y);
                y += 6;

                // Description
                doc.setFontSize(11);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(60);
                const descLines = doc.splitTextToSize(item.fullDescription, pageWidth - 20);
                doc.text(descLines, 10, y);
                y += (descLines.length * 5) + 3;

                // Tips
                if (item.tips) {
                    if (y > 260) { doc.addPage(); y = 20; }
                    doc.setFontSize(10);
                    doc.setTextColor(194, 65, 12); // Orange Dark
                    doc.setFont(undefined, 'italic');
                    const tipLines = doc.splitTextToSize(`Tip: ${item.tips}`, pageWidth - 20);
                    doc.text(tipLines, 10, y);
                    y += (tipLines.length * 5) + 2;
                }

                // Price
                if (item.priceEUR > 0) {
                    doc.setFontSize(10);
                    doc.setTextColor(21, 128, 61); // Green
                    doc.setFont(undefined, 'bold');
                    doc.text(`Coste: ${item.priceNOK} NOK (~${item.priceEUR}€)`, 10, y);
                    y += 5;
                }

                y += 8; // Spacing between items
                
                // Separator line (light)
                doc.setDrawColor(240);
                doc.line(10, y - 4, pageWidth - 10, y - 4);
            });

            // Footer
            const totalPages = doc.internal.pages.length - 1;
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(`Página ${i} de ${totalPages} - Flåm Guide 2026`, pageWidth / 2, 290, { align: "center" });
            }

            doc.save("Itinerario_Flam_2026.pdf");
        } catch (error) {
            console.error("Error generating PDF", error);
            alert("Hubo un error al generar el PDF.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    // Solar Chart Helper
    const renderSolarChart = () => {
        if (!astronomy) return <div className="text-xs text-slate-400">Cargando datos solares...</div>;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const totalMinutes = 24 * 60;
        const nowPercent = (currentMinutes / totalMinutes) * 100;

        const sunriseDate = new Date(astronomy.sunrise);
        const sunsetDate = new Date(astronomy.sunset);
        
        const sunriseMins = sunriseDate.getHours() * 60 + sunriseDate.getMinutes();
        const sunsetMins = sunsetDate.getHours() * 60 + sunsetDate.getMinutes();
        
        const sunrisePercent = (sunriseMins / totalMinutes) * 100;
        const sunsetPercent = (sunsetMins / totalMinutes) * 100;

        const sunriseStr = `${String(sunriseDate.getHours()).padStart(2,'0')}:${String(sunriseDate.getMinutes()).padStart(2,'0')}`;
        const sunsetStr = `${String(sunsetDate.getHours()).padStart(2,'0')}:${String(sunsetDate.getMinutes()).padStart(2,'0')}`;

        return (
            <div className="mt-4 bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden shadow-inner">
                <div className="flex justify-between text-xs text-slate-400 mb-6 font-mono">
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>23:59</span>
                </div>
                
                {/* The Bar Container */}
                <div className="relative h-12 w-full rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                    {/* Day Segment (Blue) */}
                    <div 
                        className="absolute top-0 bottom-0 bg-sky-400"
                        style={{ 
                            left: `${sunrisePercent}%`, 
                            width: `${sunsetPercent - sunrisePercent}%` 
                        }}
                    ></div>

                    {/* Sunrise Gradient Overlay */}
                    <div 
                        className="absolute top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-slate-800 via-orange-400 to-sky-400 opacity-90"
                        style={{ left: `${sunrisePercent}%` }}
                    ></div>

                    {/* Sunset Gradient Overlay */}
                    <div 
                        className="absolute top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-sky-400 via-orange-500 to-slate-800 opacity-90"
                        style={{ left: `${sunsetPercent}%` }}
                    ></div>
                    
                    {/* NOW Indicator */}
                    <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                        style={{ left: `${nowPercent}%` }}
                    >
                        <div className="absolute -top-1 -left-[3px] w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="absolute top-1/2 -left-6 bg-red-600 text-white text-[9px] font-bold px-1 rounded transform -translate-y-1/2">AHORA</div>
                    </div>
                </div>

                {/* Labels positioned absolutely */}
                <div className="relative h-6 mt-1 w-full text-[10px] font-bold">
                    <div 
                        className="absolute transform -translate-x-1/2 flex flex-col items-center text-yellow-400"
                        style={{ left: `${sunrisePercent}%` }}
                    >
                        <ArrowRight size={10} className="-rotate-90 mb-0.5"/>
                        <span>{sunriseStr}</span>
                    </div>
                    <div 
                        className="absolute transform -translate-x-1/2 flex flex-col items-center text-orange-400"
                        style={{ left: `${sunsetPercent}%` }}
                    >
                        <ArrowRight size={10} className="-rotate-90 mb-0.5"/>
                        <span>{sunsetStr}</span>
                    </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-xs text-slate-300 bg-white/5 p-2 rounded">
                    <div className="flex items-center"><Sunrise size={14} className="text-yellow-400 mr-2"/> Amanecer</div>
                    <div className="font-mono">{astronomy.duration}h Luz</div>
                    <div className="flex items-center">Atardecer <Sunset size={14} className="text-orange-500 ml-2"/></div>
                </div>
            </div>
        );
    };

    return (
        <div className="pb-24 px-4 pt-6 max-w-lg mx-auto h-full overflow-y-auto">
            
            {/* SOS & Apps Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                    onClick={handleSOS}
                    className="bg-red-600 text-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center active:scale-95 transition-transform animate-pulse-slow col-span-2 sm:col-span-1"
                >
                    <AlertTriangle size={32} className="mb-2" />
                    <span className="font-bold text-sm">SOS EMERGENCIA</span>
                    <span className="text-[10px] opacity-80 mt-1">Enviar Ubicación</span>
                </button>
                
                <div className="grid grid-cols-2 gap-2 col-span-2 sm:col-span-1">
                    <button 
                        onClick={openMSCApp}
                        className="bg-blue-900 text-white p-2 rounded-xl shadow flex flex-col items-center justify-center active:scale-95 h-full"
                    >
                        <Anchor size={20} className="mb-1" />
                        <span className="text-[10px] font-bold">App MSC</span>
                    </button>
                    <button 
                        onClick={openTranslator}
                        className="bg-indigo-600 text-white p-2 rounded-xl shadow flex flex-col items-center justify-center active:scale-95 h-full"
                    >
                        <Camera size={20} className="mb-1" />
                        <span className="text-[10px] font-bold">Traductor</span>
                    </button>
                    <button 
                        onClick={generatePDF}
                        disabled={isGeneratingPdf}
                        className="col-span-2 bg-emerald-600 text-white p-2 rounded-xl shadow flex items-center justify-center active:scale-95 h-10 mt-1"
                    >
                        {isGeneratingPdf ? <Loader2 size={18} className="animate-spin mr-2" /> : <FileDown size={18} className="mr-2" />}
                        <span className="text-xs font-bold">{isGeneratingPdf ? 'Generando...' : 'Descargar Itinerario PDF'}</span>
                    </button>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-fjord-500 mb-4">Guía Local</h2>

            {/* Solar Chart */}
            <div className="mb-8">
                <h3 className="font-bold text-slate-700 mb-2 flex items-center"><Sun size={18} className="mr-2 text-orange-500"/> Ciclo Solar Hoy</h3>
                {renderSolarChart()}
            </div>

            {/* Hourly Weather Forecast (07:00 - 18:00) */}
            {hourlyForecast.length > 0 && (
                <div className="mb-8">
                        <h3 className="font-bold text-slate-700 mb-4 flex items-center"><Clock size={18} className="mr-2 text-blue-500"/> Clima por Horas (07:00 - 18:00)</h3>
                        <div className="flex overflow-x-auto pb-4 space-x-3 snap-x">
                        {hourlyForecast.map((hour, idx) => (
                            <div key={idx} className="flex-none w-20 bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center snap-center">
                                <span className="text-xs font-bold text-slate-400 mb-2">{hour.time}</span>
                                <div className="mb-2 scale-125">{getWeatherIcon(hour.code)}</div>
                                <span className="text-lg font-bold text-slate-800">{hour.temp}°</span>
                                <div className="flex items-center text-[10px] text-blue-500 font-medium mt-1">
                                    <Droplets size={8} className="mr-1"/> {hour.precip}%
                                </div>
                            </div>
                        ))}
                        </div>
                </div>
            )}

            {/* 5-Day Forecast */}
            <div className="mb-8">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center"><CloudSun size={18} className="mr-2 text-blue-500"/> Pronóstico 5 Días</h3>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
                    {forecast.length > 0 ? forecast.map((day, i) => {
                        const date = new Date(day.date);
                        const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
                        return (
                            <div key={day.date} className="p-3 flex justify-between items-center">
                                <span className="capitalize w-24 font-medium text-slate-700">{i===0 ? 'Hoy' : dayName}</span>
                                <div className="flex items-center">
                                    {getWeatherIcon(day.code)}
                                    <span className="ml-2 text-sm text-slate-500">{day.code <= 3 ? 'Soleado' : 'Nublado'}</span>
                                </div>
                                <div className="text-sm font-mono font-bold text-slate-800">
                                    {Math.round(day.max)}° <span className="text-slate-400">/ {Math.round(day.min)}°</span>
                                </div>
                            </div>
                        )
                    }) : <div className="p-4 text-center text-slate-400">Cargando clima...</div>}
                    </div>
            </div>
            
            {/* Pronunciation */}
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><Volume2 size={18} className="mr-2"/> Diccionario Exprés</h3>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                {PRONUNCIATIONS.map((item, idx) => (
                <div key={item.word} className={`p-4 flex justify-between items-center ${idx !== PRONUNCIATIONS.length - 1 ? 'border-b border-slate-50' : ''}`}>
                    <div>
                        <div className="flex items-baseline space-x-2">
                            <span className="font-bold text-lg text-fjord-700">{item.word}</span>
                            <span className="text-xs text-slate-400 font-mono bg-slate-100 px-1 rounded">{item.simplified}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 italic">{item.meaning}</p>
                    </div>
                    <button 
                        onClick={() => playAudio(item.word)}
                        className={`p-3 rounded-full transition-colors ${playing === item.word ? 'bg-emerald-100 text-emerald-600 scale-110' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                    <Volume2 size={20} />
                    </button>
                </div>
                ))}
            </div>

                {/* Footer */}
                <div className="text-center py-8 text-slate-400 text-xs">
                <p className="font-medium">Flåm Guide 2026</p>
                <p>Actualizado el {UPDATE_DATE}</p>
                <p className="mt-1">© 2025 - 2026 Gonzalo Arenas de la Hoz</p>
            </div>
        </div>
    );
};

export default Guide;