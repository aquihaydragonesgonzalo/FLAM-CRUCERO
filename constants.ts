import { Coords, Activity, AudioTrack, Pronunciation } from './types';

export const SHIP_DEPARTURE_TIME = "18:00";
export const ARRIVAL_TIME = "07:00";
export const ONBOARD_TIME = "17:45";
export const UPDATE_DATE = "04 de diciembre de 2025";

export const COORDS: Record<string, Coords> = {
    FLAM_DOCK: { lat: 60.863772, lng: 7.119263 }, // EMBARCADERO CRUCERO
    FLAM_DOCK_FJORD: { lat: 60.862935, lng: 7.116024 }, // EMBARCADERO CRUCERO FIORDOS
    FLAM_STATION: { lat: 60.863059, lng: 7.114333 }, // ESTACIÓN DE TREN
    MYRDAL: { lat: 60.735147, lng: 7.122816 }, // Myrdal
    AEGIR_PUB: { lat: 60.863712, lng: 7.117184 }, // Ægir BrewPub
    GUDVANGEN: { lat: 60.881375, lng: 6.841402 }, // Gudvangen
    STEGASTEIN_VIEWPOINT: { lat: 60.90862, lng: 7.211877 }, // Mirador Stegastein
    VISITOR_CENTER: { lat: 60.863359, lng: 7.114419 } // AUTOBUS MIRADOR / Centro Visitantes
};

export const TRAIN_AUDIO_GUIDE: AudioTrack[] = [
    {
        id: 1,
        title: "1. La Salida: Dejando el Fiordo (0 - 10 min)",
        text: "Bienvenidos a bordo del Flåmsbana. Mirad por la ventana. Ahora mismo estamos dejando atrás las aguas color esmeralda del Aurlandsfjord, un brazo del majestuoso Sognefjord. Estamos a nivel del mar, pero en menos de una hora, estaremos a casi 900 metros de altura.\n\nEste no es un tren cualquiera; es una hazaña de la ingeniería noruega. La construcción comenzó en 1923 y tardó casi 20 años en completarse. Fijaos en el paisaje: pasamos de un clima costero suave a un entorno de alta montaña en solo 20 kilómetros. Relajaos y preparaos, porque el valle de Flåm se va a estrechar y las paredes de roca van a empezar a crecer hacia el cielo."
    },
    {
        id: 2,
        title: "2. El Valle y la Granja Flåm (10 - 25 min)",
        text: "A medida que avanzamos, veréis pequeñas granjas aferradas a las laderas. Parecen de cuento, ¿verdad? Fijaos en la iglesia de Flåm, construida en madera oscura en el siglo XVII.\n\nEl río que nos acompaña, el Flåmselvi, es famoso por su salmón. Pero lo más impresionante aquí es la pendiente. Este tren tiene una inclinación del 5,5% en casi todo el trayecto. Es decir, subimos un metro por cada 18 metros que avanzamos. Es una de las vías de ancho estándar más empinadas del mundo que no utiliza cremallera ni cables, solo la pura potencia de las locomotoras eléctricas verdes que nos empujan."
    },
    {
        id: 3,
        title: "3. Los Túneles y la Ingeniería (25 - 40 min)",
        text: "Ahora entramos en la sección más técnica. Cruzaremos un total de 20 túneles. Y aquí viene el dato que os dejará helados: 18 de ellos fueron excavados totalmente a mano. Cada metro de túnel costaba a los trabajadores un mes de arduo trabajo en la oscuridad y el frío.\n\nEn breve, el tren hará un giro de herradura dentro de la montaña para ganar altura. Si miráis hacia abajo, veréis a la carretera serpenteante que los ciclistas valientes (y locos) utilizan para bajar. El paisaje se vuelve más dramático, con cascadas que caen cientos de metros en caída libre."
    },
    {
        id: 4,
        title: "4. La Parada Mágica: Kjosfossen (40 - 50 min)",
        text: "¡Atención! El tren se detiene. No hemos llegado al final, pero esta parada es obligatoria. Estamos frente a la imponente cascada de Kjosfossen. Bajad del tren unos minutos, sentid el rocío del agua en la cara y escuchad el rugido de la naturaleza.\n\nSi tenéis suerte y aguzáis la vista hacia las ruinas de piedra junto a la cascada, quizás veréis a la Huldra. Según la mitología nórdica, es una criatura del bosque, una mujer de belleza seductora que canta para atraer a los hombres a la montaña. En verano, los noruegos recrean esta leyenda con música y baile justo aquí, en medio de la nada."
    },
    {
        id: 5,
        title: "5. La Llegada: Myrdal y la Alta Montaña (50 - 60 min)",
        text: "Volvemos al tren para el último empujón. Notaréis que la vegetación ha cambiado drásticamente. Los árboles desaparecen y dan paso a musgo, roca y, a menudo, nieve, incluso en verano.\n\nEstamos llegando a Myrdal, a 867 metros sobre el nivel del mar. Aquí es donde nuestro pequeño tren se encuentra con la línea principal que conecta Oslo con Bergen. El aire aquí arriba es puro y fresco. Hemos conquistado la montaña. Espero que este viaje vertical os haya robado el corazón tanto como a mí."
    }
];

