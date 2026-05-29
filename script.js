async function generarResumen(){

    const norma =
        document.getElementById("normaInput").value;

    const resumenTexto =
        document.getElementById("resumenTexto");

    const mapaConceptual =
        document.getElementById("mapaConceptual");

    if(norma === ""){

        resumenTexto.innerHTML =
            "Introduce una norma.";

        return;
    }

    resumenTexto.innerHTML =
        "Generando resumen con IA...";

    mapaConceptual.innerHTML = "";

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

        const texto = datos.resultado;

        const partes = texto.split("MAPA:");

        resumenTexto.innerHTML =
            partes[0].replace("RESUMEN:", "");

        mapaConceptual.innerHTML =
            partes[1];

    }

    catch(error){

        resumenTexto.innerHTML =
            "Error conectando con IA.";

        console.error(error);

    }

}