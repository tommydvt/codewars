export function calculateCombinations(startPosition: string, patternLength: number): number {
   
  let positions = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  
  // converts letter to array index
  const posToIndex = (pos: string) => pos.charCodeAt(0) - "A".charCodeAt(0)
  

  // For each point, another point cannot be reach for either of following reason:
  // (i) it has already been used
  // (ii) it's hidden by another point
  
  // tracks positions that have been used in pattern
  let used: Array<boolean> = new Array<boolean>(9).fill(false);
  
  // tracks hiding and hidden positions for each letter
  let hidinghidden: Array<Array<{ hiding: string, hidden: string}>> = new Array<Array<{ hiding: string, hidden: string}>>(9).fill([]);
  hidinghidden[posToIndex("A")] = [{hiding: "D", hidden:"G"}, {hiding: "E", hidden:"I"}, {hiding: "B", hidden:"C"}]
  hidinghidden[posToIndex("B")] = [{hiding: "E", hidden:"H"}]
  hidinghidden[posToIndex("C")] = [{hiding: "B", hidden:"A"}, {hiding: "E", hidden:"G"}, {hiding: "F", hidden:"I"}]
  hidinghidden[posToIndex("D")] = [{hiding: "E", hidden:"F"}]
  hidinghidden[posToIndex("E")] = []
  hidinghidden[posToIndex("F")] = [{hiding: "E", hidden:"D"}]
  hidinghidden[posToIndex("G")] = [{hiding: "D", hidden:"A"}, {hiding: "E", hidden:"C"}, {hiding: "H", hidden:"I"}]
  hidinghidden[posToIndex("H")] = [{hiding: "E", hidden:"B"}]
  hidinghidden[posToIndex("I")] = [{hiding: "H", hidden:"G"}, {hiding: "E", hidden:"A"}, {hiding: "F", hidden:"C"}]
  
  const removeHidingPositions = (hh: Array<Array<{ hiding: string, hidden: string}>>, pos: string) => 
    hh.forEach(e=> (e.findIndex(el=>el.hiding==pos) >= 0 ) ? e.splice(e.findIndex(el=>el.hiding==pos),1) : (()=>{})() )
  
  let cnt = 0;
  
  // Will be called recursively
  const calculatePaths = function(pos: string, length: number, u: Array<boolean>, hh:Array<Array<{ hiding: string, hidden: string}>>) {
    
    // last point
    if (length==1) { cnt++; return; }
    
    // new (but not last) pattern point, update arrays accordingly and move to every possible next position
    u[posToIndex(pos)] = true;
    removeHidingPositions(hh,pos);
    for (let i=0;i<length-1;i++) {
      let nextPositions = positions                               // take all positions
        .filter(e=>u[posToIndex(e)]==false)                       // remove used ones
        .filter(e=>!hh[posToIndex(pos)].some(el=>el.hidden==e))   // remove hidden ones
      nextPositions.forEach(function (p) {
        if (length-i-1>0) {
          // calling calculatePaths with clones of both arrays
          return calculatePaths(p,length-i-1,u.slice(),hh.map(e=>e.slice())); // creating a shallow copy of a 2D-array is a bit tricky         
        } 
      })
      return;
    }    
  }
  
  calculatePaths(startPosition, patternLength, used.slice(), hidinghidden.map(e=>e.slice()));
  
  return cnt;
}