export const CRUISE_AUDIO_GUIDE: AudioTrack[] = [
    {
        id: 1,
        title: "1. La Salida: Navegando el Aurlandsfjord (0 - 30 min)",
        text: "Bienvenidos a bordo. Si el tren de Flåm era altura, esto es profundidad y silencio. Estamos zarpando desde Flåm por el Aurlandsfjord. Respirad hondo. Notaréis que el barco (especialmente si vais en el Future of the Fjords) apenas hace ruido. Es eléctrico, diseñado para respetar la paz de este santuario natural.\n\nA estribor (vuestra derecha saliendo de Flåm), veréis pequeñas granjas que parecen imposibles, colgadas literalmente de los precipicios. Fijaos bien cuando pasemos cerca de Undredal, ese pueblecito de colores que veréis en la orilla. ¿Os suena de algo? Dicen que inspiró el reino de Arendelle en la película Frozen de Disney. Es famoso por dos cosas: su iglesia de madera (la más pequeña de Escandinavia en uso) y su queso de cabra marrón. Si el viento es favorable, ¡casi se puede oler!"
    },
    {
        id: 2,
        title: "2. El Giro: Entrando en lo Desconocido (30 - 60 min)",
        text: "Atentos ahora, porque llegamos a una encrucijada monumental. El fiordo se bifurca en el monte Beitelen. Dejamos el Aurlandsfjord y giramos a la izquierda para entrar en el Nærøyfjord.\n\nAquí es donde la naturaleza se pone seria. Este fiordo es Patrimonio de la Humanidad de la UNESCO y la razón es su estrechez dramática. Las montañas que nos rodean se disparan hasta los 1.700 metros de altura, mientras que el agua bajo nosotros tiene hasta 500 metros de profundidad. Sentíos pequeños, porque aquí, la naturaleza es la que manda."
    },
    {
        id: 3,
        title: "3. El Paso Angosto: Bakka y el Silencio (60 - 90 min)",
        text: "Estamos llegando al punto más crítico y espectacular del viaje: la zona de Bakka. Mirad a vuestro alrededor. El fiordo se estrecha tanto que en su punto más angosto solo hay 250 metros de orilla a orilla. ¡Casi podríais saludar a la gente en la orilla opuesta!\n\nEn esta zona el agua es poco profunda, apenas 12 metros, lo que obligaba a los grandes barcos antiguos a maniobrar con cuidado. Fijaos en las cascadas que caen verticalmente, como la Sagfossen. En invierno se congelan creando esculturas de hielo gigantes; en verano, su rugido es la banda sonora perfecta para este desfiladero de agua."
    },
    {
        id: 4,
        title: "4. Desembarco: Gudvangen, Tierra de Vikingos (90 - 120 min)",
        text: "Al fondo ya se divisa el final del fiordo: Gudvangen. Este lugar ha sido un punto de comercio desde la Era Vikinga. De hecho, al desembarcar, si tenéis tiempo, veréis el poblado vikingo 'Njardarheimr'.\n\nAquí termina nuestra travesía marítima. Las paredes del valle parecen cerrarse sobre nosotros, creando una atmósfera casi mística. Dirigíos hacia los autobuses que están esperando a pocos metros del muelle para la segunda parte de nuestra aventura."
    },
    {
        id: 5,
        title: "5. El Regreso: El Autobús por el Valle de Nærøy (aprox. 20 min)",
        text: "Ya estamos cómodamente sentados en el autobús. El regreso a Flåm es rápido, pero interesante por el contraste. Vamos a recorrer el fondo del valle de Nærøydalen.\n\nMirad hacia arriba por las ventanillas. Esas montañas que antes veíamos desde el agua, ahora nos rodean por carretera. En breve, entraremos en el Túnel de Gudvanga. Con sus 11,4 kilómetros, es el segundo túnel de carretera más largo de esta región. Es una obra de ingeniería moderna que conecta estos pueblos aislados en invierno.\n\nEn unos 20 minutos veremos la luz al final del túnel y estaremos de vuelta en Flåm, completando nuestro círculo perfecto por tierra y mar."
    }
];

