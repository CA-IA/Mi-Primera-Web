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

                /*
                DOCUMENTO
                */

                pdf.setTextColor(0);

                pdf.setFontSize(12);

                const lineas =
                    pdf.splitTextToSize(
                        window.documentoCompleto,
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

    boton.innerHTML =
        "✅ Documento generado";

    document.getElementById("pdfContainer")
        .style.display = "block";
}