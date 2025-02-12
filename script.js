const textInput = document.getElementById('text');
const output = document.getElementById('output');
const ajustSpacing = document.getElementById('container2');
const originalText = document.getElementById('original');
const adjustedText = document.getElementById('adjusted');
const textSize = document.getElementById('textSize');
const letterSpacingMap = {};

function updateOutput() {
  output.innerHTML = '';
  ajustSpacing.innerHTML = '';

  const letters = new Set(textInput.value);
  const chars = [...textInput.value];

  chars.forEach((char, index) => {
    const span = document.createElement('span');
    span.classList.add('letter');
    span.textContent = char;
    span.setAttribute('data-letter', char);
    span.style.letterSpacing = '-3px';//modificação no espaço das letras
    span.style.marginLeft = `${letterSpacingMap[char]?.left || 0}px`;
    span.style.marginRight = `${letterSpacingMap[char]?.right || 0}px`;
    output.appendChild(span)
  });
  letters.forEach((char) => {
    createajustSpacing(char);
  });

}

function createajustSpacing(char) {
  const controlDiv = document.createElement('div');
  controlDiv.classList.add('control');
  controlDiv.innerHTML = `
    <strong class= "text-xl">${char}</strong>
    <div class= "gap-2" >
        <label class= "font-medium">LSB: 
          <input class="px-2 rounded-lg" type="number" id="SBL" min="-55" max="70" data-letter="${char}" data-side="left" value="${letterSpacingMap[char]?.leftRaw || 0}" />
        </label>
        <label class= "font-medium">RSB: 
          <input class= "px-2 rounded-lg" type="number" id="SBR" min="-55" max="70" data-letter="${char}" data-side="right" value="${letterSpacingMap[char]?.rightRaw || 0}" />
        </label>  
    </div>  
  `;

  ajustSpacing.appendChild(controlDiv);

  controlDiv.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateSpacing);
  });
}

function convertPixelsToUPM(UPMvalue, fontSize, baseUPM = 1000) {
  const result= UPMvalue * (fontSize / baseUPM);
  console.log(`Convertendo UPM para pixels: UPM = ${UPMvalue}, Font Size = ${fontSize}, Resultado = ${result}px`);
  return result;
}


function updateSpacing(event) {
  const letter = event.target.getAttribute('data-letter');
  const side = event.target.getAttribute('data-side');
  const rawValue = parseInt(event.target.value, 10) || 0; // Valor real do usuário, tem que mudar aquiiiii
  
  const fontSize = parseInt(textSize.value, 10);

  const convertedValue = convertPixelsToUPM(rawValue, fontSize); // Conversão interna

  if (!letterSpacingMap[letter]) {
    letterSpacingMap[letter] = { left: 0, right: 0, leftRaw: 0, rightRaw: 0 };
  }

  // Armazena tanto o valor real quanto o convertido
  letterSpacingMap[letter][side] = convertedValue;
  letterSpacingMap[letter][`${side}Raw`] = rawValue;

  output.querySelectorAll(`span[data-letter="${letter}"]`).forEach(span => {
    if (side === 'left') {
      span.style.marginLeft = `${convertedValue}px`;
    } else if (side === 'right') {
      span.style.marginRight = `${convertedValue}px`;
    }
  });
}
textInput.addEventListener('input', updateOutput);

function generateText(letters) {


  const loremBase = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit adipiscing elit adipiscing elit.';

  return loremBase.replace(/[a-zA-Z]/g, () => letters[Math.floor(Math.random() * letters.length)]);
}

function updateAdjustedText(letters) {
  const loremText = generateText(letters);

  adjustedText.innerHTML = loremText
    .split('') 
    .map(char => {
      
      const spacing = letterSpacingMap[char] || { left: 0, right: 0 };
     
      const fontSize = parseInt(textSize.value, 10);

      // Converter os valores de espaçamento para UPM
      const marginLeft = convertPixelsToUPM(spacing.left, fontSize);
      const marginRight = convertPixelsToUPM(spacing.right, fontSize);
     
      return `<span style="margin-left: ${spacing.left}px; margin-right: ${spacing.right}px;">${char}</span>`;
    })
    .join('');
}

function updateTexts(letters) {

  const loremText = generateText(letters);

  originalText.textContent = loremText;

  adjustedText.innerHTML = loremText;

  updateAdjustedText(letters);
}

/*function enableZoom(className) {
  let scale = 1;
  const zoomableDivs = document.querySelectorAll(`.${className}`);

  if (zoomableDivs.length === 0) {
      console.error(`Nenhum elemento com a classe "${className}" encontrado.`);
      return;
  }

  zoomableDivs.forEach(zoomableDiv => {
      zoomableDiv.style.transformOrigin = "center";

      // Zoom com CTRL + Scroll dentro da div
      zoomableDiv.addEventListener("wheel", (event) => {
          if (event.ctrlKey) { 
              event.preventDefault(); 
              scale += event.deltaY * -0.05;
              scale = Math.min(Math.max(0.5, scale), 30);
              zoomableDiv.style.transform = `scale(${scale})`;
          }
      }, { passive: false });

      // Suporte para gesto de pinça (apenas dentro da div)
      let touchStartDist = 0;

      zoomableDiv.addEventListener("touchstart", (event) => {
          if (event.touches.length === 2) { 
              touchStartDist = Math.hypot(
                  event.touches[0].clientX - event.touches[1].clientX,
                  event.touches[0].clientY - event.touches[1].clientY
              );
          }
      });

      zoomableDiv.addEventListener("touchmove", (event) => {
          if (event.touches.length === 2) { 
              event.preventDefault(); 
              let touchEndDist = Math.hypot(
                  event.touches[0].clientX - event.touches[1].clientX,
                  event.touches[0].clientY - event.touches[1].clientY
              );

              let zoomFactor = touchEndDist / touchStartDist;
              scale = Math.min(Math.max(0.5, scale * zoomFactor), 30);
              zoomableDiv.style.transform = `scale(${scale})`;
              touchStartDist = touchEndDist; 
          }
      }, { passive: false });
  });
}


enableZoom("zoomoutput");*/



document.addEventListener('input', (e) => {
  if (e.target.tagName === 'INPUT' && e.target.dataset.letter) {
    const letter = e.target.dataset.letter;
    const side = e.target.dataset.side;
    const value = parseInt(e.target.value, 10);


    if (!letterSpacingMap[letter]) {
      letterSpacingMap[letter] = { left: 0, right: 0 };
    }
    letterSpacingMap[letter][side] = value;


    updateAdjustedText(textInput.value);
  }
});

textInput.addEventListener('input', (e) => {
  const inputText = e.target.value;
  const uniqueLetters = [...new Set(inputText)];


  uniqueLetters.forEach(letter => {
    if (!letterSpacingMap[letter]) {
      letterSpacingMap[letter] = { left: 0, right: 0 };
    }
  });


  updateTexts(inputText);
});

textSize.addEventListener("input", function(){
  const size = textSize.value;

  output.style.fontSize =  `${size}px`;
})