export const STEGASTEIN_AUDIO_GUIDE: AudioTrack[] = [
    {
        id: 1,
        title: "1. Saliendo de Flåm: El Fiordo a Ras de Suelo (0 - 10 min)",
        text: "Bienvenidos al autobús. Si hasta ahora habéis visto el fiordo desde abajo, preparaos para cambiar de perspectiva radicalmente. Salimos de Flåm bordeando la costa hacia el pueblo vecino de Aurland.\n\nA vuestra izquierda tenéis el Aurlandsfjord. Fijaos en el color del agua; desde aquí abajo se ve oscura y profunda, pero esperad a verla desde arriba. Pasaremos por Otternes Bygdetun, ese grupo de casitas antiguas de madera en la ladera. Es una granja del siglo XVIII que parece congelada en el tiempo. Aquí vivían familias enteras subsistiendo de lo poco que la tierra inclinada les daba."
    },
    {
        id: 2,
        title: "2. Aurland: El Centro del Municipio (10 - 20 min)",
        text: "Llegamos a Aurlandsvangen, el 'hermano mayor' de Flåm y centro administrativo de la zona. Aquí vive la gente de verdad, no solo turistas. ¿Veis esa intención de piedra blanca? Es la Vangen Kirke, construida en el año 1202. Es la iglesia de piedra más grande de toda la región de Sogn, un símbolo de poder en la época medieval.\n\nPero no nos detenemos aquí. Ahora empieza lo bueno. El autobús va a encarar la montaña. Respirad hondo si tenéis vértigo, porque vamos a subir por la famosa 'Carretera de la Nieve'."
    },
    {
        id: 3,
        title: "3. El Ascenso: La Carretera de la Nieve (20 - 30 min)",
        text: "Estamos en la Aurlandsfjellet, una de las 18 Rutas Escénicas Nacionales de Noruega. Antiguamente, esta era la única forma de cruzar hacia Lærdal cuando el fiordo se congelaba o no había barcos.\n\nLa carretera se retuerce en curvas de herradura mientras ganamos altura rápidamente. Mirad cómo los árboles empiezan a hacerse más pequeños. En invierno, esta carretera es un muro de nieve de varios metros de altura (de ahí su nombre), pero incluso en verano podréis ver parches blancos si miráis a las cumbres lejanas. La ingeniería para mantener esta carretera abierta es titánica."
    },
    {
        id: 4,
        title: "4. La Llegada: El Mirador Stegastein (30 - 35 min)",
        text: "¡Ya estamos aquí! 650 metros sobre el nivel del mar. El autobús se detiene. Al bajar, veréis una estructura de madera y acero que parece desafiar a la gravedad. Es el mirador de Stegastein.\n\nDiseñado por los arquitectos Todd Saunders y Tommie Wilhelmsen, es una rampa de 30 metros de largo que sale disparada hacia el vacío. Y lo mejor: al final, la barandilla es de cristal. Te da la sensación de estar volando literalmente sobre el fiordo. No tengáis miedo, ¡es totalmente seguro! Desde la punta, tendréis la vista más icónica y fotografiada de Noruega: el fiordo curvándose bajo vuestros pies como una cinta azul entre gigantes de piedra."
    }
];

