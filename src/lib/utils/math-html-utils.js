export function generateAlgorithmTables(num1, num2, isAdd) {
  const ans = isAdd ? num1 + num2 : num1 - num2;
  
  // Pad strings to 4 digits for alignment
  const s1 = num1.toString().padStart(4, ' ');
  const s2 = num2.toString().padStart(4, ' ');
  const sAns = ans.toString().padStart(4, ' ');

  let step1 = `
<table class="table-fixed text-right font-mono mx-auto w-32 text-sm">
  <tr><td></td> <td>${s1[0].trim()}</td> <td>${s1[1].trim()}</td> <td>${s1[2].trim()}</td> <td>${s1[3].trim()}</td></tr>
  <tr class="border-b-2 border-slate-400"><td>${isAdd ? '+' : '-'}</td> <td>${s2[0].trim()}</td> <td>${s2[1].trim()}</td> <td>${s2[2].trim()}</td> <td>${s2[3].trim()}</td></tr>
  <tr class="h-6"><td></td> <td></td> <td></td> <td></td> <td></td></tr>
</table>`;

  let step2 = '';
  if (isAdd) {
    let carries = [' ', ' ', ' ', ' '];
    let carry = 0;
    for (let i = 3; i >= 1; i--) {
       let d1 = parseInt(s1[i]) || 0;
       let d2 = parseInt(s2[i]) || 0;
       let sum = d1 + d2 + carry;
       if (sum >= 10) {
         carry = 1;
         carries[i-1] = '1';
       } else {
         carry = 0;
       }
    }
    
    step2 = `
<table class="table-fixed text-right font-mono mx-auto w-32 text-sm">
  <tr class="text-blue-600 font-bold text-xs"><td></td> <td>${carries[0].trim()}</td> <td>${carries[1].trim()}</td> <td>${carries[2].trim()}</td> <td>${carries[3].trim()}</td></tr>
  <tr><td></td> <td>${s1[0].trim()}</td> <td>${s1[1].trim()}</td> <td>${s1[2].trim()}</td> <td>${s1[3].trim()}</td></tr>
  <tr class="border-b-2 border-slate-400"><td>+</td> <td>${s2[0].trim()}</td> <td>${s2[1].trim()}</td> <td>${s2[2].trim()}</td> <td>${s2[3].trim()}</td></tr>
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
