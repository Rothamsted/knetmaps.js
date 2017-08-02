
 var animate_layout= true; // global variable for layout animation setting (default: true).

 // CoSE layout.
 var coseNetworkLayout= {
  name: 'cose', // cytoscapeJS CoSE layout
  // Called on `layoutready`
  ready: function(){ },
  // Called on `layoutstop`
  stop: function(){ },

  // Whether to animate while running the layout
  animate: animate_layout/*true*/,
  // The layout animates only after this many milliseconds
  // (prevents flashing on fast runs)
  animationThreshold: 250,
  // Number of iterations between consecutive screen positions update (0 -> only updated on the end)
  refresh: 20,

  // Whether to fit the network view after when done
  fit: true,
  // Padding on fit
  padding: 30,

  // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  boundingBox: undefined,

  // Randomize the initial positions of the nodes (true) or use existing positions (false)
  randomize: /*false*/true,

  // Extra spacing between components in non-compound graphs
  componentSpacing: 100,

  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: 400000,
  // Node repulsion (overlapping) multiplier
  nodeOverlap: 10,

  // Ideal edge (non nested) length
  idealEdgeLength: 10,
  // Divisor to compute edge forces
  edgeElasticity: 100,
  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor: 5,

  // Gravity force (constant)
  gravity: 80,

  // Maximum number of iterations to perform
  numIter: 1000,
  // For enabling tiling, to prevent stacked nodes bug
  //tile: true,
  
  // Initial temperature (maximum node displacement)
  initialTemp: 200,
  // Cooling factor (how the temperature is reduced between consecutive iterations
  coolingFactor: 0.95,
  // Lower temperature threshold (below this point the layout will end)
  minTemp: 1.0,

  // Whether to use threading to speed up the layout
  useMultitasking: true
 };

   var coseNetworkLayout_old= {
    name: 'cose', // CytoscapeJS CoSE layout
    animate: animate_layout /*true*/,
    handleDisconnected: true, avoidOverlap: true,
    idealEdgeLength: 100, nodeOverlap: 20
   };

   // NEW: Force layout.
   var ngraph_forceNetworkLayout= {
    name: 'cytoscape-ngraph.forcelayout',
    animate: animate_layout, fit: true,
    async: {
                 // tell layout that we want to compute all at once:
                 maxIterations: 1000,
                 stepsPerCycle: 30,

                 // Run it till the end:
                 waitForStep: false
             },
             physics: {
                 // Ideal length for links (springs in physical model).
                 springLength: 130,

                 // Hook's law coefficient. 1 - solid spring.
                 springCoeff: 0.0008,

                 // Coulomb's law coefficient. It's used to repel nodes thus should be negative
                 // if you make it positive nodes start attract each other :).
                 gravity: -1.2,

                 // Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
                 // The closer it's to 1 the more nodes algorithm will have to go through.
                 // Setting it to one makes Barnes Hut simulation no different from brute-force forces calculation (each node is considered).
                 theta: 0.8,

                 // Drag force coefficient. Used to slow down system, thus should be less than 1.
                 // The closer it is to 0 the less tight system will be.
                 dragCoeff: 0.02,

                 // Default time step (dt) for forces integration
                 timeStep: 20,
                 iterations: 10000,
                 fit: true,

                 // Maximum movement of the system which can be considered as stabilized
                 stableThreshold: 0.000009
             },
             iterations: 10000,
             refreshInterval: 16, // in ms
             refreshIterations: 10, // iterations until thread sends an update
             stableThreshold: 2
   };

   // Circular layout.
   var circleNetworkLayout= {
      name: 'circle', // Circle layout
      padding: 10/*30*/, avoidOverlap: true, boundingBox: undefined, handleDisconnected: true,
      animate: animate_layout, fit: true, counterclockwise: false,
      radius: 3 /*undefined*/,
//      startAngle: 3/2 * Math.PI,
      rStepSize: 2
   };

   // Concentric layout.
   var concentricNetworkLayout= {
    name: 'concentric', fit: true, padding: 10, 
    startAngle: 3/2 * Math.PI, // the position of the 1st node
    counterclockwise: false, // whether the layout should go anticlockwise (true) or clockwise (false)
    minNodeSpacing: 10, boundingBox: undefined, avoidOverlap: true, height: undefined, width: undefined, 
    concentric: function(){ // returns numeric value for each node, placing higher nodes in levels towards the centre
     return this.degree(); },
    levelWidth: function(nodes){ // the variation of concentric values in each level
     return 0.5 /*nodes.maxDegree() / 4*/; },
    animate: animate_layout, animationDuration: 500, ready: undefined, stop: undefined,
    radius: 5 /*undefined*/
   };

   // CoSE-Bilkent layout.
   var coseBilkentNetworkLayout= {
    name: 'cose-bilkent', 
	ready: function () {
	},
    // Called on `layoutstop`
    stop: function () {
	},
	// Whether to fit the network view after when done
    fit: true,
    // Padding on fit
    padding: 10,
    // Whether to enable incremental mode
    randomize: true,
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: 4500,
    // Ideal edge (non nested) length
    idealEdgeLength: 50,
    // Divisor to compute edge forces
    edgeElasticity: 0.45,
    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor: 0.1,
    // Gravity force (constant)
    gravity: 0.25,
    // Maximum number of iterations to perform
    numIter: 200,
    // For enabling tiling
    tile: true,
    // Type of layout animation. The option set is {'during', 'end', false}
    animate: false,
    // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
    tilingPaddingVertical: 10,
    // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
    tilingPaddingHorizontal: 10,
    // Gravity range (constant) for compounds
    gravityRangeCompound: 1.5,
    // Gravity force (constant) for compounds
    gravityCompound: 1.0,
    // Gravity range (constant)
    gravityRange: 3.8
   };

   var coseBilkentNetworkLayout_old= {
    name: 'cose-bilkent', handleDisconnected: true, avoidOverlap: true
   };
   
   var eulerNetworkLayout_demo= {
   name: 'euler',

  // The ideal length of a spring
  // - This acts as a hint for the edge length
  // - The edge length can be longer or shorter if the forces are set to extreme values
  springLength: edge => 80,

  // Hooke's law coefficient
  // - The value ranges on [0, 1]
  // - Lower values give looser springs
  // - Higher values give tighter springs
  springCoeff: edge => 0.0008,

  // The mass of the node in the physics simulation
  // - The mass affects the gravity node repulsion/attraction
  mass: node => 4,

  // Coulomb's law coefficient
  // - Makes the nodes repel each other for negative values
  // - Makes the nodes attract each other for positive values
  gravity: -1.2,

  // Theta coefficient from Barnes-Hut simulation
  // - Value ranges on [0, 1]
  // - Performance is better with smaller values
  // - Very small values may not create enough force to give a good result
  theta: 0.666,

  // Friction / drag coefficient to make the system stabilise over time
  dragCoeff: 0.02,

  // When the total of the squared position deltas is less than this value, the simulation ends
  movementThreshold: 1,

  // The amount of time passed per tick
  // - Larger values result in faster runtimes but might spread things out too far
  // - Smaller values produce more accurate results
  timeStep: 20,

  // The number of ticks per frame for animate:true
  // - A larger value reduces rendering cost but can be jerky
  // - A smaller value increases rendering cost but is smoother
  refresh: 10,

  // Whether to animate the layout
  // - true : Animate while the layout is running
  // - false : Just show the end result
  // - 'end' : Animate directly to the end result
  animate: true,

  // Animation duration used for animate:'end'
  animationDuration: undefined,

  // Easing for animate:'end'
  animationEasing: undefined,

  // Maximum iterations and time (in ms) before the layout will bail out
  // - A large value may allow for a better result
  // - A small value may make the layout end prematurely
  // - The layout may stop before this if it has settled
  maxIterations: 1000,
  maxSimulationTime: 4000,

  // Prevent the user grabbing nodes during the layout (usually with animate:true)
  ungrabifyWhileSimulating: false,

  // Whether to fit the viewport to the repositioned graph
  // true : Fits at end of layout for animate:false or animate:'end'; fits on each frame for animate:true
  fit: true,

  // Padding in rendered co-ordinates around the layout
  padding: 30,

  // Constrain layout bounds with one of
  // - { x1, y1, x2, y2 }
  // - { x1, y1, w, h }
  // - undefined / null : Unconstrained
  boundingBox: undefined,

  // Layout event callbacks; equivalent to `layout.one('layoutready', callback)` for example
  ready: function(){}, // on layoutready
  stop: function(){}, // on layoutstop

  // Whether to randomize the initial positions of the nodes
  // true : Use random positions within the bounding box
  // false : Use the current node positions as the initial positions
  randomize: false
 };

  var eulerNetworkLayout= {
   name: 'euler',
   springLength: 80, springCoeff: 0.0008,
   mass: 4,
   gravity: -1.2, theta: 0.666, dragCoeff: 0.02, movementThreshold: 1,
   timeStep: 20,
   refresh: 10,
   animate: animate_layout /*true*/, animationDuration: undefined, animationEasing: undefined,
   maxIterations: 1000, maxSimulationTime: 4000,
   ungrabifyWhileSimulating: false, fit: true, padding: 30, boundingBox: undefined, 
   ready: function(){}, // on layoutready
   stop: function(){}, // on layoutstop
   randomize: false
 };

 var randomNetworkLayout= {
  name: 'random',
  fit: true, // whether to fit to viewport
  padding: 30, // fit padding
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  animate: animate_layout /*false*/, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  ready: undefined, // callback on layoutready
  stop: undefined // callback on layoutstop
 };
