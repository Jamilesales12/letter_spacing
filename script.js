const textInput = document.getElementById('text');
const output = document.getElementById('output');
const ajustSpacing = document.getElementById('container2');
const originalText = document.getElementById('original');
const adjustedText = document.getElementById('adjusted');
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
    span.style.letterSpacing = '-1';//modificação no espaço das letras
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
          <strong>${char}</strong>
          <label>LSB: <input type="range" id="SBL"  min="-55" max="70" data-letter="${char}" data-side="left" value="${letterSpacingMap[char]?.left || 0}" /></label>
          <label>RSB: <input type="range" id="SBR" min="-55" max="70" data-letter="${char}" data-side="right" value="${letterSpacingMap[char]?.right || 0}" /></label>    
    `;


  ajustSpacing.appendChild(controlDiv);


  controlDiv.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateSpacing);
  });
}

function updateSpacing(event) {
  const letter = event.target.getAttribute('data-letter')
  const side = event.target.getAttribute('data-side');
  const value = parseInt(event.target.value, 10);

  if (!letterSpacingMap[letter]) {
    letterSpacingMap[letter] = { left: 0, right: 0 };
  }
  letterSpacingMap[letter][side] = value;

  output.querySelectorAll(`span[data-letter="${letter}"]`).forEach(span => {
    if (side === 'left') {
      span.style.marginLeft = `${value}px`;
    } else if (side === 'right') {
      span.style.marginRight = `${value}px`;
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
      return `<span style="margin-left: ${spacing.left}px; margin-right: ${spacing.right}px;">${char}</span>`;
    })
    .join('');
}
function updateTexts(letters) {

  const loremText = generateText(letters);

  originalText.textContent = loremText;

  adjustedText.innerHTML = loremText

  updateAdjustedText(letters);
}

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