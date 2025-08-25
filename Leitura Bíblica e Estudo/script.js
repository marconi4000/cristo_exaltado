document.addEventListener('DOMContentLoaded', () => {
  const botaoLer = document.getElementById('lerBtn');
  const botaoPausar = document.getElementById('pausarBtn');
  const botaoMais = document.getElementById('velMais');
  const botaoMenos = document.getElementById('velMenos');
  const velocidadeInfo = document.getElementById('velocidadeInfo');

  let rateAtual = 1;
  let textoAtual = document.querySelector('main')?.innerText || '';
  let isReading = false;

  function atualizarVelocidadeNaTela() {
    velocidadeInfo.textContent = `Velocidade atual: ${rateAtual.toFixed(1)}x`;
  }

  function lerTexto() {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(textoAtual);
    utterance.lang = 'pt-BR';
    utterance.rate = rateAtual;

    isReading = true;
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      isReading = false;
    };
  }

  botaoLer?.addEventListener('click', () => {
    lerTexto();
  });

  /*
  botaoPausar?.addEventListener('click', () => {
    const synth = window.speechSynthesis;

    if (synth.speaking && !synth.paused) {
      synth.pause();
      botaoPausar.textContent = '▶️ Retomar';
    } else if (synth.paused) {
      synth.resume();
      botaoPausar.textContent = '⏸️ Pausar';
    }
  });
*/

  botaoMais?.addEventListener('click', () => {
    if (rateAtual < 2) {
      rateAtual = Math.min(rateAtual + 0.2, 2);
      atualizarVelocidadeNaTela();
      if (isReading) {
        lerTexto(); // reinicia com nova velocidade
      }
    }
  });

  botaoMenos?.addEventListener('click', () => {
    if (rateAtual > 0.4) {
      rateAtual = Math.max(rateAtual - 0.2, 0.4);
      atualizarVelocidadeNaTela();
      if (isReading) {
        lerTexto(); // reinicia com nova velocidade
      }
    }
  });

  atualizarVelocidadeNaTela(); // mostra valor inicial
});
