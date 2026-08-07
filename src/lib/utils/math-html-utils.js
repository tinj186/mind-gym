export function generateAlgorithmTables(num1, num2, isAdd, num3 = null) {
  const hasNum3 = num3 !== null && num3 !== undefined;
  const ans = isAdd ? num1 + num2 + (hasNum3 ? num3 : 0) : num1 - num2;
  
  // Pad strings to 4 digits for alignment
  const s1 = num1.toString().padStart(4, ' ');
  const s2 = num2.toString().padStart(4, ' ');
  const s3 = hasNum3 ? num3.toString().padStart(4, ' ') : null;
  const sAns = ans.toString().padStart(4, ' ');

  let step1 = `
<table class="table-fixed text-right font-mono mx-auto w-32 text-sm">
  <tr><td></td> <td>${s1[0].trim()}</td> <td>${s1[1].trim()}</td> <td>${s1[2].trim()}</td> <td>${s1[3].trim()}</td></tr>
${hasNum3 ? `  <tr><td></td> <td>${s2[0].trim()}</td> <td>${s2[1].trim()}</td> <td>${s2[2].trim()}</td> <td>${s2[3].trim()}</td></tr>
  <tr class="border-b-2 border-slate-400"><td>+</td> <td>${s3[0].trim()}</td> <td>${s3[1].trim()}</td> <td>${s3[2].trim()}</td> <td>${s3[3].trim()}</td></tr>` : `  <tr class="border-b-2 border-slate-400"><td>${isAdd ? '+' : '-'}</td> <td>${s2[0].trim()}</td> <td>${s2[1].trim()}</td> <td>${s2[2].trim()}</td> <td>${s2[3].trim()}</td></tr>`}
  <tr class="h-6"><td></td> <td></td> <td></td> <td></td> <td></td></tr>
</table>`;

  let step2 = '';
  if (isAdd) {
    let carries = [' ', ' ', ' ', ' '];
    let carry = 0;
    for (let i = 3; i >= 1; i--) {
       let d1 = parseInt(s1[i]) || 0;
       let d2 = parseInt(s2[i]) || 0;
       let d3 = hasNum3 ? (parseInt(s3[i]) || 0) : 0;
       let sum = d1 + d2 + d3 + carry;
       if (sum >= 10) {
         carry = Math.floor(sum / 10);
         carries[i-1] = carry.toString();
       } else {
         carry = 0;
       }
    }
    
    step2 = `
<table class="table-fixed text-right font-mono mx-auto w-32 text-sm">
  <tr class="text-blue-600 font-bold text-xs"><td></td> <td>${carries[0].trim()}</td> <td>${carries[1].trim()}</td> <td>${carries[2].trim()}</td> <td>${carries[3].trim()}</td></tr>
  <tr><td></td> <td>${s1[0].trim()}</td> <td>${s1[1].trim()}</td> <td>${s1[2].trim()}</td> <td>${s1[3].trim()}</td></tr>
${hasNum3 ? `  <tr><td></td> <td>${s2[0].trim()}</td> <td>${s2[1].trim()}</td> <td>${s2[2].trim()}</td> <td>${s2[3].trim()}</td></tr>
  <tr class="border-b-2 border-slate-400"><td>+</td> <td>${s3[0].trim()}</td> <td>${s3[1].trim()}</td> <td>${s3[2].trim()}</td> <td>${s3[3].trim()}</td></tr>` : `  <tr class="border-b-2 border-slate-400"><td>+</td> <td>${s2[0].trim()}</td> <td>${s2[1].trim()}</td> <td>${s2[2].trim()}</td> <td>${s2[3].trim()}</td></tr>`}
  <tr class="font-bold"><td></td> <td>${sAns[0].trim()}</td> <td>${sAns[1].trim()}</td> <td>${sAns[2].trim()}</td> <td>${sAns[3].trim()}</td></tr>
</table>`;
  } else {
    let topRow = [s1[0], s1[1], s1[2], s1[3]];
    let strikeRow = [s1[0], s1[1], s1[2], s1[3]];
    let regroupRow = [' ', ' ', ' ', ' '];
    
    let currentValues = [parseInt(s1[0])||0, parseInt(s1[1])||0, parseInt(s1[2])||0, parseInt(s1[3])||0];
    let subValues = [parseInt(s2[0])||0, parseInt(s2[1])||0, parseInt(s2[2])||0, parseInt(s2[3])||0];
    
    for (let i = 3; i >= 0; i--) {
      if (currentValues[i] < subValues[i]) {
        let j = i - 1;
        while (j >= 0 && currentValues[j] === 0) {
          j--;
        }
        
        currentValues[j] -= 1;
        strikeRow[j] = `<del class="text-slate-400">${topRow[j].trim()}</del>`;
        regroupRow[j] = currentValues[j].toString();
        
        for (let k = j + 1; k < i; k++) {
          currentValues[k] = 9;
          strikeRow[k] = `<del class="text-slate-400">${topRow[k].trim()}</del>`;
          regroupRow[k] = '9';
        }
        
        currentValues[i] += 10;
        strikeRow[i] = `<del class="text-slate-400">${topRow[i].trim()}</del>`;
        regroupRow[i] = currentValues[i].toString();
      }
    }
    
    step2 = `
<table class="table-fixed text-right font-mono mx-auto w-32 text-sm">
  <tr class="text-blue-600 font-bold text-xs"><td></td> <td>${regroupRow[0].trim()}</td> <td>${regroupRow[1].trim()}</td> <td>${regroupRow[2].trim()}</td> <td>${regroupRow[3].trim()}</td></tr>
  <tr><td></td> <td>${strikeRow[0].trim()}</td> <td>${strikeRow[1].trim()}</td> <td>${strikeRow[2].trim()}</td> <td>${strikeRow[3].trim()}</td></tr>
  <tr class="border-b-2 border-slate-400"><td>-</td> <td>${s2[0].trim()}</td> <td>${s2[1].trim()}</td> <td>${s2[2].trim()}</td> <td>${s2[3].trim()}</td></tr>
  <tr class="font-bold"><td></td> <td>${sAns[0].trim()}</td> <td>${sAns[1].trim()}</td> <td>${sAns[2].trim()}</td> <td>${sAns[3].trim()}</td></tr>
</table>`;
  }
  
  return [step1.trim(), step2.trim()];
}

