const str = "\\frac{3}{5}";
let s = str.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2');
console.log("Output:", s);