export const FLAM_CENTER_AUDIO_GUIDE: AudioTrack[] = [
    {
        id: 1,
        title: "1. Flåm: El Tesoro Escondido (Introducción y Ubicación)",
        text: "¡Bienvenidos de nuevo a Flåm! Si os fijáis en el mapa, estamos en un lugar privilegiado: el punto más interior del Aurlandsfjord, que a su vez es un brazo del inmenso Sognefjord, el Rey de los Fiordos noruegos. El nombre 'Flåm' deriva de la palabra nórdica antigua Flá, que significa 'pequeño terreno llano', algo que es muy cierto si miramos a las enormes montañas que nos rodean.\n\nFlåm no es una ciudad, es un pequeño pueblo con poco más de 400 habitantes permanentes, pero con un papel gigante. Es un verdadero eje de transporte y aventura. Desde aquí se inician algunas de las experiencias más famosas de Noruega: el ferrocarril, el crucero silencioso y la carretera a Stegastein."
    },
    {
        id: 2,
        title: "2. La Atmósfera y la Naturaleza (Los Contrastes)",
        text: "Fijaos en el dramático contraste. Estamos rodeados por paredes de roca que se elevan más de mil metros, con nieve perpetua en las cimas. Sin embargo, aquí abajo, el clima es relativamente suave.\n\nEl pueblo está cortado por el río Flåmselvi, que es el río que desciende desde la estación de Myrdal y que hemos seguido en el tren. Este río trae vida, salmón y el agua dulce que se mezcla con el agua salada del fiordo. Sentiréis la paz de estar en un lugar que ha servido de refugio y puerto desde tiempos inmemoriales."
    },
    {
        id: 3,
        title: "3. El Centro de Actividad (Qué ver y hacer)",
        text: "Si tenéis tiempo entre una excursión y otra, Flåm ofrece un par de puntos interesantes justo aquí, en la terminal:\n\n• El Centro del Ferrocarril: Justo al lado de la estación, este pequeño museo cuenta la historia épica de la construcción del Flåmsbana. Es fascinante ver las fotos y el equipo antiguo que utilizaron los obreros.\n\n• A Taste of Flåm: ¿Buscáis algo local? Aquí podéis probar las cervezas artesanales de la microcervecería Ægir, inspiradas en la mitología nórdica y los ingredientes locales. El pub tiene un diseño exterior que imita una iglesia de madera (Stavkirke).\n\n• Compras: La mayoría de las tiendas se centran en artículos de lana noruega, souvenirs vikingos y, por supuesto, la ropa y equipo de montaña que caracteriza a esta región.\n\nFlåm es, en esencia, la puerta de entrada a la Noruega salvaje. Es el lugar perfecto para tomar ese último café, enviar una postal y grabar en vuestra mente la escala real de los fiordos."
    }
];

