/*
    DADOS DOS MASCOTES
*/

const mascotes = {

    "67": {

        nome: "Órion",

        categoria: "Inteligência e Tecnologia",

        imagem: "imagens/Órion.JPG",

        descricao:
            "Órion é a águia que enxerga longe: representa visão estratégica, curiosidade e a vontade de ir além.",

        motivo:
            "Representa nossa escola porque nos ensina a olhar para o futuro com coragem e a usar a tecnologia para transformar ideias em conquistas."
    },


    "13": {

        nome: "Cleo",

        categoria: "Natureza e Tecnologia",

        imagem: "imagens/CLEO.JPG",

        descricao:
            "Cleo é o axolote, animal que se regenera e se adapta a novos ambientes com facilidade.",

        motivo:
            "Representa nossa escola porque mostra que aprender é se reinventar: unimos respeito à natureza e inovação para crescer todos os dias."
    },


    "22": {

        nome: "Darwin",

        categoria: "Natureza e Tecnologia",

        imagem: "imagens/DARWIN.JPG",

        descricao:
            "Dawrin é o lobo que combina instinto, estratégia e espírito de equipe para superar desafios.",

        motivo:
            "Representa nossa escola porque a evolução do conhecimento acontece quando trabalhamos juntos e aprendemos com a natureza."
    },


    "10": {

        nome: "Newton",

        categoria: "Inteligência e Tecnologia",

        imagem: "imagens/NEWTON.JPG",

        descricao:
            "Newton é curioso por natureza: observa, questiona e busca explicar o mundo ao seu redor.",

        motivo:
            "Representa nossa escola porque a ciência e a tecnologia nascem da curiosidade e da vontade de descobrir como tudo funciona."
    },


    "17": {

        nome: "Otto",

        categoria: "Inteligência e Tecnologia",

        imagem: "imagens/OTTO.JPG",

        descricao:
            "Otto é o polvo: inteligente, adaptável e capaz de resolver vários desafios ao mesmo tempo.",

        motivo:
            "Representa nossa escola porque nos ensina a pensar com flexibilidade, cooperar e encontrar soluções criativas para cada problema."
    },


    "12": {

        nome: "Zuzu",

        categoria: "Natureza e Tecnologia",

        imagem: "imagens/ZUZU.JPG",

        descricao:
            "Zuzu é o louva-a-deus: observa com atenção e age com precisão no momento certo.",

        motivo:
            "Representa nossa escola porque equilibrar natureza e tecnologia exige paciência, foco e precisão em cada escolha."
    }

};


/*
    SONS

    Os sons são gerados pelo navegador
    com a Web Audio API, sem arquivos externos.
*/

let contextoAudio = null;


function obterContextoAudio() {

    const Contexto =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!Contexto) {

        return null;

    }

    if (!contextoAudio) {

        contextoAudio = new Contexto();

    }

    if (contextoAudio.state === "suspended") {

        contextoAudio.resume();

    }

    return contextoAudio;

}


function tocarTom(frequencia, atraso, duracao, tipo, volume) {

    const contexto = obterContextoAudio();

    if (!contexto) {

        return;

    }

    const inicio = contexto.currentTime + atraso;

    const oscilador = contexto.createOscillator();

    const ganho = contexto.createGain();


    oscilador.type = tipo || "triangle";

    oscilador.frequency.setValueAtTime(frequencia, inicio);


    ganho.gain.setValueAtTime(0.0001, inicio);

    ganho.gain.exponentialRampToValueAtTime(
        volume || 0.12,
        inicio + 0.01
    );

    ganho.gain.exponentialRampToValueAtTime(
        0.0001,
        inicio + duracao
    );


    oscilador.connect(ganho);

    ganho.connect(contexto.destination);


    oscilador.start(inicio);

    oscilador.stop(inicio + duracao + 0.02);

}


/*
    SOM AO CLICAR NUMA TECLA
*/

function tocarTecla() {

    tocarTom(1000, 0, 0.05, "square", 0.09);

}


/*
    SOM AO CONFIRMAR O VOTO
*/

function tocarConfirmacao() {

    const duracaoNota = 0.09;
  const intervalo = 0.10;
  const vol = 0.09;

  tocarTom(1396.9, intervalo * 0, duracaoNota, "square", vol); // Fá 6 (F6)
  tocarTom(1760.0, intervalo * 1, duracaoNota, "square", vol); // Lá 6 (A6)
  tocarTom(1396.9, intervalo * 2, duracaoNota, "square", vol); // Fá 6 (F6)
  tocarTom(1760.0, intervalo * 3, 0.35,        "square", vol); //

}


/*
    SOM DE ERRO
*/

function tocarErro() {

    tocarTom(196, 0, 0.16, "sawtooth", 0.09);

    tocarTom(147, 0.16, 0.22, "sawtooth", 0.09);
    tocarTom(220, 0, 0.25, "sawtooth", 0.2);

}


