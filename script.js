let datosEvaluacion = null;

async function generarResumen(){

    const norma =
        document.getElementById("normaInput").value;

    const resumenTexto =
        document.getElementById("resumenTexto");
    
    const pdfContainer =
        document.getElementById("pdfContainer");

    const mapaConceptual =
        document.getElementById("mapaConceptual");

    const mapaVisual =
        document.getElementById("mapaVisual");

    if(norma === ""){

        resumenTexto.innerHTML =
            "Introduce una norma.";

        return;
    }

    resumenTexto.innerHTML =
        "Generando resumen con IA...";

    datosEvaluacion = null;
    window.documentoCompleto = "";
    reiniciarCuestionario();

    mapaConceptual.innerHTML = "";
    mapaVisual.innerHTML = "";

    try{

        const respuesta = await fetch(
            "/api/resumen",
            {
                method: "POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({
                    norma: norma
                })
            }
        );

        const datos = await respuesta.json();

            console.log("RESPUESTA API:");
            console.log(datos);

            if(!respuesta.ok){

                throw new Error(
                    datos.error || "Error API"
                );

            }

        const texto = datos.resultado;

            if(!texto){

                throw new Error(
                    "La API no devolvió resultado"
                );

            }

        const partesMermaid =
            texto.split("MERMAID:");

        if(partesMermaid.length < 2){

            resumenTexto.innerHTML =
                "La IA no generó el mapa conceptual.";

            console.error(texto);

            return;
        }

        const resumen =
            partesMermaid[0]
                .replace("RESUMEN:","")
                .trim();

        let mermaidCode =
            partesMermaid[1].trim();
        
        mermaidCode =
            mermaidCode
                .replace(/```mermaid/g, "")
                .replace(/```/g, "")
                .trim();

        mermaidCode =
            mermaidCode
                .split("\n")
                .filter(linea =>
                    !linea.trim().startsWith("%")
                )
                .join("\n");

        console.log("MERMAID LIMPIO:");
        console.log(mermaidCode);

        
        resumenTexto.innerHTML =
            resumen;

        datosEvaluacion = {
            norma: norma,
            resumen: resumen,
            mermaid: mermaidCode,
            documento: ""
        };

        reiniciarCuestionario();
        
        document.getElementById("zonaDocumento")
            .style.display = "block";
                
        const pdfContainer =
            document.getElementById("pdfContainer");

        pdfContainer.style.display =
            "block";

        document.getElementById("btnPDF").onclick =
            function(){

                const { jsPDF } = window.jspdf;

                const pdf =
                    new jsPDF();

                const fecha =
                    new Date().toLocaleDateString("es-ES");

                /*
                PORTADA
                */

                pdf.setFontSize(26);
                pdf.setTextColor(29,78,216);

                pdf.text(
                    norma,
                    105,
                    50,
                    { align:"center" }
                );

                pdf.setFontSize(18);

                pdf.text(
                    "Guía completa de estudio",
                    105,
                    70,
                    { align:"center" }
                );

                pdf.setFontSize(12);

                pdf.setTextColor(80);

                pdf.text(
                    "Generado por IA para QA",
                    105,
                    90,
                    { align:"center" }
                );

                pdf.text(
                    fecha,
                    105,
                    100,
                    { align:"center" }
                );

                /*
                NUEVA PÁGINA
                */

                pdf.addPage();

                pdf.setFontSize(10);

                pdf.setTextColor(120);

                pdf.text(
                    "IA para QA",
                    15,
                    10
                );

                pdf.text(
                    norma,
                    150,
                    10
                );

                pdf.setTextColor(0);

                /*
                DOCUMENTO
                */

                pdf.setTextColor(0);

                pdf.setFontSize(12);

                const textoLimpio =
                    window.documentoCompleto
                        .replace(/^### /gm, "")
                        .replace(/^## /gm, "")
                        .replace(/^# /gm, "");

                const lineas =
                    pdf.splitTextToSize(
                        textoLimpio,
                        180
                    );

                let y = 20;

                let pagina = 2;

                lineas.forEach(linea => {

                    if(y > 270){

                        pdf.setFontSize(10);

                        pdf.text(
                            `Página ${pagina}`,
                            180,
                            290
                        );

                        pdf.addPage();

                        pagina++;

                        y = 20;

                        pdf.setFontSize(12);

                    }

                    pdf.text(
                        linea,
                        15,
                        y
                    );

                    y += 7;

                });

                pdf.setFontSize(10);

                pdf.text(
                    `Página ${pagina}`,
                    180,
                    290
                );

                pdf.output("dataurlnewwindow");

            };

        document.getElementById("btnAudio").onclick =
            function(){

                if(!window.documentoCompleto){

                    alert(
                        "Primero debes generar el documento completo."
                    );

                    return;
                }

                speechSynthesis.cancel();

                const lectura =
                    new SpeechSynthesisUtterance(
                        window.documentoCompleto
                    );

                lectura.lang = "es-ES";

                lectura.rate = 1;

                speechSynthesis.speak(
                    lectura
                );

            };

        document.getElementById("btnPausa").onclick =
            function(){

                if(speechSynthesis.speaking){

                    if(speechSynthesis.paused){

                        speechSynthesis.resume();

                        this.innerHTML =
                            "⏸ Pausar";

                    }else{

                        speechSynthesis.pause();

                        this.innerHTML =
                            "▶ Continuar";

                    }

                }

            };

        document.getElementById("btnStop").onclick =
            function(){

                speechSynthesis.cancel();

                document.getElementById("btnPausa").innerHTML =
                    "⏸ Pausar";

            };

        mapaConceptual.innerHTML =
            "Diagrama generado por IA";

        mapaVisual.innerHTML =
            `<pre class="mermaid">${mermaidCode}</pre>`;

        await window.mermaid.run();

        const contenedor =
            document.getElementById("mapaVisual");

        contenedor.onclick = function(){

        document.getElementById("modalMapa").style.display =
            "block";

        document.getElementById("mapaGrande").innerHTML =
            `<pre class="mermaid">${mermaidCode}</pre>`;

        window.mermaid.run();
        };


    }

    catch(error){

        console.error(error);

        resumenTexto.innerHTML =
            error.message;

    }

}

window.addEventListener("load", () => {

    const btnDocumento =
        document.getElementById(
            "btnGenerarDocumento"
        );

    if(btnDocumento){

        btnDocumento.onclick =
            generarDocumento;

    }

    const cerrar =
        document.getElementById("cerrarMapa");

    if(cerrar){

        cerrar.addEventListener("click", () => {

            document.getElementById("modalMapa")
                .style.display = "none";

        });

    }

    const btnCuestionario =
        document.getElementById("btnCuestionario");

    if(btnCuestionario){

        btnCuestionario.addEventListener(
            "click",
            mostrarCuestionario
        );

    }

});

async function generarDocumento(){

    const norma =
        document.getElementById("normaInput").value;

    const boton =
        document.getElementById("btnGenerarDocumento");

    boton.innerHTML =
        "Generando documento...";

    const respuesta = await fetch(
        "/api/documento",
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                norma:norma
            })
        }
    );

    const datos =
        await respuesta.json();

    const textoPDF =
        datos.documento;

    window.documentoCompleto =
        textoPDF;

    if(datosEvaluacion){

        datosEvaluacion.documento =
            textoPDF;

    }

    boton.innerHTML =
        "✅ Documento generado";

    document.getElementById("pdfContainer")
        .style.display = "block";
}