export function generateMultiplicationAlgorithmTables(multiplicand, multiplier) {
  const ans = multiplicand * multiplier;
  
  const s1 = multiplicand.toString().padStart(4, ' ');
  const s2 = multiplier.toString().padStart(4, ' ');
  const sAns = ans.toString().padStart(4, ' ');

  let step1 = `
<table class="table-fixed text-right font-mono mx-auto w-32 text-sm">
  <tr><td></td> <td>${s1[0].trim()}</td> <td>${s1[1].trim()}</td> <td>${s1[2].trim()}</td> <td>${s1[3].trim()}</td></tr>
  <tr class="border-b-2 border-slate-400"><td>x</td> <td>${s2[0].trim()}</td> <td>${s2[1].trim()}</td> <td>${s2[2].trim()}</td> <td>${s2[3].trim()}</td></tr>
  <tr class="h-6"><td></td> <td></td> <td></td> <td></td> <td></td></tr>
</table>`;

  let carries = [' ', ' ', ' ', ' '];
  let carry = 0;
  for (let i = 3; i >= 1; i--) { 
      let d1 = parseInt(s1[i]);
      if (isNaN(d1)) continue;
      
      let prod = (d1 * multiplier) + carry;
      if (prod >= 10) {
          carry = Math.floor(prod / 10);
          carries[i-1] = carry.toString();
      } else {
          carry = 0;
      }
  }

  let step2 = `
<table class="table-fixed text-right font-mono mx-auto w-32 text-sm">
  <tr class="text-blue-600 font-bold text-xs"><td></td> <td>${carries[0].trim()}</td> <td>${carries[1].trim()}</td> <td>${carries[2].trim()}</td> <td>${carries[3].trim()}</td></tr>
  <tr><td></td> <td>${s1[0].trim()}</td> <td>${s1[1].trim()}</td> <td>${s1[2].trim()}</td> <td>${s1[3].trim()}</td></tr>
  <tr class="border-b-2 border-slate-400"><td>x</td> <td>${s2[0].trim()}</td> <td>${s2[1].trim()}</td> <td>${s2[2].trim()}</td> <td>${s2[3].trim()}</td></tr>
  <tr class="font-bold"><td></td> <td>${sAns[0].trim()}</td> <td>${sAns[1].trim()}</td> <td>${sAns[2].trim()}</td> <td>${sAns[3].trim()}</td></tr>
</table>`;
  return [step1.trim(), step2.trim()];
}

export function generateBasicVerticalTable(num1, operator, num2, ans) {
  const s1 = num1.toString().padStart(4, ' ');
  const s2 = num2.toString().padStart(4, ' ');
  const sAns = ans.toString().padStart(4, ' ');

  let table = `
<table class="table-fixed text-right font-mono mx-auto w-32 text-sm">
  <tr><td></td> <td>${s1[0].trim()}</td> <td>${s1[1].trim()}</td> <td>${s1[2].trim()}</td> <td>${s1[3].trim()}</td></tr>
  <tr class="border-b-2 border-slate-400"><td>${operator}</td> <td>${s2[0].trim()}</td> <td>${s2[1].trim()}</td> <td>${s2[2].trim()}</td> <td>${s2[3].trim()}</td></tr>
  <tr class="font-bold"><td></td> <td>${sAns[0].trim()}</td> <td>${sAns[1].trim()}</td> <td>${sAns[2].trim()}</td> <td>${sAns[3].trim()}</td></tr>
</table>`;

  return table.trim();
}

