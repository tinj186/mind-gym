export const getUniqueOptions = (ans, dists) => Array.from(new Set([ans, ...dists])).slice(0, 4).sort(() => 0.5 - Math.random());

export const getArticle = (word) => /^[aeiou]/i.test(word) ? 'an' : 'a';

export const getAdditionAlgoHtml = (v1Str, v2Str, sumStr) => {
  const len = Math.max(v1Str.length, v2Str.length, sumStr.length);
  const v1 = v1Str.padStart(len, ' ');
  const v2 = v2Str.padStart(len, ' ');
  const sum = sumStr.padStart(len, ' ');

  let carryHtml = '';
  let carry = 0;
  
  for (let i = len - 1; i >= 0; i--) {
    if (v1[i] === '.') {
      carryHtml = `<span style="display:inline-block; width:1.5ch;">&nbsp;</span>` + carryHtml;
      continue;
    }
    
    const d1 = v1[i] === ' ' ? 0 : parseInt(v1[i]);
    const d2 = v2[i] === ' ' ? 0 : parseInt(v2[i]);
    
    if (carry > 0) {
      carryHtml = `<span style="display:inline-block; width:1.5ch; text-align:center; color:#ef4444; font-size:0.75em; font-weight:bold; transform: translateY(0.25em);">${carry}</span>` + carryHtml;
    } else {
      carryHtml = `<span style="display:inline-block; width:1.5ch;">&nbsp;</span>` + carryHtml;
    }
    
    const total = d1 + d2 + carry;
    carry = Math.floor(total / 10);
  }

  const wrapDigits = (str) => {
    return str.split('').map(c => `<span style="display:inline-block; width:1.5ch; text-align:center;">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  };

  return `<div style="font-family: monospace; text-align: right; width: fit-content; margin: 0 auto; font-size: 1.2rem; display: flex; flex-direction: column; align-items: flex-end; padding-top: 1rem;">
    <div style="display:flex;">&nbsp;&nbsp;&nbsp;&nbsp;${carryHtml}</div>
    <div style="display:flex;">&nbsp;&nbsp;$&nbsp;${wrapDigits(v1)}</div>
    <div style="display:flex;">+&nbsp;$&nbsp;${wrapDigits(v2)}</div>
    <hr style="border-top: 2px solid black; margin: 4px 0; width: 100%;" />
    <div style="display:flex;">&nbsp;&nbsp;$&nbsp;${wrapDigits(sum)}</div>
  </div>`;
};

export const getRenamingHtml = (minuend, subtrahend, difference) => {
  const v1Str = typeof minuend === 'number' ? minuend.toFixed(2) : minuend;
  const v2Str = typeof subtrahend === 'number' ? subtrahend.toFixed(2) : subtrahend;
  const diffStr = typeof difference === 'number' ? difference.toFixed(2) : difference;
  
  const len = Math.max(v1Str.length, v2Str.length, diffStr.length);
  const v1 = v1Str.padStart(len, ' ').split('');
  const v2 = v2Str.padStart(len, ' ').split('');
  const diff = diffStr.padStart(len, ' ').split('');
  
  let borrows = Array(len).fill(null);
  let crosses = Array(len).fill(false);
  let currentV1 = [...v1];
  
  for (let i = len - 1; i >= 0; i--) {
    if (v1[i] === '.' || v1[i] === ' ') continue;
    
    let d1 = parseInt(currentV1[i]);
    let d2 = v2[i] === ' ' ? 0 : parseInt(v2[i]);
    
    if (d1 < d2) {
      let borrowIdx = i - 1;
      while (borrowIdx >= 0 && (v1[borrowIdx] === '.' || v1[borrowIdx] === ' ' || parseInt(currentV1[borrowIdx]) === 0)) {
        borrowIdx--;
      }
      
      if (borrowIdx >= 0) {
        crosses[borrowIdx] = true;
        let borrowedVal = parseInt(currentV1[borrowIdx]) - 1;
        borrows[borrowIdx] = borrowedVal.toString();
        currentV1[borrowIdx] = borrowedVal.toString();
        
        for (let j = borrowIdx + 1; j < i; j++) {
          if (v1[j] !== '.' && v1[j] !== ' ') {
            crosses[j] = true;
            borrows[j] = '9';
            currentV1[j] = '9';
          }
        }
        
        crosses[i] = true;
        borrows[i] = (d1 + 10).toString();
        currentV1[i] = (d1 + 10).toString();
      }
    }
  }

  const wrapMinuend = () => {
    let html = '';
    for (let i = 0; i < len; i++) {
      let char = v1[i];
      if (char === ' ') {
        html += `<span style="display:inline-block; width:1.5ch;">&nbsp;</span>`;
      } else if (char === '.') {
        html += `<span style="display:inline-block; width:1.5ch; text-align:center;">.</span>`;
      } else {
        if (crosses[i]) {
          html += `<span style="display:inline-block; width:1.5ch; text-align:center; position:relative;"><span style="position:absolute; bottom:80%; left:50%; transform:translateX(-50%); color:#ef4444; font-size:0.75em; font-weight:bold;">${borrows[i]}</span><del style="color:#94a3b8; text-decoration-thickness:2px;">${char}</del></span>`;
        } else {
          html += `<span style="display:inline-block; width:1.5ch; text-align:center;">${char}</span>`;
        }
      }
    }
    return html;
  };
  
  const wrapDigits = (str) => {
    return str.split('').map(c => `<span style="display:inline-block; width:1.5ch; text-align:center;">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  };

  return `<div style="font-family: monospace; text-align: right; width: fit-content; margin: 0 auto; font-size: 1.2rem; display: flex; flex-direction: column; align-items: flex-end; padding-top: 1.5rem;">
    <div style="display:flex;">&nbsp;&nbsp;$&nbsp;${wrapMinuend()}</div>
    <div style="display:flex;">-&nbsp;$&nbsp;${wrapDigits(v2.join(''))}</div>
    <hr style="border-top: 2px solid black; margin: 4px 0; width: 100%;" />
    <div style="display:flex;">&nbsp;&nbsp;$&nbsp;${wrapDigits(diff.join(''))}</div>
  </div>`;
};