function reiniciarCuestionario(){

    const contenedor =
        document.getElementById("cuestionarioContainer");

    if(contenedor){

        contenedor.innerHTML = "";

    }

}

function mostrarCuestionario(){

    const contenedor =
        document.getElementById("cuestionarioContainer");

    if(!datosEvaluacion){

        contenedor.innerHTML =
            `<div class="aviso-cuestionario">
                Primero introduce una norma y pulsa "Generar resumen".
            </div>`;

        return;

    }

    if(!window.documentoCompleto){

        contenedor.innerHTML =
            `<div class="aviso-cuestionario">
                Para crear un cuestionario mas avanzado, pulsa primero "Generar documento completo".
            </div>`;

        return;

    }

    datosEvaluacion.documento =
        window.documentoCompleto;

    const preguntas =
        crearPreguntasCuestionario(
            datosEvaluacion
        );

    contenedor.innerHTML =
        construirHTMLCuestionario(
            preguntas
        );

    const formulario =
        document.getElementById("formCuestionario");

    formulario.addEventListener("submit", function(event){

        event.preventDefault();
        corregirCuestionario(preguntas);

    });

}

function crearPreguntasCuestionario(datos){

    const norma =
        datos.norma.trim();

    const documento =
        limpiarTexto(
            datos.documento || ""
        );

    const sentenciasDocumento =
        extraerSentenciasDocumento(
            documento
        );

    const terminosClave =
        extraerTerminosClave(
            documento,
            norma
        );

    const preguntasDocumento =
        crearPreguntasDesdeDocumento(
            sentenciasDocumento,
            terminosClave
        );

    if(preguntasDocumento.length >= 10){

        return preguntasDocumento
            .slice(0, 10)
            .map(pregunta =>
                mezclarOpciones(pregunta)
            );

    }

    const resumen =
        limpiarTexto(
            datos.resumen
        );

    const conceptos =
        extraerConceptosMermaid(
            datos.mermaid
        );

    const sentencias =
        resumen
            .split(/[.!?]\s+/)
            .map(texto => texto.trim())
            .filter(texto => texto.length > 35);

    const conceptoPrincipal =
        conceptos[1] || "sistema de gestion";

    const segundoConcepto =
        conceptos[2] || "requisitos principales";

    const tercerConcepto =
        conceptos[3] || "mejora continua";

    const cuartoConcepto =
        conceptos[4] || "auditoria";

    const quintoConcepto =
        conceptos[5] || "beneficios";

    const preguntasBase = [
        {
            enunciado:`Segun el resumen generado, cual es el tema central de ${norma}?`,
            opciones:[
                `La aplicacion de ${norma} en un sistema de gestion`,
                "La sustitucion completa de las auditorias internas",
                "La creacion de una campana publicitaria",
                "La eliminacion de todos los registros documentales"
            ],
            correcta:0,
            explicacion:`${norma} se estudia como una norma de gestion con requisitos, objetivos y beneficios.`
        },
        {
            enunciado:"Que elemento debe revisarse para entender la estructura de la norma?",
            opciones:[
                conceptoPrincipal,
                "El color corporativo de la organizacion",
                "El nombre comercial del producto",
                "La ubicacion fisica de las oficinas"
            ],
            correcta:0,
            explicacion:`El mapa conceptual destaca "${conceptoPrincipal}" como parte del contenido relevante.`
        },
        {
            enunciado:"Que idea aparece como contenido relevante para estudiar la norma?",
            opciones:[
                segundoConcepto,
                "Reducir la formacion del personal a cero",
                "Evitar la revision por la direccion",
                "Trabajar sin objetivos medibles"
            ],
            correcta:0,
            explicacion:`"${segundoConcepto}" forma parte del material generado para la norma.`
        },
        {
            enunciado:"Que enfoque es mas coherente con una norma de gestion?",
            opciones:[
                "Planificar, aplicar, evaluar y mejorar el sistema",
                "Actuar solo cuando exista una sancion",
                "Eliminar evidencias para simplificar el trabajo",
                "Delegar toda la responsabilidad fuera de la organizacion"
            ],
            correcta:0,
            explicacion:"Las normas de gestion se apoyan en control, seguimiento y mejora del sistema."
        },
        {
            enunciado:`En el contexto de ${norma}, que representa mejor un requisito principal?`,
            opciones:[
                "Una condicion que la organizacion debe cumplir y demostrar",
                "Una recomendacion estetica sin impacto operativo",
                "Una decision opcional sin necesidad de evidencias",
                "Un mensaje comercial para clientes"
            ],
            correcta:0,
            explicacion:"Los requisitos son condiciones verificables dentro del sistema de gestion."
        },
        {
            enunciado:"Que concepto del mapa conceptual se relaciona con la mejora del desempeno?",
            opciones:[
                tercerConcepto,
                "Improvisacion permanente",
                "Ausencia de seguimiento",
                "Trabajo sin indicadores"
            ],
            correcta:0,
            explicacion:`El mapa incluye "${tercerConcepto}" como punto de estudio.`
        },
        {
            enunciado:"Para comprobar si se cumple la norma, que actividad suele ser clave?",
            opciones:[
                cuartoConcepto,
                "Ignorar los resultados",
                "Cambiar la norma por opiniones personales",
                "Evitar la participacion del personal"
            ],
            correcta:0,
            explicacion:`"${cuartoConcepto}" aparece como concepto relacionado con la evaluacion del sistema.`
        },
        {
            enunciado:"Que tipo de beneficio se espera normalmente al aplicar una norma de gestion?",
            opciones:[
                quintoConcepto,
                "Menor control de los procesos",
                "Mas decisiones sin datos",
                "Desaparicion de responsabilidades"
            ],
            correcta:0,
            explicacion:`El contenido generado senala "${quintoConcepto}" como parte del aprendizaje.`
        },
        {
            enunciado:"Cual de estas opciones describe mejor el uso del resumen generado?",
            opciones:[
                "Sirve como base de estudio antes de profundizar en la norma completa",
                "Sustituye cualquier auditoria real",
                "Permite certificar una empresa automaticamente",
                "Evita consultar requisitos y evidencias"
            ],
            correcta:0,
            explicacion:"El resumen ayuda a estudiar, pero no sustituye el analisis completo ni una auditoria."
        },
        {
            enunciado:"Segun el contenido generado, que respuesta demuestra mejor aprendizaje?",
            opciones:[
                sentencias[0] || `Identificar el objetivo, requisitos, beneficios y apartados relevantes de ${norma}`,
                "Memorizar solo el nombre de la norma",
                "Responder sin relacionar conceptos",
                "Evitar conectar requisitos con procesos reales"
            ],
            correcta:0,
            explicacion:"La respuesta correcta recoge una idea real del resumen o sus puntos principales."
        }
    ];

    return preguntasBase.map(pregunta =>
        mezclarOpciones(pregunta)
    );

}