export const INITIAL_ITINERARY: Activity[] = [
    {
        id: '1', title: 'Llegada al Puerto de Flam', startTime: '07:00', endTime: '07:00',
        locationName: 'Fiordo de Aurlandsfjord', coords: COORDS.FLAM_DOCK,
        description: 'El MSC Euribia atraca en el puerto de Flåm.',
        fullDescription: 'Disfruta de las vistas de la llegada navegando por el fiordo antes de atracar. El barco inicia maniobras de atraque.',
        tips: 'Sube a cubierta para ver la aproximación al fiordo. Es espectacular.',
        keyDetails: 'Hora de llegada oficial.',
        priceNOK: 0, priceEUR: 0, type: 'logistics', completed: false
    },
    {
        id: '2', title: 'Desayuno Buffet "Marketplace"', startTime: '07:15', endTime: '07:45',
        locationName: 'MSC Euribia', coords: COORDS.FLAM_DOCK,
        description: 'Carga energía antes de bajar.',
        fullDescription: 'Desayuno completo en el buffet Marketplace del barco antes de iniciar la excursión.',
        tips: 'Come bien, el almuerzo en el pub es hasta las 10:40. Lleva agua.',
        keyDetails: 'Buffet abierto.',
        priceNOK: 0, priceEUR: 0, type: 'food', completed: false
    },
    {
        id: '3', title: 'Desembarque y Orientación', startTime: '08:00', endTime: '08:15',
        locationName: 'Muelle de Cruceros', coords: COORDS.FLAM_DOCK,
        description: 'Bajada del barco y camino a la estación.',
        fullDescription: 'Flåm estará fresco. Baja del barco y dirígete directamente a la estación de tren (a 200m).',
        tips: 'Aprovecha para sacar fotos del barco y el fiordo en la luz de la mañana. Es el mejor momento para fotos sin multitudes.',
        keyDetails: 'Webcam en vivo disponible.',
        priceNOK: 0, priceEUR: 0, type: 'logistics', completed: false, notes: 'Webcam disponible',
        webcamUrl: 'https://www.norwaysbest.com/es/flam/webcam-de-flam',
        instagramUrl: 'https://www.instagram.com/explore/tags/flam/'
    },
    {
        id: '4', title: 'El Tren (Flåmsbana)', startTime: '08:20', endTime: '10:28',
        locationName: 'Estación de Flåm', endLocationName: 'Estación Myrdal',
        coords: COORDS.FLAM_STATION, endCoords: COORDS.MYRDAL,
        description: 'Considerado uno de los viajes en tren más bonitos del mundo.',
        fullDescription: 'Considerado uno de los viajes en tren más bonitos del mundo. Subirás desde el nivel del mar hasta 867 metros. Verás la cascada Kjosfossen (donde el tren para fotos) y valles profundos.',
        tips: 'Esta es la pregunta del millón. Las vistas son espectaculares en ambos lados, pero hay una ligera ventaja dependiendo de la dirección:\n\nDe Flåm a Myrdal (subida): Siéntate en el lado derecho del tren (mirando hacia la dirección de la marcha). Verás mejor el valle y las cascadas principales durante la mayor parte del ascenso.\n\nDe Myrdal a Flåm (bajada): Siéntate en el lado izquierdo.',
        keyDetails: 'Ida y vuelta (~2 horas).',
        priceNOK: 810, priceEUR: 70, type: 'transport', completed: false, notes: 'Parada en cascada Kjosfossen',
        ticketUrl: 'https://www.norwaysbest.com/es/actividades/el-tren-de-flam',
        instagramUrl: 'https://www.instagram.com/explore/tags/flamsbana/'
    },
    {
        id: '5', title: 'Visita al Ægir BrewPub', startTime: '10:40', endTime: '11:40',
        locationName: 'Ægir BrewPub', coords: COORDS.AEGIR_PUB,
        description: 'Edificio vikingo con chimenea de 9 metros.',
        fullDescription: 'Un edificio inspirado en la mitología nórdica, con arquitectura de madera flotante, cabezas de dragon y una impresionante chimenea central de 9 metros de altura.',
        tips: '¡Tiempo para el festín! Disfruta de la chimenea y el ambiente vikingo antes del barco.',
        keyDetails: 'Bebida en el pub vikingo (según presupuesto).',
        priceNOK: 80, priceEUR: 8.50, type: 'food', completed: false,
        ticketUrl: 'https://www.google.com/search?q=https://www.flamsbrygga.no/en/aegir-brewpub/&authuser=1',
        instagramUrl: 'https://www.instagram.com/explore/tags/aegirbrewpub/'
    },
    {
        id: '6', title: 'Fjord Cruise + Bus', startTime: '12:00', endTime: '14:30',
        locationName: 'Puerto Flåm', endLocationName: 'Gudvangen',
        coords: COORDS.FLAM_DOCK_FJORD, endCoords: COORDS.GUDVANGEN,
        description: 'Navegarás por el Nærøyfjord (UNESCO).',
        fullDescription: 'Navegarás por el Nærøyfjord (Patrimonio UNESCO). Es la parte más estrecha y espectacular del fiordo, con cascadas y granjas aisladas en las laderas.',
        tips: 'Logística: Toma la salida del barco eléctrico a las 12:00. Navegas Flåm → Gudvangen, y tomas el bus de vuelta (shuttle incluido en el ticket) a Flåm.',
        keyDetails: 'Duración total 2.5 horas.',
        priceNOK: 835, priceEUR: 85, type: 'sightseeing', completed: false,
        ticketUrl: 'https://www.norwaysbest.com/es/flam/actividades/crucero-por-el-fiordo-naeroyfjord',
        instagramUrl: 'https://www.instagram.com/explore/tags/nærøyfjord/'
    },
    {
        id: '7', title: 'Mirador Stegastein', startTime: '15:00', endTime: '16:30',
        locationName: 'Parada Bus Flåm', endLocationName: 'Mirador Stegastein',
        coords: COORDS.FLAM_STATION, endCoords: COORDS.STEGASTEIN_VIEWPOINT,
        description: 'Plataforma a 650m sobre el fiordo.',
        fullDescription: 'Una plataforma de acero y madera que sobresale 30 metros de la montaña y cuelga a 650 metros sobre el fiordo con un panel frontal de cristal único.',
        tips: 'Toma el bus a las 15:00. Volverás con las espectaculares luces del atardecer primaveral sobre el fiordo.',
        keyDetails: 'Tour en bus ida y vuelta.',
        priceNOK: 440, priceEUR: 40, type: 'sightseeing', completed: false,
        ticketUrl: 'https://www.norwaysbest.com/es/flam/actividades/mirador-stegastein',
        instagramUrl: 'https://www.instagram.com/explore/tags/stegastein/'
    },
    {
        id: '8', title: 'Compras y Relax', startTime: '16:30', endTime: '17:30',
        locationName: 'Centro de Visitantes', coords: COORDS.VISITOR_CENTER,
        description: 'Tiendas de souvenirs y artesanías.',
        fullDescription: 'Tiendas de souvenirs con suéteres de lana noruega auténtica y artesanías locales.',
        tips: '¡Nuevo! Una hora completa para el paseo sin prisas gracias a la hora extra. Último café o souvenir.',
        keyDetails: 'Relajado, sin prisa.',
        priceNOK: 0, priceEUR: 0, type: 'shopping', completed: false
    },
    {
        id: '9', title: 'Caminata Final al Barco', startTime: '17:30', endTime: '17:45',
        locationName: 'Centro -> Muelle', coords: COORDS.FLAM_DOCK,
        description: 'Traslado tranquilo al muelle.',
        fullDescription: 'Comienza a moverte tranquilamente hacia el muelle para el embarque.',
        tips: 'Advertencia: No apures el tiempo. Es el momento de volver.',
        keyDetails: '15 min de caminata.',
        priceNOK: 0, priceEUR: 0, type: 'logistics', completed: false
    },
    {
        id: '10', title: '¡A BORDO! (Límite)', startTime: '17:45', endTime: '17:45',
        locationName: 'Muelle', coords: COORDS.FLAM_DOCK,
        description: 'Pasarela se retira. Hora límite.',
        fullDescription: 'Regreso obligatorio al barco. A las 17:45 se retira la pasarela de acceso. No hay tolerancia.',
        tips: '¡ADVERTENCIA! No llegues tarde. Hora límite absoluta para embarcar: 17:45.',
        keyDetails: 'CRÍTICO: LÍMITE EMBARQUE.',
        priceNOK: 0, priceEUR: 0, type: 'logistics', completed: false, notes: 'CRITICAL'
    },
    {
        id: '11', title: 'Zarpa el MSC Euribia', startTime: '18:00', endTime: '18:00',
        locationName: 'Fiordo Aurlandsfjord', coords: COORDS.FLAM_DOCK,
        description: 'El barco inicia la navegación de salida.',
        fullDescription: 'Despedida de Flåm. Disfruta de las vistas del fiordo a la inversa mientras el barco se aleja.',
        tips: 'Sube a cubierta para ver la maniobra de salida y el atardecer en el fiordo.',
        keyDetails: 'Adiós Flåm.',
        priceNOK: 0, priceEUR: 0, type: 'logistics', completed: false
    }
];

