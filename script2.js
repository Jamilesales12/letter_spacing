// Elementos principais
const textInput = document.getElementById('text2');
const fontSelectOrigin = document.getElementById("fontSelectOrigin");
const fontSelectZero = document.getElementById("fontSelectZero");
const fontOrigin = document.getElementById("fontOrigin");
const fontZero = document.getElementById("fontZero");
const ajustSpacing = document.getElementById('container2');

let loadedFontOrigin = ""; 
let loadedFontZero = "";  

const letterSpacingMap = {};  

function updateOutput() {
    fontOrigin.innerHTML = '';  
    fontZero.innerHTML = '';  
    ajustSpacing.innerHTML = '';  

    const text = textInput.value;

    fontOrigin.innerHTML = text;

    [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('letter');
        span.setAttribute('data-letter', char);
        span.setAttribute('data-index', index);
        span.style.marginLeft = `${letterSpacingMap[char]?.left || 0}px`; 
        span.style.marginRight = `${letterSpacingMap[char]?.right || 0}px`; 

        if (loadedFontZero) {
            span.style.fontFamily = `"${loadedFontZero}"`;
        } else {
            span.style.fontFamily = "sans-serif";  
        }

        fontZero.appendChild(span);  
    });

    createAjustSpacingForEachLetter(text);  
}

function createAjustSpacingForEachLetter(text) {
    const letters = new Set(text); 

 
    letters.forEach((char) => {
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
    });
}


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


    fontZero.querySelectorAll(`span[data-letter="${letter}"]`).forEach(span => {
        span.style.marginLeft = `${letterSpacingMap[letter].left}px`; 
        span.style.marginRight = `${letterSpacingMap[letter].right}px`;  
    });
}


function convertPixelsToUPM(UPMvalue, fontSize, baseUPM = 1000) {
    return UPMvalue * (fontSize / baseUPM);
}


function loadFontFromFile(file, isFontZero) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const fontDataUrl = e.target.result;
        
    
        const fontName = `customFont-${Date.now()}`;
        const font = new FontFace(fontName, `url(${fontDataUrl})`, { display: 'swap' });

        font.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);  
            console.log(`Fonte "${fontName}" carregada e aplicada.`);
            
            if (isFontZero) {
                loadedFontZero = fontName; 
            } else {
                loadedFontOrigin = fontName;  
            }
            
           
            updateOutput();  
        }).catch(function(error) {
            console.error("Erro ao carregar a fonte: ", error);
        });
    };
    reader.readAsDataURL(file); 
}


function handleFileSelect(event, isFontZero) {
    const file = event.target.files[0];
    if (file) {
        loadFontFromFile(file, isFontZero); 
    }
}


fontSelectOrigin.addEventListener("change", (e) => handleFileSelect(e, false));


fontSelectZero.addEventListener("change", (e) => handleFileSelect(e, true));


textInput.addEventListener("input", updateOutput);