function crearPreguntasDesdeDocumento(sentencias, terminos){

    const preguntas = [];
    const usados = new Set();

    sentencias.forEach(sentencia => {

        if(preguntas.length >= 10){

            return;

        }

        const termino =
            terminos.find(candidato =>
                !usados.has(candidato.toLowerCase()) &&
                contieneTermino(sentencia, candidato)
            );

        if(!termino){

            return;

        }

        const distractores =
            terminos
                .filter(candidato =>
                    candidato.toLowerCase() !== termino.toLowerCase()
                )
                .slice(0, 18);

        if(distractores.length < 3){

            return;

        }

        usados.add(
            termino.toLowerCase()
        );

        preguntas.push({
            enunciado:
                `Completa la idea extraida del documento completo: "${ocultarTermino(sentencia, termino)}"`,
            opciones:[
                termino,
                distractores[0],
                distractores[1],
                distractores[2]
            ],
            correcta:0,
            explicacion:
                `En el documento completo aparece esta idea: "${sentencia}".`
        });

    });

    return preguntas;

}

function extraerSentenciasDocumento(texto){

    return texto
        .replace(/\n+/g, ". ")
        .split(/[.!?]\s+/)
        .map(sentencia =>
            limpiarTexto(sentencia)
        )
        .filter(sentencia =>
            sentencia.length >= 80 &&
            sentencia.length <= 260 &&
            sentencia.split(" ").length >= 10
        )
        .slice(0, 80);

}

