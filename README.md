# Treyce Game node Engine

# para o clone da versao 2 digite no terminal/cmd
git clone -b trayce-GN-Engine-v1.2 https://github.com/aceleradox/Traicy-GN-Engine.git


# adaptada para o Defold Engine

Este projeto foi adaptado para funcionar como uma base simples para GitHub Pages, testes rápidos em navegador e futura integração com Defold.

## Guia geral
- Abra o arquivo game.html para rodar o jogo no navegador.
- Use a pasta js para controlar a lógica do jogo.
- Use a pasta resource para trocar sprites, mapas, cenas, sons e efeitos.
- Use a pasta css para alterar a aparência visual.
- Use a pasta data para guardar configurações externas.
- Cada pasta desta estrutura agora conta com um arquivo manual.txt com instruções básicas de uso.

## Estrutura do projeto

### Arquivos principais
- game.html: arquivo principal para abrir no navegador. Ele carrega o HTML, os estilos e os arquivos JavaScript do jogo.
- css/style.css: define a aparência da interface, HUD, botões, overlay e responsividade.
- js/main.js: contém o loop principal do jogo, entradas do teclado/tela, física, colisões, HUD e renderização.
- js/game-data.js: guarda os dados do jogo, como jogador, plataformas, inimigos, moedas, nuvens e física inicial.
- abacato.js: helper JavaScript para carregar arquivos JSON e texto e resolver caminhos de assets.
- build.sh: script de compilação para gerar versões desktop, Android, Web, Poki e backend.
- package.json: define os comandos npm para rodar os builds.
- compiler.yml: descrição em YAML dos targets e arquivos incluídos no processo de compilação.
- criar-backend.yml: configuração básica para o backend opcional.
- defold-project.json: arquivo de integração para o fluxo do Defold.
- github-structure.yml: estrutura de pastas recomendada para publicação no GitHub.
- sub-script.json: configuração central do projeto com referências para sprites, mapas e cenas.
- sub-script-vibe-code.yml: configuração para edição geral de sprites, mapas, cenas, sons, effects e colormod.
- sub-sprite-vibe-code.yml: configuração específica para criação e edição de sprites.
- sub-sound-vibe-code.yml: configuração específica para criação e edição de sons.
- sub-maps-vibe-code.yml: configuração específica para edição de mapas.
- sub-scene-vibe-code.yml: configuração específica para edição de cenas.
- sub-grapix-vibe-code.yml: configuração específica para efeitos visuais e colormod.
- manual.txt: guia geral do projeto.

### Pastas
- css/: guarda os estilos do projeto.
- data/: armazena arquivos de configuração em JSON e YAML.
- js/: contém a lógica e os dados do jogo.
- resource/: reúne assets e recursos visuais e sonoros do projeto.

## Explicação arquivo por arquivo

### [game.html](game.html)
Arquivo de entrada principal da aplicação web. Ele monta a interface do jogo, inclui o canvas, a HUD, os botões de controle e carrega os scripts necessários.

### [css/style.css](css/style.css)
Define o visual completo da página, incluindo fundo, painel do jogo, botões, overlay de vitória/derrota e ajustes para telas menores.

### [js/main.js](js/main.js)
Responsável por toda a lógica em tempo de execução: inicialização do jogo, controle de entrada, movimento do jogador, gravidade, detecção de colisão, coleta de moedas, interação com inimigos, reinício do jogo e desenho no canvas.

### [js/game-data.js](js/game-data.js)
Contém os dados base do jogo, como a posição inicial do player, as plataformas, inimigos, moedas e nuvens. É o lugar ideal para ajustar o mapa e o balanceamento inicial.

### [abacato.js](abacato.js)
Arquivo utilitário que oferece funções para carregar arquivos JSON e texto, resolver caminhos e preparar o carregamento de assets do projeto.

### [build.sh](build.sh)
Script shell usado para gerar builds para diferentes alvos. Ele copia os arquivos necessários para a pasta dist e cria versões para desktop, Android, Web, Poki e backend.

### [package.json](package.json)
Define os comandos npm usados para chamar os builds de forma simples.

### [compiler.yml](compiler.yml)
Arquivo de configuração do compilador que lista os targets e os arquivos a serem incluídos em cada build.

### [criar-backend.yml](criar-backend.yml)
Descrição do backend opcional para o projeto, com instruções de estrutura e dependências básicas.

