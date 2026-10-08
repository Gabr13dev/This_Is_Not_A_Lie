// Uso: node ferramentas/gerar-hash.js "resposta"
// Mostra o nome do arquivo da fase para a qual essa resposta leva.
// O SALT e a normalização PRECISAM ser iguais aos de js/arg.js.
const crypto = require("crypto");
const SALT = "arg-sobrinho-v1:";

const normalizar = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

const respostas = process.argv.slice(2);
if (!respostas.length) {
  console.log('Uso: node ferramentas/gerar-hash.js "resposta" ["outra resposta" ...]');
  process.exit(1);
}
for (const r of respostas) {
  const h = crypto.createHash("sha256").update(SALT + normalizar(r)).digest("hex").slice(0, 16);
  console.log(`${r}  ->  fases/${h}.html`);
}