function extraerTerminosClave(texto, norma){

    const palabrasVacias = new Set([
        "ademas",
        "aunque",
        "calidad",
        "capitulo",
        "completo",
        "contexto",
        "cuando",
        "cuenta",
        "cumplir",
        "dentro",
        "deben",
        "desde",
        "documento",
        "ejemplo",
        "entre",
        "forma",
        "frente",
        "gestion",
        "hacia",
        "incluye",
        "manera",
        "medioambiente",
        "mejor",
        "norma",
        "normas",
        "organizacion",
        "organizaciones",
        "parte",
        "permite",
        "puede",
        "pueden",
        "requiere",
        "sistema",
        "sobre",
        "tambien",
        "tener",
        "todos",
        "traves"
    ]);

    norma
        .toLowerCase()
        .split(/\s+/)
        .forEach(palabra =>
            palabrasVacias.add(
                palabra
            )
        );

    const conteo = {};

    texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .match(/\b[a-z0-9]{7,}\b/g)
        ?.forEach(palabra => {

            if(palabrasVacias.has(palabra)){

                return;

            }

            conteo[palabra] =
                (conteo[palabra] || 0) + 1;

        });

    return Object.entries(conteo)
        .sort((a, b) =>
            b[1] - a[1] || b[0].length - a[0].length
        )
        .map(([palabra]) =>
            palabra
        )
        .slice(0, 30);

}