export function generateLongDivisionAlgorithmTables(dividend, divisor, quotient) {
  const divStr = String(dividend).split("");
  const qStr = String(quotient).padStart(divStr.length, ' ').split("");

  let quotientCells = qStr.map((d, i) => {
    let classes = 'w-8 pb-1';
    if (i === 0) classes += ' pl-2';
    if (i === divStr.length - 1) classes += ' pr-2';
    return `<td class="${classes}">${d}</td>`;
  }).join('');
  
  let dividendCells = divStr.map((d, i) => {
    let classes = 'pt-1 border-t-2 border-slate-800 w-8 font-bold';
    if (i === 0) classes += ' pl-2 rounded-tl-[1px]';
    if (i === divStr.length - 1) classes += ' pr-2';
    return `<td class="${classes}">${d}</td>`;
  }).join('');

  let html = `
<table class="table-fixed text-center border-spacing-0 border-collapse font-mono text-sm mx-auto w-32">
  <tbody>
    <tr>
      <td class="w-12"></td>
      ${quotientCells}
    </tr>
    <tr>
      <td class="pr-3 pt-1 border-r-2 border-slate-800 text-right align-middle w-12 font-bold rounded-br-[1px]">${divisor}</td>
      ${dividendCells}
    </tr>`;

  let currentRemainder = "";
  let started = false;

  for (let i = 0; i < divStr.length; i++) {
    currentRemainder += divStr[i];
    let currentVal = parseInt(currentRemainder, 10);
    
    let qDigit = parseInt(qStr[i], 10) || 0;
    let subVal = qDigit * parseInt(divisor, 10);
    let rem = currentVal - subVal;
    
    if (qStr[i] !== " " || started) {
      started = true;
      
      let subStr = String(subVal);
      let subRow = [];
      for (let c = 0; c < divStr.length; c++) {
        if (c >= i - subStr.length + 1 && c <= i) {
          subRow.push(subStr[c - (i - subStr.length + 1)]);
        } else {
          subRow.push(" ");
        }
      }
      
      let subCells = subRow.map((d, colIdx) => {
        let classes = 'w-8 pt-1';
        if (colIdx === 0) classes += ' pl-2';
        if (colIdx === divStr.length - 1) classes += ' pr-2';
        classes += ' border-b-2 border-slate-400';
        return `<td class="${classes}">${d}</td>`;
      }).join('');
      
      html += `
    <tr>
      <td class="text-right pr-2 w-12 border-b-2 border-transparent">-</td>
      ${subCells}
    </tr>`;
      
      if (i < divStr.length - 1) {
         let combinedStr = String(rem) + divStr[i+1];
         
         let remRow = [];
         for (let c = 0; c < divStr.length; c++) {
           if (c >= i + 1 - combinedStr.length + 1 && c <= i + 1) {
             remRow.push(combinedStr[c - (i + 1 - combinedStr.length + 1)]);
           } else {
             remRow.push(" ");
           }
         }
         let remCells = remRow.map((d, colIdx) => {
           let classes = 'w-8 pt-1 font-bold';
           if (colIdx === 0) classes += ' pl-2';
           if (colIdx === divStr.length - 1) classes += ' pr-2';
           return `<td class="${classes}">${d}</td>`;
         }).join('');
         html += `
    <tr>
      <td class="w-12"></td>
      ${remCells}
    </tr>`;
      } else {
         let lastRemStr = String(rem);
         let remRow = [];
         for (let c = 0; c < divStr.length; c++) {
           if (c >= i - lastRemStr.length + 1 && c <= i) {
             remRow.push(lastRemStr[c - (i - lastRemStr.length + 1)]);
           } else {
             remRow.push(" ");
           }
         }
         let remCells = remRow.map((d, colIdx) => {
           let classes = 'w-8 pt-1 font-bold';
           if (colIdx === 0) classes += ' pl-2';
           if (colIdx === divStr.length - 1) classes += ' pr-2';
           return `<td class="${classes}">${d}</td>`;
         }).join('');
         html += `
    <tr>
      <td class="w-12"></td>
      ${remCells}
    </tr>`;
      }
    }
    
    currentRemainder = String(rem);
  }

  html += `
  </tbody>
</table>`;

  return html.trim();
}
