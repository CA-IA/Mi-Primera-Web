function generarResumen(){

    const norma =
        document.getElementById("normaInput").value;

    const resumenTexto =
        document.getElementById("resumenTexto");

    const mapaConceptual =
        document.getElementById("mapaConceptual");

    if(norma === ""){

        resumenTexto.innerHTML =
            "Introduce una norma.";

        mapaConceptual.innerHTML = "";

        return;
    }

    let resumen = "";
    let mapa = "";

    /* ISO 9001 */

    if(norma.toLowerCase().includes("9001")){

        resumen =
        `
ISO 9001 es una norma internacional enfocada
en los sistemas de gestión de calidad y en la
mejora continua de las organizaciones.

Su objetivo principal es garantizar que una
empresa sea capaz de proporcionar productos
y servicios que satisfagan los requisitos del
cliente y los requisitos legales aplicables.

La norma se basa en principios como enfoque
al cliente, liderazgo, participación del
personal, gestión por procesos y mejora
continua.

ISO 9001 promueve la identificación de riesgos
y oportunidades, la evaluación del desempeño,
la realización de auditorías internas y la toma
de decisiones basadas en evidencias.

También exige control documental, planificación
de objetivos de calidad, seguimiento de
indicadores y evaluación de satisfacción del
cliente.

La aplicación de ISO 9001 ayuda a aumentar
la eficiencia operativa, mejorar la imagen de
la empresa y facilitar la mejora continua de
todos los procesos organizativos.
        `;

        mapa =
        `
ISO 9001
│
├── 4. Contexto organización
│   ├── Partes interesadas
│   ├── Alcance
│   └── Procesos
│
├── 5. Liderazgo
│   ├── Política calidad
│   └── Roles
│
├── 6. Planificación
│   ├── Riesgos
│   ├── Oportunidades
│   └── Objetivos
│
├── 7. Apoyo
│   ├── Recursos
│   ├── Competencia
│   └── Información documentada
│
├── 8. Operación
│   ├── Control operacional
│   ├── Diseño
│   └── Producción
│
├── 9. Evaluación desempeño
│   ├── Auditorías
│   ├── Indicadores
│   └── Revisión dirección
│
└── 10. Mejora
    ├── No conformidades
    └── Mejora continua
        `;
    }

    /* ISO 14001 */

    else if(norma.toLowerCase().includes("14001")){

        resumen =
        `
ISO 14001 es una norma internacional orientada
a los sistemas de gestión ambiental.

Permite a las organizaciones identificar,
controlar y reducir los impactos ambientales
de sus actividades, productos y servicios.

La norma establece requisitos relacionados
con cumplimiento legal, sostenibilidad,
prevención de contaminación y mejora continua
del desempeño ambiental.

ISO 14001 ayuda a controlar residuos, emisiones,
consumo energético y uso eficiente de recursos.

También promueve la planificación ambiental,
la preparación ante emergencias y la evaluación
periódica de objetivos ambientales.

La implantación de ISO 14001 mejora la imagen
corporativa y favorece el cumplimiento de los
requisitos regulatorios y ambientales.
        `;

        mapa =
        `
ISO 14001
│
├── Contexto ambiental
├── Liderazgo ambiental
├── Riesgos ambientales
├── Objetivos ambientales
├── Recursos y competencias
├── Control operacional
├── Emergencias ambientales
├── Evaluación desempeño
└── Mejora continua
        `;
    }

    /* ISO 17025 */

    else if(norma.toLowerCase().includes("17025")){

        resumen =
        `
ISO 17025 es una norma internacional aplicada
a laboratorios de ensayo y calibración.

Define requisitos relacionados con competencia
técnica, imparcialidad y fiabilidad de los
resultados analíticos.

La norma establece controles sobre equipos,
calibraciones, validación de métodos,
incertidumbre de medida y trazabilidad.

También regula la competencia del personal,
las condiciones ambientales y la gestión
documental del laboratorio.

ISO 17025 incluye requisitos de auditorías,
acciones correctivas y mejora continua.

La aplicación de esta norma aumenta la
confianza en los resultados emitidos por el
laboratorio y facilita el reconocimiento
internacional de su competencia técnica.
        `;

        mapa =
        `
ISO 17025
│
├── Imparcialidad
├── Confidencialidad
├── Competencia personal
├── Equipos
├── Calibraciones
├── Validación métodos
├── Muestreo
├── Incertidumbre medida
├── Trazabilidad
├── Auditorías
└── Mejora continua
        `;
    }

    else{

        resumen =
        `
La norma indicada todavía no se encuentra
incluida en esta versión de demostración.
        `;

        mapa =
        `
Norma
│
└── Información no disponible
        `;
    }

    resumenTexto.innerHTML = resumen;

    mapaConceptual.innerHTML = mapa;
}