function contieneTermino(sentencia, termino){

    const expresion =
        new RegExp(
            `\\b${escaparRegExp(termino)}\\b`,
            "i"
        );

    return expresion.test(
        sentencia.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );

}

function ocultarTermino(sentencia, termino){

    const expresion =
        new RegExp(
            `\\b${escaparRegExp(termino)}\\b`,
            "i"
        );

    return sentencia
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(expresion, "____");

}

function construirHTMLCuestionario(preguntas){

    const preguntasHTML =
        preguntas.map((pregunta, indice) => {

            const opcionesHTML =
                pregunta.opciones.map((opcion, opcionIndice) =>
                    `<label class="opcion-test">
                        <input type="radio" name="pregunta-${indice}" value="${opcionIndice}">
                        <span>${escapeHTML(opcion)}</span>
                    </label>`
                ).join("");

            return `
                <fieldset class="pregunta-test">
                    <legend>${indice + 1}. ${escapeHTML(pregunta.enunciado)}</legend>
                    ${opcionesHTML}
                </fieldset>
            `;

        }).join("");

    return `
        <form id="formCuestionario" class="cuestionario">
            ${preguntasHTML}
            <button type="submit" class="btn-evaluacion">
                Corregir cuestionario
            </button>
        </form>
        <div id="resultadoCuestionario"></div>
    `;

}

function corregirCuestionario(preguntas){

    const resultado =
        document.getElementById("resultadoCuestionario");

    const respuestas =
        preguntas.map((pregunta, indice) => {

            const marcada =
                document.querySelector(
                    `input[name="pregunta-${indice}"]:checked`
                );

            return marcada ? Number(marcada.value) : null;

        });

    if(respuestas.includes(null)){

        resultado.innerHTML =
            `<div class="aviso-cuestionario">
                Responde las 10 preguntas antes de corregir.
            </div>`;

        return;

    }

    const aciertos =
        respuestas.filter((respuesta, indice) =>
            respuesta === preguntas[indice].correcta
        ).length;

    const detalle =
        preguntas.map((pregunta, indice) => {

            const acertada =
                respuestas[indice] === pregunta.correcta;

            return `
                <div class="respuesta-correcta ${acertada ? "acierto" : "fallo"}">
                    <strong>${indice + 1}. ${acertada ? "Correcta" : "Incorrecta"}</strong>
                    <p>Respuesta correcta: ${escapeHTML(pregunta.opciones[pregunta.correcta])}</p>
                    <p>${escapeHTML(pregunta.explicacion)}</p>
                </div>
            `;

        }).join("");

    resultado.innerHTML =
        `<div class="resultado-test">
            <h3>Resultado: ${aciertos}/10</h3>
            <p>${obtenerMensajeResultado(aciertos)}</p>
        </div>
        <div class="soluciones-test">
            <h3>Respuestas correctas</h3>
            ${detalle}
        </div>`;

}

function obtenerMensajeResultado(aciertos){

    if(aciertos >= 8){

        return "Muy buen dominio del contenido generado.";

    }

    if(aciertos >= 5){

        return "Buen avance. Revisa las respuestas marcadas para reforzar conceptos.";

    }

    return "Conviene repasar el resumen y el mapa conceptual antes de repetir el test.";

}

function extraerConceptosMermaid(mermaid){

    const coincidencias =
        [...mermaid.matchAll(/\[([^\]]+)\]/g)]
            .map(coincidencia =>
                limpiarTexto(coincidencia[1])
            )
            .filter(Boolean);

    return [...new Set(coincidencias)]
        .filter(texto => texto.length > 2)
        .slice(0, 12);

}

function mezclarOpciones(pregunta){

    const opciones =
        pregunta.opciones.map((opcion, indice) => ({
            texto: opcion,
            original: indice
        }));

    for(let i = opciones.length - 1; i > 0; i--){

        const j =
            Math.floor(Math.random() * (i + 1));

        [opciones[i], opciones[j]] =
            [opciones[j], opciones[i]];

    }

    return {
        enunciado: pregunta.enunciado,
        opciones: opciones.map(opcion => opcion.texto),
        correcta: opciones.findIndex(opcion =>
            opcion.original === pregunta.correcta
        ),
        explicacion: pregunta.explicacion
    };

}

function limpiarTexto(texto){

    return texto
        .replace(/\s+/g, " ")
        .trim();

}

function escaparRegExp(texto){

    return String(texto)
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

}

function escapeHTML(texto){

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
