/*
 * Motor do ARG — validação 100% no navegador, sem guardar respostas.
 *
 * Como funciona:
 *   resposta digitada -> normaliza -> SHA-256(SALT + resposta) -> 16 primeiros caracteres
 *   -> tenta abrir fases/<hash>.html. Se o arquivo existe, avança. Se não, "errado".
 *
 * Nenhuma resposta aparece no código. Para criar uma fase nova, gere o nome
 * do arquivo com: node ferramentas/gerar-hash.js "resposta"
 */
(function () {
  // Mude o SALT se quiser, mas aí precisa regerar o nome de TODAS as fases.
  const SALT = "arg-sobrinho-v1:";
  const TENTATIVAS_PARA_DICA = 3;

  // Pasta das fases, calculada a partir do local deste script (funciona em qualquer página).
  const SCRIPT_URL = document.currentScript.src;
  const PASTA_FASES = new URL("../fases/", SCRIPT_URL);
  const INICIO = new URL("../index.html", SCRIPT_URL);

  function normalizar(texto) {
    return texto
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // tira acentos
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ""); // tira espaços e pontuação
  }

  async function hash(texto) {
    const dados = new TextEncoder().encode(SALT + texto);
    const buffer = await crypto.subtle.digest("SHA-256", dados);
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 16);
  }

  async function paginaExiste(url) {
    try {
      const r = await fetch(url, { method: "HEAD", cache: "no-store" });
      return r.ok;
    } catch {
      return null; // não deu pra checar (ex.: abrindo via file://)
    }
  }

  function lerExtra() {
    const el = document.getElementById("arg-extra");
    if (!el) return {};
    try { return JSON.parse(el.textContent); } catch { return {}; }
  }

  function salvarProgresso(url) {
    try { localStorage.setItem("arg-progresso", url); } catch {}
  }
  function lerProgresso() {
    try { return localStorage.getItem("arg-progresso"); } catch { return null; }
  }

  // Efeito de "digitação" nos elementos com .digitar
  function efeitoDigitacao() {
    document.querySelectorAll(".digitar").forEach((el) => {
      const texto = el.textContent;
      el.textContent = "";
      el.style.visibility = "visible";
      let i = 0;
      const t = setInterval(() => {
        el.textContent += texto[i++];
        if (i >= texto.length) clearInterval(t);
      }, 35);
    });
  }

  function iniciar() {
    efeitoDigitacao();

    // Marca a fase atual como progresso (exceto a página inicial, marcada com data-inicio)
    if (document.body.dataset.fase && !("inicio" in document.body.dataset)) {
      salvarProgresso(location.href);
    }

    // Botão "continuar de onde parou" na página inicial
    const continuar = document.getElementById("continuar");
    const salvo = lerProgresso();
    if (continuar && salvo) {
      continuar.hidden = false;
      continuar.addEventListener("click", () => (location.href = salvo));
    }

    const form = document.getElementById("form-resposta");
    if (!form) return;
    const input = form.querySelector("input");
    const msg = document.getElementById("mensagem");
    // Dicas extras: qualquer .dica-extra; data-erros="N" define após quantos erros aparece (padrão 3)
    const dicasExtras = document.querySelectorAll(".dica-extra");
    let erros = 0;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const resposta = normalizar(input.value);
      if (!resposta) return;

      msg.className = "mensagem";
      msg.textContent = "verificando...";

      let h = await hash(resposta);

      // Extras por fase (opcional): <script type="application/json" id="arg-extra">
      //   { "apelidos": { "<hash variação>": "<hash resposta certa>" },
      //     "quase":    { "<hash resposta>": "mensagem de quase" } }
      // Só hashes, então nada entrega a resposta.
      const extra = lerExtra();
      if (extra.quase && extra.quase[h]) {
        msg.className = "mensagem quase";
        msg.textContent = extra.quase[h];
        input.select();
        return;
      }
      if (extra.apelidos && extra.apelidos[h]) h = extra.apelidos[h];

      const url = new URL(h + ".html", PASTA_FASES);
      const existe = await paginaExiste(url);

      if (existe === false) {
        erros++;
        msg.className = "mensagem erro";
        msg.textContent = ["Não é isso.", "Errado.", "Tente de novo.", "Hmm... não."][erros % 4];
        input.select();
        document.body.classList.remove("tremer");
        void document.body.offsetWidth;
        document.body.classList.add("tremer");
        dicasExtras.forEach((d) => {
          if (erros >= Number(d.dataset.erros || TENTATIVAS_PARA_DICA)) d.hidden = false;
        });
        return;
      }

      msg.className = "mensagem certo";
      msg.textContent = "acesso liberado.";
      setTimeout(() => (location.href = url), 600);
    });
  }

  window.ARG = { inicio: INICIO.href };
  document.addEventListener("DOMContentLoaded", iniciar);
})();
