const textInput = document.getElementById('text');
const output = document.getElementById('output');
const ajustSpacing = document.getElementById('container2');
const letterSpacingMap = {};

function updateOutput(){
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

function createajustSpacing(char){
    const controlDiv = document.createElement('div');
    controlDiv.classList.add('control');
    controlDiv.innerHTML =  `
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

