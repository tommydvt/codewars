import { expect } from "chai";
const {assert} = require("chai");


// Anti cheats:
//-------------
for(let obj of [
  (function(){}), 
  (function*(){}), 
  (async function(){}),
  (async function*(){})
]){
  Object.defineProperty(obj.constructor.prototype, 'constructor', {value:()=>{ throw 'No cheating!' }});
}

// Workaround strict mode.
(new Function(`eval = undefined`))();

// @ts-ignore
Function.prototype.constructor = undefined;
// @ts-ignore
Function = undefined;


// module.require=require    // forbid import of solution, so hack the problematique modules instead:
(()=>{
  const keep = new Set('compileFunction'.split(' ')) // vm.compileFunction needed to import the user's solution
  
  for(let name of 'vm child_process'.split(' ')){
    const obj = require(name)

    // @ts-ignore
    for(let f in obj) if(!keep.has(f)) obj[f] = undefined;  
  }
})()


//-------------------------------------------------------------
/*  
// To check that the assertion process still works as expected
it("passing",function(){assert.isOk(1)})   
it("not passing",function(){assert.isOk(0)})   
//*/
//-------------------------------------------------------------

import { calc } from '../solution';

var tests: [string, number][] = [
  ['12*-1', -12],
  ['12* 123/-(-5 + 2)', 492],
  ['((80 - (19)))', 61],
  ['(1 - 2) + -(-(-(-4)))', 3],
  ['1 - -(-(-(-4)))', -3],
  ['12* 123/(-5 + 2)', -492],
  ['(123.45*(678.90 / (-2.5+ 11.5)-(((80 -(19))) *33.25)) / 20) - (123.45*(678.90 / (-2.5+ 11.5)-(((80 -(19))) *33.25)) / 20) + (13 - 2)/ -(-11) ', 1],
  ['1+1', 2],
  ['1 - 1', 0],
  ['1* 1', 1],
  ['1 /1', 1],
  ['-123', -123],
  ['123', 123],
  ['2 /2+3 * 4.75- -6', 21.25],
  ['12* 123', 1476],
  ['12 * -123', -1476],
  ['2 / (2 + 3) * 4.33 - -6', 7.732],
  ['((2.33 / (2.9+3.5)*4) - -6)', 7.45625],
  ['123.45*(678.90 / (-2.5+ 11.5)-(80 -19) *33.25) / 20 + 11', -12042.760875]
];

describe("calc", function() {
  it("should evaluate correctly", () => {
    tests.forEach(function(m) {
      var x = calc(m[0]);
      var y = m[1];
      expect(x).to.equal(y, 'Expected: "' + m[0] + '" to be ' + y + ' but got ' + x);
    });
  });
});