### [defold-project.json](defold-project.json)
Arquivo de integração para o Defold, facilitando a importação ou organização do projeto nessa engine.

### [github-structure.yml](github-structure.yml)
Define a estrutura recomendada de pastas e arquivos para publicação no GitHub.

### [sub-script.json](sub-script.json)
Arquivo central de configuração que referencia os principais elementos do projeto, como sprites, mapas e cenas.

### [sub-script-vibe-code.yml](sub-script-vibe-code.yml)
Arquivo de configuração para edição geral do projeto com foco em sprites, mapas, cenas, sons, efeitos e colormod.

### [sub-sprite-vibe-code.yml](sub-sprite-vibe-code.yml)
Configuração específica para criação e edição de sprites.

### [sub-sound-vibe-code.yml](sub-sound-vibe-code.yml)
Configuração específica para criação e edição de sons.

### [sub-maps-vibe-code.yml](sub-maps-vibe-code.yml)
Configuração específica para edição de mapas.

### [sub-scene-vibe-code.yml](sub-scene-vibe-code.yml)
Configuração específica para edição de cenas.

### [sub-grapix-vibe-code.yml](sub-grapix-vibe-code.yml)
Configuração específica para efeitos visuais e colormod.

### [data/game-config.json](data/game-config.json)
Arquivo de configuração geral em formato JSON.

### [data/game-config.yml](data/game-config.yml)
Arquivo de configuração geral em formato YAML.

### [resource/sprites/player.json](resource/sprites/player.json)
Define o sprite principal do jogador.

### [resource/sprites/sprite-editor-config.json](resource/sprites/sprite-editor-config.json)
Configuração visual usada para editar sprites.

### [resource/sprites/img/README.txt](resource/sprites/img/README.txt)
Explica o uso da pasta de imagens do sprite.

### [resource/maps/level-1.json](resource/maps/level-1.json)
Arquivo do mapa inicial do jogo.

### [resource/maps/map-editor-config.json](resource/maps/map-editor-config.json)
Configuração do editor de mapas.

### [resource/maps/visual-map-template.json](resource/maps/visual-map-template.json)
Modelo visual para criar novos mapas.

### [resource/scenes/main.json](resource/scenes/main.json)
Arquivo da cena principal do projeto.

### [resource/scenes/scene-editor-config.json](resource/scenes/scene-editor-config.json)
Configuração visual do editor de cenas.

### [resource/sounds/README.txt](resource/sounds/README.txt)
Arquivo explicativo para a pasta de sons.

### [resource/effects/dust.json](resource/effects/dust.json)
Arquivo de exemplo de efeito visual.

### [resource/effects/README.txt](resource/effects/README.txt)
Explica como usar a pasta de efeitos.

### [resource/colormod/default.json](resource/colormod/default.json)
Arquivo de configuração inicial para filtros de cor.

### [resource/colormod/README.txt](resource/colormod/README.txt)
Explica a função da pasta de colormod.

## Como editar
- Para mudar plataformas, moedas, inimigos e nuvens, edite [js/game-data.js](js/game-data.js) ou os arquivos em [data/](data/).
- Para alterar a lógica do jogo, edite [js/main.js](js/main.js).
- Para ajustar sprites, mapas e cenas, edite os arquivos em [resource/](resource/) e [sub-script.json](sub-script.json).
- Para mudar a aparência, edite [css/style.css](css/style.css).

## Abrir o jogo
Abra o arquivo [game.html](game.html) em qualquer navegador.

## Compilador básico
- [compiler.yml](compiler.yml): define targets e arquivos incluídos para builds de desktop, Android, Web, Poki e backend.
- [build.sh](build.sh): script simples que copia os arquivos necessários para dist/<target>.
- [package.json](package.json): scripts de build npm para facilitar a compilação.
- Build de web e poki cria também index.html no destino.
- Build de abacato compila o backend com os arquivos de configuração e modos Vibe Code.

### Como usar
- sh build.sh desktop
- sh build.sh android
- sh build.sh web
- sh build.sh poki
- sh build.sh abacato

ou via npm:
- npm run build:desktop
- npm run build:android
- npm run build:web
- npm run build:poki
- npm run build:abacato

## GitHub
Esta estrutura já está pronta para publicar em GitHub Pages usando o arquivo [game.html](game.html) como página principal.
