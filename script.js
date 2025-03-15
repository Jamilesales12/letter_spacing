// Elementos principais
const textInput = document.getElementById('text');
const output = document.getElementById('output');
const ajustSpacing = document.getElementById('container2');
const originalText = document.getElementById('original');
const adjustedText = document.getElementById('adjusted');
const textSize = document.getElementById('textSize');
const fontSelect = document.getElementById("fontSelect");
const letterSpacingMap = {};

let loadedFontName = "";

// Atualiza o output conforme o usuário digita
function updateOutput() {
    output.innerHTML = '';
    ajustSpacing.innerHTML = '';

    const letters = new Set(textInput.value);
    const chars = [...textInput.value];

    chars.forEach((char) => {
        const span = document.createElement('span');
        span.classList.add('letter');
        span.textContent = char;
        span.setAttribute('data-letter', char);
        span.style.marginLeft = `${letterSpacingMap[char]?.left || 0}px`;
        span.style.marginRight = `${letterSpacingMap[char]?.right || 0}px`;

        // Aplica a fonte carregada
        if (loadedFontName) {
            span.style.fontFamily = `"${loadedFontName}"`;
        }

        output.appendChild(span);
    });

    letters.forEach((char) => {
        createajustSpacing(char);
    });
}

// Cria inputs para controle do espaçamento de cada letra
function createajustSpacing(char) {
    if (document.querySelector(`[data-control="${char}"]`)) return;

    const controlDiv = document.createElement('div');
    controlDiv.classList.add('control');
    controlDiv.setAttribute('data-control', char);
    controlDiv.innerHTML = `
        <strong class="text-xl">${char}</strong>
        <div class="gap-2">
            <label class="font-medium">LSB:
                <input class="px-2 rounded-lg" type="number" min="-55" max="70" data-letter="${char}" data-side="left" value="${letterSpacingMap[char]?.leftRaw || 0}" />
            </label>
            <label class="font-medium">RSB:
                <input class="px-2 rounded-lg" type="number" min="-55" max="70" data-letter="${char}" data-side="right" value="${letterSpacingMap[char]?.rightRaw || 0}" />
            </label>
        </div>
    `;

    ajustSpacing.appendChild(controlDiv);

    controlDiv.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updateSpacing);
    });
}

// Converte UPM para pixels
function convertPixelsToUPM(UPMvalue, fontSize, baseUPM = 1000) {
    return UPMvalue * (fontSize / baseUPM);
}

// Atualiza espaçamento
function updateSpacing(event) {
    const letter = event.target.getAttribute('data-letter');
    const side = event.target.getAttribute('data-side');
    const rawValue = parseInt(event.target.value, 10) || 0;
    const fontSize = parseInt(textSize.value, 10);
    const convertedValue = convertPixelsToUPM(rawValue, fontSize);

    if (!letterSpacingMap[letter]) {
        letterSpacingMap[letter] = { left: 0, right: 0, leftRaw: 0, rightRaw: 0 };
    }

    letterSpacingMap[letter][side] = convertedValue;
    letterSpacingMap[letter][`${side}Raw`] = rawValue;

    output.querySelectorAll(`span[data-letter="${letter}"]`).forEach(span => {
        span.style.marginLeft = `${letterSpacingMap[letter].left}px`;
        span.style.marginRight = `${letterSpacingMap[letter].right}px`;
    });
}

// Carrega e aplica a fonte personalizada
function loadFontFromFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const fontDataUrl = e.target.result;
        
        // Criando um nome único para evitar conflitos
        loadedFontName = `customFont-${Date.now()}`;
        const font = new FontFace(loadedFontName, `url(${fontDataUrl})`, { display: 'swap' });

        font.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
            console.log(`Fonte "${loadedFontName}" carregada e aplicada.`);

            // Aplica a fonte e garante que o texto será atualizado em tempo real
            applyFontToOutput();
        }).catch(function(error) {
            console.error("Erro ao carregar a fonte: ", error);
        });
    };
    reader.readAsDataURL(file);
}

// Aplica a fonte carregada ao output
function applyFontToOutput() {
    if (!loadedFontName) {
        console.error("Nenhuma fonte foi carregada.");
        return;
    }

    output.style.fontFamily = `"${loadedFontName}"`;
    updateOutput();
}

// Manipula a seleção do arquivo de fonte
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        loadFontFromFile(file);
    }
}

// Evento para carregar a fonte ao selecionar um arquivo
fontSelect.addEventListener("change", handleFileSelect);

// Atualiza o tamanho do texto no output
textSize.addEventListener("input", () => {
    output.style.fontSize = `${textSize.value}px`;
});

// Atualiza espaçamentos ao interagir com os inputs
document.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT' && e.target.dataset.letter) {
        updateSpacing(e);
        updateOutput(); // Garante que os espaçamentos sejam aplicados corretamente
    }
});

// Atualiza o texto em tempo real ao digitar
textInput.addEventListener("input", updateOutput);

// Função para atualizar o zoom da div de output sem afetar o espaçamento da fonte// Função para atualizar o zoom dentro da div output sem afetar o resto da interface
function updateZoom() {
    const scaleValue = textSize.value / 20; // Ajusta o fator de zoom
    output.style.transform = `scale(${scaleValue})`;
    output.style.transformOrigin = "center"; // Mantém o zoom centralizado
}

// Evento que chama a função quando o usuário ajusta o range
textSize.addEventListener("input", updateZoom);