/*
    CONTROLE DA VOTAÇÃO
*/

let numeroDigitado = "";


/*
    VOTOS

    Os resultados ficam armazenados
    no navegador utilizando localStorage.
*/

const votosIniciais = {

    "67": 0,
    "13": 0,
    "22": 0,
    "10": 0,
    "17": 0,
    "12": 0,

    branco: 0,
    nulo: 0

};


/*
    Carrega apenas as chaves dos mascotes atuais,
    ignorando votos de eleições anteriores.
*/

const votosSalvos = JSON.parse(
    localStorage.getItem("votosMascote")
) || {};

let votos = {};

Object.keys(votosIniciais).forEach(chave => {

    votos[chave] = Number(votosSalvos[chave]) || 0;

});


/*
    DIGITAR NÚMERO
*/

function digitar(numero) {

    // Impede mais de dois números

    if (numeroDigitado.length >= 2) {

        return;

    }


    tocarTecla();


    numeroDigitado += numero;


    // Mostra o número na tela

    if (numeroDigitado.length === 1) {

        document.getElementById("n1").value = numero;

    }

    else {

        document.getElementById("n2").value = numero;

    }


    // Quando completar dois números

    if (numeroDigitado.length === 2) {

        mostrarMascote();

    }

}


/*
    MOSTRAR MASCOTE
*/

function mostrarMascote() {

    const mascote = mascotes[numeroDigitado];


    // MASCOTE EXISTE

    if (mascote) {

        document.getElementById("nomeMascote").textContent =
            mascote.nome;

        document.getElementById("categoriaMascote").textContent =
            mascote.categoria;

        document.getElementById("descricaoMascote").textContent =
            mascote.descricao;

        document.getElementById("motivoMascote").textContent =
            mascote.motivo;

        document.getElementById("fotoMascote").src =
            mascote.imagem;

        document.getElementById("numeroExibido").textContent =
            "Número " + numeroDigitado;

    }


    // NÚMERO INVÁLIDO

    else {

        document.getElementById("nomeMascote").textContent =
            "VOTO NULO";

        document.getElementById("categoriaMascote").textContent =
            "";

        document.getElementById("descricaoMascote").textContent =
            "O número digitado não corresponde a nenhum mascote.";

        document.getElementById("motivoMascote").textContent =
            "";

        document.getElementById("fotoMascote").src =
            "imagens/branco.jpg";

        document.getElementById("numeroExibido").textContent =
            "Número inválido";

    }

}


/*
    CORRIGIR
*/

function corrigir(tocarSom = true) {

    if (tocarSom) {

        tocarTecla();

    }


    numeroDigitado = "";


    document.getElementById("n1").value = "";

    document.getElementById("n2").value = "";


    document.getElementById("nomeMascote").textContent =
        "Aguardando voto...";

    document.getElementById("categoriaMascote").textContent =
        "";

    document.getElementById("descricaoMascote").textContent =
        "Digite o número de um mascote para conhecer sua proposta.";

    document.getElementById("motivoMascote").textContent =
        "";

    document.getElementById("fotoMascote").src =
        "imagens/branco.jpg";

    document.getElementById("numeroExibido").textContent =
        "Mascote";

}


/*
    VOTO EM BRANCO
*/

function branco() {

    votos.branco++;

    salvarVotos();

    tocarConfirmacao();

    mostrarMensagem(
        "Voto em branco",
        "Seu voto em branco foi registrado."
    );

}


/*
    CONFIRMAR VOTO
*/

function confirmar() {

    // Nenhum número digitado

    if (numeroDigitado === "") {

        tocarErro();

        mostrarMensagem(
            "Atenção",
            "Digite o número de um mascote ou escolha BRANCO."
        );

        return;

    }


    // VOTO VÁLIDO

    if (mascotes[numeroDigitado]) {

        votos[numeroDigitado]++;

        salvarVotos();

        tocarConfirmacao();

        mostrarMensagem(
            "Voto confirmado!",
            "Seu voto para " +
            mascotes[numeroDigitado].nome +
            " foi registrado com sucesso."
        );

    }


    // VOTO NULO

    else {

        votos.nulo++;

        salvarVotos();

        tocarErro();

        mostrarMensagem(
            "Voto nulo",
            "O número digitado não corresponde a nenhum mascote."
        );

    }

}


/*
    SALVAR VOTOS
*/

function salvarVotos() {

    localStorage.setItem(
        "votosMascote",
        JSON.stringify(votos)
    );

}


/*
    MOSTRAR MENSAGEM
*/

function mostrarMensagem(titulo, texto) {

    document.getElementById("tituloMensagem")
        .textContent = titulo;

    document.getElementById("textoMensagem")
        .textContent = texto;

    document.getElementById("mensagem")
        .style.display = "flex";

}


/*
    FECHAR MENSAGEM
*/

function fecharMensagem() {

    document.getElementById("mensagem")
        .style.display = "none";


    corrigir(false);

}