
/*
    DADOS DOS MASCOTES

    É importante manter os mesmos números
    utilizados no script.js da urna.
*/

const mascotes = {

    "67": {

        nome: "Órion",

        descricao:
            "A águia que enxerga longe: visão estratégica, curiosidade e vontade de ir além.",

        imagem: "imagens/Aguia.png"

    },

    "13": {

        nome: "Cleo",

        descricao:
            "O axolote que se regenera e se adapta: aprender é se reinventar.",

        imagem: "imagens/Axolote.png"

    },

    "22": {

        nome: "Dawin",

        descricao:
            "O lobo que combina instinto, estratégia e espírito de equipe.",

        imagem: "imagens/Lobo.png"

    },

    "10": {

        nome: "Newton",

        descricao:
            "Curioso por natureza: observa, questiona e busca explicar o mundo.",

        imagem: "imagens/Techugo.png"

    },

    "17": {

        nome: "Otto",

        descricao:
            "O polvo inteligente e adaptável, que resolve vários desafios ao mesmo tempo.",

        imagem: "imagens/Polvo.png"

    },

    "12": {

        nome: "Zuzu",

        descricao:
            "O louva-a-deus que observa com atenção e age com precisão.",

        imagem: "imagens/Louva Deus.png"

    }

};


/*
    CARREGAR VOTOS
*/

function carregarVotos() {

    const votosSalvos = JSON.parse(
        localStorage.getItem("votosMascote")
    ) || {};


    const votos = {};


    Object.keys(mascotes).forEach(numero => {

        votos[numero] = Number(votosSalvos[numero]) || 0;

    });


    votos.branco = Number(votosSalvos.branco) || 0;

    votos.nulo = Number(votosSalvos.nulo) || 0;


    return votos;

}


/*
    ATUALIZAR APURAÇÃO
*/

function atualizarApuracao() {

    const votos = carregarVotos();


    /*
        CALCULA TOTAL
    */

    let total = 0;

    Object.values(votos).forEach(valor => {

        total += valor;

    });


    /*
        CALCULA VOTOS VÁLIDOS
    */

    let validos = 0;

    Object.keys(mascotes).forEach(numero => {

        validos += votos[numero] || 0;

    });


    /*
        ATUALIZA RESUMO
    */

    document.getElementById("totalVotos")
        .textContent = total;

    document.getElementById("votosValidos")
        .textContent = validos;

    document.getElementById("votosBrancos")
        .textContent = votos.branco;

    document.getElementById("votosNulos")
        .textContent = votos.nulo;


    /*
        DESCOBRE O VENCEDOR
    */

    let vencedor = null;

    let maiorNumeroVotos = -1;


    Object.keys(mascotes).forEach(numero => {

        const quantidade =
            votos[numero] || 0;


        if (quantidade > maiorNumeroVotos) {

            maiorNumeroVotos = quantidade;

            vencedor = numero;

        }

    });


    /*
        MOSTRA VENCEDOR
    */

    if (
        vencedor &&
        maiorNumeroVotos > 0
    ) {

        const mascote =
            mascotes[vencedor];


        document.getElementById("nomeVencedor")
            .textContent =
            mascote.nome;


        document.getElementById("descricaoVencedor")
            .textContent =
            mascote.descricao;


        const percentual =
            validos > 0
                ? (maiorNumeroVotos / validos) * 100
                : 0;


        document.getElementById("percentualVencedor")
            .textContent =
            percentual.toFixed(1) + "%";

    }

    else {

        document.getElementById("nomeVencedor")
            .textContent =
            "Aguardando votação";

        document.getElementById("descricaoVencedor")
            .textContent =
            "Ainda não há votos registrados.";

        document.getElementById("percentualVencedor")
            .textContent =
            "0%";

    }


    /*
        CRIA LISTA DE RESULTADOS
    */

    const lista =
        document.getElementById("listaResultados");


    lista.innerHTML = "";


    Object.keys(mascotes).forEach(numero => {

        const mascote =
            mascotes[numero];


        const quantidade =
            votos[numero] || 0;


        const percentual =
            validos > 0
                ? (quantidade / validos) * 100
                : 0;


        const resultado =
            document.createElement("div");


        resultado.className =
            "resultado";


        resultado.innerHTML = 

            `<div class="resultado-topo">

                <div class="info-mascote">

                    <img
                        src="${mascote.imagem}"
                        alt="${mascote.nome}">

                    <div>

                        <h3>
                            ${numero} -
                            ${mascote.nome}
                        </h3>

                        <span>
                            ${mascote.descricao}
                        </span>

                    </div>

                </div>

                <div class="votos">

                    ${quantidade} voto(s)

                </div>

            </div>


            <div class="barra">

                <div
                    class="barra-preenchida"
                    style="width:${percentual}%">

                </div>

            </div>


            <div class="porcentagem">

                ${percentual.toFixed(1)}%

            </div>

        `;


        lista.appendChild(resultado);

    });

}


/*
    EXPORTAR RESULTADO
*/

function exportarResultado() {

    const votos =
        carregarVotos();


    let texto =
        "RESULTADO DA ELEIÇÃO DO MASCOTE\n";

    texto +=
        "====================================\n\n";


    Object.keys(mascotes).forEach(numero => {

        texto +=
            numero +
            " - " +
            mascotes[numero].nome +
            ": " +
            (votos[numero] || 0) +
            " voto(s)\n";

    });


    texto += "\n";

    texto +=
        "Votos em branco: " +
        votos.branco +
        "\n";

    texto +=
        "Votos nulos: " +
        votos.nulo +
        "\n";


    const total =
        Object.values(votos)
            .reduce(
                (total, valor) =>
                    total + valor,
                0
            );


    texto +=
        "Total de votos: " +
        total +
        "\n";


    /*
        CRIA ARQUIVO
    */

    const arquivo =
        new Blob(
            [texto],
            {
                type:
                    "text/plain;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(arquivo);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "resultado-eleicao-mascote.txt";


    link.click();


    URL.revokeObjectURL(url);

}


/*
    ZERAR VOTAÇÃO
*/

function zerarVotacao() {

    abrirModal(
        "Zerar votação",
        "Tem certeza que deseja apagar todos os votos? Esta ação não poderá ser desfeita."
    );


    document.getElementById(
        "btnConfirmarModal"
    ).onclick = function () {

        const votosZerados = {

            "67": 0,
            "13": 0,
            "22": 0,
            "10": 0,
            "17": 0,
            "12": 0,

            branco: 0,
            nulo: 0

        };


        localStorage.setItem(
            "votosMascote",
            JSON.stringify(votosZerados)
        );


        fecharModal();

        atualizarApuracao();

        alert(
            "A votação foi zerada."
        );

    };

}


/*
    MODAL
*/

function abrirModal(titulo, texto) {

    document.getElementById(
        "modalTitulo"
    ).textContent = titulo;


    document.getElementById(
        "modalTexto"
    ).textContent = texto;


    document.getElementById(
        "modal"
    ).style.display = "flex";

}


function fecharModal() {

    document.getElementById(
        "modal"
    ).style.display = "none";

}


/*
    ATUALIZA AUTOMATICAMENTE
    A CADA 3 SEGUNDOS
*/

atualizarApuracao();


setInterval(
    atualizarApuracao,
    3000
);

