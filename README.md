# ARG — template

Cada resposta vira o nome do arquivo da próxima fase (`SHA-256(SALT + resposta)`, 16 caracteres).
Nenhuma resposta fica no código.

```
index.html              fase 0 (página inicial)
fases/<hash>.html       uma página por fase
css/style.css           visual compartilhado
js/arg.js               validação + progresso salvo + dica extra após 3 erros
ferramentas/gerar-hash.js
```

## Criar uma fase nova

1. `node ferramentas/gerar-hash.js "resposta da fase anterior"` → mostra o nome do arquivo.
2. Copie uma fase existente com esse nome e troque a dica, o enigma e a `dica-extra`.
3. Repita.

As respostas são normalizadas: maiúsculas, acentos, espaços e pontuação são ignorados
(`"Júpiter!"` = `"jupiter"`).

**Antes de publicar, apague os comentários `<!-- ... Resposta: ... -->` das páginas** (estão lá só como referência).

## Hospedar

- Vercel ou GitHub Pages (precisa de HTTPS por causa do `crypto.subtle`).
- Deixe o **repositório privado**, senão a lista de arquivos entrega as fases.
- Pra testar localmente: `npx serve .` ou `python -m http.server` (abrir direto via `file://` não valida certo).

## Fases

| Fase | Arquivo | Enigma | Resposta | Letra escondida |
|---|---|---|---|---|
| 1 — O primeiro registro | `index.html` | Coordenadas `41.8902, 12.4922` (Google Maps) | coliseu | P — no friso do topo do Coliseu, entre a 4ª e a 5ª janelinha |
| 2 — O homem do calendário | `fases/eece46eda6f69849.html` | Cifra de César: `YLQFL` (voltar 3) | vinci | E — no lacre de cera, abaixo do SPQR |
| 3 — A escrita do avesso | `fases/2e1c149d4cafd7ba.html` | Escrita espelhada (canvas): "Onde dorme a mulher que sorri há mais de 500 anos?" | louvre | R — rótulo do esboço de engrenagens no canto da folha |
| 4 — O vizinho que nunca existiu | `fases/d2e779cabe4b70c3.html` | Endereço montado por pistas: Baker (padeiro) Street + 22 (camisa do Bellingham aposentada pelo Birmingham City) + 1 ("Hey Jude" nas paradas do Reino Unido) + B (Beatles) = 221B Baker Street → Street View | sherlock | S — dentro da lente da lupa, no canto da ficha (só com zoom) |
| 5 — A máquina | `fases/c763df2c79d49651.html` | Pesquisar a Enigma e entender o que ela fazia. A página tem uma Enigma funcionando (rotores I-II-III, refletor B): o que ele digitar sai embaralhado | criptografia | I — a lâmpada "I" do painel fica sempre levemente acesa |
| 6 — A mansão sem nome | `fases/9225802037107162.html` | Busca reversa da foto da estátua do Turing (`img/arquivo-0417.jpg`) ou Wikipedia da Enigma. Tarjas do dossiê têm o tamanho das palavras (NOME 4+6, LOCAL 9+4) | bletchley (aceita "bletchley park"; "turing"/"alan turing" recebem aviso de quase) | S — dentro da tarja do campo CÓDIGO (aparece ao selecionar) |
| 7 — O verso da página | `fases/6ef8deb69e09484b.html` | Comentário HTML escondido dentro da página do diário (Ctrl+U / Inspecionar). O botão "virar a página" é pegadinha: "Não é esse verso." | turing (aceita "alan turing" e "teste de turing") | T — marca d'água bem clarinha no papel da página |
| 8 — Pontos e traços | `fases/8385dd81e5b56eb4.html` | Áudio em Código Morse (`audio/transmissao.wav`). Ao tocar, a lâmpada pisca e a fita de papel marca os pontos e traços. A chave do telégrafo faz bip quando apertada | telefone | I — gravado na plaquinha de latão da chave do telégrafo |
| 9 — O imperador curioso | `fases/025ac7679c70bfeb.html` | Metadados (EXIF) da foto `img/arquivo-1862.jpg`: autor "D. Pedro II", comentário ("quando o Rio fica quente demais, eu subo a serra") e GPS do Museu Imperial (-22.50814, -43.17522). Ver em botão direito → Propriedades → Detalhes, depois jogar o GPS no Google Maps | petropolis (aceita "palácio de petrópolis"; "museu imperial", "palácio imperial", "rio"/"rio de janeiro" e "dom pedro ii" recebem aviso de quase) | R — carimbo seco (em relevo) no canto inferior direito da foto |

Variações e "quase": um `<script type="application/json" id="arg-extra">` na fase com `apelidos` (hash da variação → hash da resposta certa) e `quase` (hash → mensagem). Use `gerar-hash.js` e pegue só o nome do arquivo, sem `.html`.

Dicas extras: qualquer `<p class="dica-extra" data-erros="N" hidden>` aparece após N erros (padrão 3); dá pra ter várias por fase.

Cada fase pode ter um tema próprio em `css/temas/<tema>.css` (a página carrega `style.css` + o tema e põe `class="tema-<tema>"` no `<body>`).
