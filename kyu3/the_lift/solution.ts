export const theLift = (queues: number[][], capacity: number): number[] => {
  
  enum Direction {
    UP,
    DOWN
  }
  
  // Global variables to track current floor, current direction and lift content
  let dir: Direction = Direction.UP;
  let floor: number = 0;
  let lift: Array<number> = new Array<number>();
  
  let res: Array<number> = new Array<number>();
  
  /**
   *
   *  HELPER FUNCTIONS
   *
   * **************** */
  
  // Revert lift direction
  const revert_dir = (d: Direction): Direction => (d==Direction.UP ? Direction.DOWN : Direction.UP);
  
  // How many people queuing in the building
  const people_queuing = (q: Array<Array<number>>) => q.reduce((c,v)=>c+v.length,0);
  
  // Compute the next floor for a lift at floor f going in direction d
  // -1 if there is no such floor
  // (e.g. -1 for a lift going up, all next floors have people wishing to go down)
  const next_floor_same_direction = (q: Array<Array<number>>, f: number, d: Direction) => 
    (d==Direction.UP) ? 
      ( q.slice(f+1).reduce(
        (c,v,i)=> ( 
          // If the value to be returned is already different than -1 (initial value), 
          // keep returning it and do not proceed with further calculation
          (c==-1) ? (
            // for each upper floor, do we have people waiting ? 
            v.length ? 
              // if yes, for this floor "i+floor+1", do we have people wishing to go to an upper floor ?
              //    if no, return current value
              //    if yes, return this specific floor "i+floor+1"
              ( v.filter(e=>e>(i+f+1)).length ? (i+f+1) : c ) 
            // No people waiting, move on to next floor and return current value
            : c ) 
          // A next floor was identified, keep returning it
          : c
        ),-1) // default value, will be returned if no next floor has been found.
      ) : ( // Directon.DOWN
        q.slice(0,f).reverse().reduce(
        (c,v,i)=> ( 
          // If the value to be returned is already different, 
          // keep returning it and do not proceed with further calculation
          (c==-1) ? (
            // for each lower floor, do we have people waiting ? 
            v.length ? 
              // if yes, for this floor "floor-i-1", do we have people wishing to go to a lower floor ?
              //    if no, return current value
              //    if yes, return this specific floor "floor-i-1"
              ( v.filter(e=>e<(f-i-1)).length ? (f-i-1) : c ) 
            // No people waiting, move on to next floor and return current value
            : c ) 
          // A next floor was identified, keep returning it
          : c
        ),-1) // default value, to be returned if no next floor was identified
      )
  
  
  
  // What's the next floor for a lift at floor f going in direction d 
  // based only on the people in the lift
  const next_floor_for_lift_fn = function (l: Array<number>, f: number, d: Direction) {
    let l_filtered = d==Direction.UP ? l.filter(e=>e>f) : l.filter(e=>e<f);
    return l_filtered.length > 0 ? ( 
      d==Direction.UP ? Math.min(...l_filtered) : Math.max(...l_filtered) ) : -1 ;
  }    
  
  
  // The furthest floor a lift at floor f, going in direction d can go, in a building q
  const furthest_floor = (q: Array<Array<number>>,f: number, d: Direction) => 
    dir==Direction.UP ? 
        q.slice(f+1).reduce((c,v,i)=>(v.length>0 ? f+i+1 : c),-1) :
        q.slice(0,f).reverse().reduce((c,v,i)=>(v.length>0 ? f-i-1 : c),-1)
  
  
  // The closest floor a lift at floor f, going in direction d can go, in a building q
  const closest_floor = (q: Array<Array<number>>,f: number, d: Direction) => 
    dir==Direction.UP ? 
      q.slice(f+1).reduce((c,v,i)=>( c==-1 ? (v.length>0 ? f+i+1 : c) : c),-1) :
      q.slice(0,f).reverse().reduce((c,v,i)=>( c==-1 ? (v.length>0 ? f-i-1 : c) : c ),-1)
  
  
  // A function identify the next floor a lift l should go
  // q: the building
  // c: lift's capacity
  // f: the floor the lift is currently at
  // d: the current direction of the lift
  // returns a tuple, containing the destination floor and new direction
  const identify_next_floor = function (q: Array<Array<number>>, l: Array<number>, c: number, f: number, d: Direction ): [number, Direction] {
    
    // Special case, we go back to 0 if lift is empty and no-one is queuing
    if (!(lift.length>0 || people_queuing(queues)>0))
      return [0,d];
    
    // We need to determine what's the next floor for the lift.
    // This depends on :
    // (i) people in the lift l
    // (ii) people queuing in the next floors q
    // But also the current floor f, the current direction d and the lift capacity c
    
    // (i) people in the lift wishing to go to a upper / lower floor. 
    // Return -1 if there is no one.
    let next_floor_for_l = next_floor_for_lift_fn(l,f,d);
    
    // (ii) people queuing in the next floors, wishing to go in the very same direction.
    // Return -1 is there is no such floor.
    let next_floor_for_q = next_floor_same_direction(q,f,d);
    
    // Special case where no one in the lift want to go in the same direction, 
    // and no floor was identified with people wishing to go in the same direction
    if ( next_floor_for_l < 0 && next_floor_for_q < 0 ) {
      if (l.length<c) { // if lift is not full, go to the furthest floor to pick up people
        f = furthest_floor(q,f,d);
        if (f==-1) { // if no floor was identified (floor = last floor), revert direction and identify next floor
          d=revert_dir(d);
          return identify_next_floor(q,l,c,f,d);
        } else return [f,d];
      } else {
        // if lift is full, revert direction and identify next floor
        d=revert_dir(dir);
        return identify_next_floor(q,l,c,f,d);
      }
    } else
      return [
        d==Direction.UP ? 
          ( (next_floor_for_l > 0 && next_floor_for_q > 0) ? Math.min(next_floor_for_l, next_floor_for_q) : Math.max(next_floor_for_l, next_floor_for_q)) :
          Math.max(next_floor_for_l, next_floor_for_q)
        ,d]
    
  }
  
  // Check if lift at floor f of building q, and going in direction d has reached last floor
  const check_last_floor = function(q: Array<Array<number>>,l: Array<number>, f: number, d:Direction ): boolean {
    // Yes if :
    // (i) there are no more people queueing in next floor 
    // AND 
    // (ii) no-one in the lift wishing to get off at a higher (lower floor)
    let lf = (d==Direction.UP ? 
                    q.slice(f+1).reduce((c,v)=>(c&&(v.length==0)),true) :
                    q.slice(0,f).reduce((c,v)=>(c&&(v.length==0)),true))
    return lf && (d==Direction.UP ? l.filter(e=>e>f).length==0 : l.filter(e=>e<f).length==0 )
  }
    
  // This function will extract people from queue q at floor f of building q, and place them in lift l going in direction d, limited to capacity c
  const pickup = function (q: Array<number>, l: Array<number>, c: number, f: number, d: Direction): {new_q: Array<number>, new_l: Array<number>} {
    // We are limited by 
    // (i) the capacity c of the lift l
    // (ii) by the direction d the lift l is going
    // As we play with queue q, we will add to n all people from q staying at floor f
    // we return the new queue, and new lift
    let n=new Array<number>();
    q.forEach(function(e,i) {
      if (d==Direction.UP) {
        if (e>f && l.length<c) {
          l.push(e);
        } else 
          n.push(e)
      } else if(d==Direction.DOWN) {
        if(e<f && l.length<c) {
          l.push(e);
        } else 
          n.push(e)
      }
    })
    return {new_q: n, new_l: l};
  }
    
  /**
   *
   *  MAIN LOOP
   *
   * **************** */
  
  while(lift.length>0 || people_queuing(queues)>0) {
    
    // 0. 
    // We arrive at floor
    res.push(floor);
    
    
    // 1. 
    // First let people get off
    let getoffidx = lift.indexOf(floor);
    while(getoffidx>=0) {
      lift.splice(getoffidx,1);
      getoffidx = lift.indexOf(floor);
    }
    
    // 2.
    // We need then to evaluate whether we continue moving in the same direction.
    // Going Up,if we are at the last floor with people queing, this will depend on whether at least one of them want to go up.
    // It will also depend on whether people in the lift want to get off at a upper (lower when we go down) floor
    
    // Are we at the last floor ? 
    let last_floor: boolean = check_last_floor(queues,lift,floor,dir);
    
    // We change direction if :
    // (i) We are at the last floor
    // (ii) AND, At this floor, we do not take people wishing to go further up (or down depending on dir)
    let change_dir: boolean = last_floor ? 
        (dir==Direction.UP ? 
          queues[floor].reduce((c,v)=>c&&(v<=floor),true):
          queues[floor].reduce((c,v)=>c&&(v>=floor),true) ) : false;
    
    // Revert the direction if needed
    if (change_dir) dir=revert_dir(dir);
    
    
    // 3.
    // Picking up people
    // Having updated the direction, we now can pick as many people we can, 
    ( { new_q: queues[floor], new_l: lift } = pickup(queues[floor],lift,capacity,floor,dir));
    
    
    
    // 4.
    // Next floor
    // Next, we need to determine what's the next floor for the lift.
    [floor, dir] = identify_next_floor(queues,lift,capacity,floor,dir);
    
  
  } /*** End of main loop  ***/
  
  
  
  // Special cases: 
  //  - do not push 0 if the previous floor was already 0 (happens when last move was to let people get off at floor 0)
  //  - empty lift should have at least 0 in the result
  if (res.slice(-1)[0] > 0 || res.length==0) res.push(0);
  
  return res;
}
