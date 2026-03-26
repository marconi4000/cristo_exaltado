document.addEventListener('DOMContentLoaded', () => {
  const synth = window.speechSynthesis;
  const botaoLer = document.getElementById('lerBtn');
  const botaoPausar = document.getElementById('pausarBtn');
  const botaoMais = document.getElementById('velMais');
  const botaoMenos = document.getElementById('velMenos');
  const velocidadeInfo = document.getElementById('velocidadeInfo');

  let rateAtual = 1.0;
  let textoCompleto = document.querySelector('article')?.innerText || "";
  let caractereAtual = 0; // Guardamos a posição exata do caractere
  let falando = false;

  function atualizarVelocidadeNaTela() {
    velocidadeInfo.textContent = `Velocidade atual: ${rateAtual.toFixed(1)}x`;
  }

  function falar() {
    synth.cancel(); 

    // Extrai o texto exatamente de onde parou até o fim
    const textoParaFalar = textoCompleto.substring(caractereAtual);
    if (!textoParaFalar.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textoParaFalar);
    utterance.lang = 'pt-BR';
    utterance.rate = rateAtual;

    // EVENTO CHAVE: Atualiza a posição a cada palavra processada
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Somamos a posição global com a posição relativa da fala atual
        caractereAtual += event.charIndex;
        // Reiniciamos o charIndex relativo para a próxima medição não acumular errado
        caractereAtual -= event.charIndex; 
        // Correção robusta:
        const progressoRelativo = event.charIndex;
        // Armazenamos onde estamos no texto principal
        window.ultimaPosicao = caractereAtual + progressoRelativo;
      }
    };

    utterance.onend = () => {
      if (!synth.paused) {
        falando = false;
        window.ultimaPosicao = 0; 
      }
    };

    falando = true;
    synth.speak(utterance);
  }

  botaoLer?.addEventListener('click', () => {
    window.ultimaPosicao = 0;
    caractereAtual = 0;
    falar();
  });

  botaoPausar?.addEventListener('click', () => {
    if (synth.speaking) {
      if (synth.paused) {
        synth.resume();
        botaoPausar.textContent = '⏸️ Pausar';
      } else {
        synth.pause();
        botaoPausar.textContent = '▶️ Retomar';
      }
    }
  });

  botaoMais?.addEventListener('click', () => {
    if (rateAtual < 2.0) {
      rateAtual += 0.2;
      atualizarVelocidadeNaTela();
      if (synth.speaking && !synth.paused) {
        caractereAtual = window.ultimaPosicao || 0;
        falar(); 
      }
    }
  });

  botaoMenos?.addEventListener('click', () => {
    if (rateAtual > 0.4) {
      rateAtual -= 0.2;
      atualizarVelocidadeNaTela();
      if (synth.speaking && !synth.paused) {
        caractereAtual = window.ultimaPosicao || 0;
        falar();
      }
    }
  });

  atualizarVelocidadeNaTela();
});


// Aumenta e diminui o tamanho da fonte do texto de estudo

/* document.addEventListener('DOMContentLoaded', () => {
    const btnAumentar = document.getElementById('fonteMais');
    const btnDiminuir = document.getElementById('fonteMenos');
    const areaTexto = document.getElementById('textoEstudo');

    function ajustarFonte(valor) {
        if (!areaTexto) {
            console.error("Atenção Marconi: O ID 'textoEstudo' não foi encontrado no HTML.");
            return;
        }

        // Seleciona TUDO: h1, h2, h3, p, li, e até o strong (números dos versículos)
        const elementos = areaTexto.querySelectorAll('h1, h2, h3, p, li, strong, span');

        elementos.forEach(el => {
            const estilo = window.getComputedStyle(el).getPropertyValue('font-size');
            const tamanhoAtual = parseFloat(estilo);
            
            // Aplica o novo tamanho
            el.style.fontSize = (tamanhoAtual + valor) + 'px';
        });
    }

    // Vincula as funções aos botões
    btnAumentar?.addEventListener('click', () => ajustarFonte(2));
    btnDiminuir?.addEventListener('click', () => ajustarFonte(-2));
});

*/

document.addEventListener('DOMContentLoaded', () => {
    const btnAumentar = document.getElementById('fonteMais');
    const btnDiminuir = document.getElementById('fonteMenos');
    const areaTexto = document.getElementById('textoEstudo');

    function ajustarFonte(valor) {
        if (!areaTexto) {
            console.error("Atenção Marconi: O ID 'textoEstudo' não foi encontrado no HTML.");
            return;
        }

        // AGORA INCLUI 'a' (âncoras/links) na lista de seleção
        const elementos = areaTexto.querySelectorAll('h1, h2, h3, p, li, strong, span, a');

        elementos.forEach(el => {
            const estilo = window.getComputedStyle(el).getPropertyValue('font-size');
            const tamanhoAtual = parseFloat(estilo);
            
            // Aplica o novo tamanho
            el.style.fontSize = (tamanhoAtual + valor) + 'px';
        });
    }

    // Vincula as funções aos botões
    btnAumentar?.addEventListener('click', () => ajustarFonte(2));
    btnDiminuir?.addEventListener('click', () => ajustarFonte(-2));
});