export const PRONUNCIATIONS: Pronunciation[] = [
    { word: 'Flåm', phonetic: '/floːm/', simplified: 'FLOUM', meaning: 'Llanura pequeña' },
    { word: 'Flåmsbana', phonetic: '/flɔmsbɑːnɑ/', simplified: 'FLOM-baana', meaning: 'Tren de Flåm' },
    { word: 'Myrdal', phonetic: '/myːrdɑl/', simplified: 'MÜR-dal', meaning: 'Valle pantanoso' },
    { word: 'Ægir', phonetic: '/ˈɛːjiɾ/', simplified: 'ÉG-uir', meaning: 'Gigante del mar' },
    { word: 'Nærøyfjord', phonetic: '/ˈnɛːrœɪfjɔr/', simplified: 'NEHR-oy-fiuord', meaning: 'Fiordo estrecho' },
    { word: 'Stegastein', phonetic: '/ˈstɛgɑstɑɪn/', simplified: 'STÉ-ga-stain', meaning: 'Piedra del sendero' },
    { word: 'Gudvangen', phonetic: '/ˈgʉdʋɑŋən/', simplified: 'GÜD-vang-en', meaning: 'Campo de los dioses' },
    { word: 'Takk', phonetic: '/tak/', simplified: 'TAK', meaning: 'Gracias' },
];