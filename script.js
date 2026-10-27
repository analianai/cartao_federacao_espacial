const form = document.getElementById('formCartao');
const nome = document.getElementById('nome');
const idade = document.getElementById('idade');
const jogo = document.getElementById('jogo');
const foto = document.getElementById('foto');
const textoNome = document.getElementById('textoNome');
const textoIdade = document.getElementById('textoIdade');
const textoJogo = document.getElementById('textoJogo');
const fotoPreview = document.getElementById('fotoPreview');
const fotoJanela = document.querySelector('.foto-janela');
const cartao = document.getElementById('cartao');
const pdfBtn = document.getElementById('pdfBtn');
const limparBtn = document.getElementById('limparBtn');
const instalarBtn = document.getElementById('instalarBtn');

let fotoAtual = '';
let promptInstalacao = null;

function atualizarCartao() {
  textoNome.textContent = nome.value.trim();
  textoIdade.textContent = idade.value.trim();
  textoJogo.textContent = jogo.value.trim();
}

[nome, idade, jogo].forEach(campo => campo.addEventListener('input', atualizarCartao));

foto.addEventListener('change', () => {
  const arquivo = foto.files && foto.files[0];
  if (!arquivo) {
    fotoAtual = '';
    fotoPreview.removeAttribute('src');
    fotoJanela.classList.remove('com-foto');
    return;
  }
  if (!arquivo.type.startsWith('image/')) {
    alert('Selecione um arquivo de imagem.');
    foto.value = '';
    return;
  }
  const leitor = new FileReader();
  leitor.onload = evento => {
    fotoAtual = evento.target.result;
    fotoPreview.src = fotoAtual;
    fotoJanela.classList.add('com-foto');
  };
  leitor.readAsDataURL(arquivo);
});

form.addEventListener('submit', evento => {
  evento.preventDefault();
  atualizarCartao();
  cartao.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

pdfBtn.addEventListener('click', () => {
  atualizarCartao();
  if (!nome.value.trim() || !idade.value.trim() || !jogo.value.trim()) {
    alert('Preencha o nome, a idade e o jogo favorito antes de imprimir.');
    return;
  }
  window.print();
});

limparBtn.addEventListener('click', () => {
  if (!confirm('Deseja apagar os dados preenchidos e a foto?')) return;
  form.reset();
  fotoAtual = '';
  fotoPreview.removeAttribute('src');
  fotoJanela.classList.remove('com-foto');
  atualizarCartao();
});

window.addEventListener('beforeinstallprompt', evento => {
  evento.preventDefault();
  promptInstalacao = evento;
  instalarBtn.classList.remove('escondido');
});
instalarBtn.addEventListener('click', async () => {
  if (!promptInstalacao) return;
  promptInstalacao.prompt();
  await promptInstalacao.userChoice;
  promptInstalacao = null;
  instalarBtn.classList.add('escondido');
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
atualizarCartao();
