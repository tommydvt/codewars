export function calc(expression: string): number {

// Helper function that calculates a simple mathematical formula (no parentheses involved)
const performCalc = function(s: string) {
    // 1. remove leading, trailing parentheses, if any
    let ss = s.match(/(?<=\().*(?=\))/)
    s = (ss==null) ? s : ss[0];
    
    // 2. We split according to operators
    let calc: Array<string> = s.split(/(?<=[\+\-\*\/])|(?=[\+\-\*\/])/)
    
    // 3. We reduce the -/+ operators => this will turn +- into -, -- into +, etc.
    calc = calc.reduce(function (c,v,i,a) { 
                if (v=='-' || v=='+') {
                  let sign=(v=='-') ? -1 : 1;
                  while(a[i+1]=='+'||a[i+1]=='-') { if(a[i+1]=='-') sign=-sign; a.splice(i+1,1); } // while we have more +/- after a single + or - ...
                  return [...c,(sign>0) ? '+' : '-'];
                } else return [...c,v];
        },new Array<string>())
  
    // 4. We deal with leading digit: remove unnecessary + and convert leading - to negative integer. e.g. [ '-', '1', '+', '4' , '*', '-', '3' ] => [ '-1', '+', '4' , '*', '-', '3' ]
    if (calc[0]=='+' || calc[0] =='-') {
      if (calc[0]=='-') 
        calc.splice(0,2,(-1*parseFloat(calc[1])).toString())
      else
        calc.splice(0,1)
    }
  
    // 5. Remove first all occurences of /+ /- *+ *-. e.g. [ '-1', '+', '4' , '*', '-', '3' ] => [ '-1', '+', '4' , '*', '-3' ]
    calc.forEach(function (v,i,a) {
                if ( (v=='/' || v=='*') && (a[i+1]=='+'||a[i+1]=='-') ) {
                  let sign=(a[i+1]=='-') ? -1 : 1;
                  a.splice(i+1,2,(sign*parseFloat(a[i+2])).toString())  
                }
        })
    
    // Before moving on, we define generic functions for each operator
    const math = { 
        "+": (x: number, y: number) => x+y, "-": (x: number, y: number) => x-y,
        "*": (x: number, y: number) => x*y, "/": (x: number, y: number) => x/y,
    }
    
    // And a basic calculate function, that performs all operations for operator op. e.g op='*' and arr=[ '-1', '+', '4' , '*', '-3' ] => [ '-1', '+', '-12' ]
    const calculate = function(arr: Array<string>, op: string) {
      let next_op = arr.lastIndexOf(op) // start by the last occurence of operator op
      while (next_op>0){
        let res= math[op as keyof typeof math](parseFloat(arr[next_op-1]),parseFloat(arr[next_op+1])) // the actual operation
        arr.splice(next_op-1,3,(res).toString())                                                      // reduce array
        next_op = arr.lastIndexOf(op)
      }
    }
    
    
    // 6. Performes operations starting by the priority / and * operations, and then + / -
    calculate(calc,"/");
    calculate(calc,"*");
    calculate(calc,"+");
    calculate(calc,"-");
  
    // 7. Stringify result. e.g. [ '-13' ] => -13
    
    return calc.reduce((c,v)=>c+v,""); // stringify
  
  }
  

  /**
   *
   *  Main Script
   *
   * ***/

  // A/ Remove all whitespaces
  let expr = expression.replace(/\s/g,"")
  
  // B/ Breaking down parentheses. the most inner parentheses components will appear, and will be dealt with in priority.
  let formula: Array<string> = expr
      .split(/(?=\()/)                          // splitting and keeping leading '('
      .map(e=>e.split(/(?<=\))/))               // when ')' occurs splitting each element with trailing ')'
      .reduce((c,v)=>[...c,...v],[])            // reducing to get an array of string
  
  // C/ Dealing with all parentheses components
  while(formula.some(e=>e.includes('(') || e.includes(')')))
  {
    formula.forEach(function(e,i,a) {
      if ((e.match(/\(.*\)/)||[]).length>0) { // only elements having a leading '(' and a trailing ')'
        let val = performCalc(e); // we calculate the element
        // A bit complex but we aggregate the element with its neighbours, which may or may not exist depending of location of e in the array.
        if(i>0)
          a.splice(i-1,Math.min(3,a.length-i+1),a[i-1]+val+(i<a.length-1 ? a[i+1] : "") )
        else
          a.splice(0,Math.min(2,a.length-i),val+(i<a.length-1 ? a[i+1] : ""))
      }
    })
  }
  
  // D/ All parenthesis have been resolved, we need to continue calculating until there is no more operator, except for a leading '-' or '+'
  while(formula.some(
    (e,i)=> 
      (i==0 && e.slice(1).includes('+')) || (i>0 && e.includes('+')) || 
      (i==0 && e.slice(1).includes('-')) || (i>0 && e.includes('-')) || 
      e.includes('*') || 
      e.includes('/') ))
  {
    formula.forEach(function(e,i,a) {
      let val = performCalc(e);
      // A bit complex but we aggregate the element with its neighbours, which may or may not exist depending of location of e in the array.
      if(i>0)
          a.splice(i-1,Math.min(3,a.length-i+1),a[i-1]+val+(i<a.length-1 ? a[i+1] : "") )
      else
          a.splice(0,Math.min(2,a.length-i),val+(i<a.length-1 ? a[i+1] : ""))
    })
  }

  // E/ No more parenthesis and all operators have been resolved, except for a potential leading '-'
  
  return parseFloat(formula[0]);
}
