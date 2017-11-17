(function() {
  'use strict';
  var register = function(cy) {
    if (!cy) {
      return;
    } // Can't Register if Cytoscape is Unspecified

    // Default Layout Options
    var defaults = {
      padding: 100, // Padding around the layout
      boundingBox: undefined, // Constrain layout bounds; {x1,y1,x2,y2} or {x1,y1,w,h}
      chromPadding: 5, // Ammount of padding at the end of the chrom lines in degrees
      nodeDiameter: 30, // Diameter of the genes, for stacking and spacing
      radWidth: 0.015, // Thickness of the chromosomes lines (in radians)
      logSpacing: false, // Log or linear SNP layout along chromosome
      snpLevels: 3, // How many colors to stripe the snps

      // Defines which chromosome the gene is on
      getChrom: function(ele) {
        return ele.data('chrom');
      },

      // Defines which SNP the gene is on
      getSNP: function(ele) {
        return ele.data('snp');
      },

      // Defines the gene's starting and ending positions (in base pairs)
      getStart: function(ele) {
        return ele.data('start');
      },
      getEnd: function(ele) {
        return ele.data('end');
      },

      // Optional Callbacks
      ready: function() {}, // on layoutready
      stop: function() {} // on layoutstop
    };

    // Constructor
    // Options : Object Containing Layout Options
    function PolywasLayout(options) {
      var opts = (this.options = {});
      for (var i in defaults) {
        opts[i] = defaults[i];
      }
      for (var i in options) {
        opts[i] = options[i];
      }
    }

    // Runs the Layout
    PolywasLayout.prototype.run = function() {
      var layout = this;
      var options = layout.options;
      var cy = options.cy;

      // Find the Bounding Box and the Center
      var bb = options.boundingBox || cy.extent();
      if (bb.x2 === undefined) {
        bb.x2 = bb.x1 + bb.w;
      }
      if (bb.w === undefined) {
        bb.w = bb.x2 - bb.x1;
      }
      if (bb.y2 === undefined) {
        bb.y2 = bb.y1 + bb.h;
      }
      if (bb.h === undefined) {
        bb.h = bb.y2 - bb.y1;
      }
      var center = {x: (bb.x1 + bb.x2) / 2, y: (bb.y1 + bb.y2) / 2};

      // Start the layout
      layout.trigger('layoutstart');
      cy.startBatch();

      // Clean up things from previous layout, if there was one
      cy.reset();
      cy.remove('[type = "chrom"], [type = "snpG"]');
      cy.edges().classes('');

      // Finding and splitting up the different element types
      var nodes = cy.nodes();
      var genes = nodes;

      // Find the new degree for the visible genes
      // Save some metadata into the node
      genes.forEach(function(cur, idx, arr) {
        cur.data('cur_ldegree', cur.connectedEdges(':visible').length);
        cur.data('type', 'gene');
        cur.data('chrom', options.getChrom(cur));
        cur.data('snp', options.getSNP(cur));
        cur.data('start', options.getStart(cur));
        cur.data('end', options.getEnd(cur));
      });

      // ===========================
      // Find Info About Chromosomes
      // ===========================
      // Get the chrom nodes and relative SNP positions
      var res = makeChroms(cy, genes, options.logSpacing);
      var snpData = res['snpData'];

      // Add the chromosomes to the graph
      var chrom = cy.add(res['chromNodes']);

      // ======================
      // Handle the Chromosomes
      // ======================
      // Break the batch to actually add the chroms and update the removals
      cy.endBatch();
      cy.startBatch();

      // Find circle information
      var radius = Math.min(bb.h, bb.w) / 2 - options.padding;
      var chromPad = options.chromPadding * Math.PI / 180; // Padding in radians
      var dtheta = 2 * Math.PI / chrom.length;

      // Find and set the position of the chromosomes
      var chromData = {};
      chrom.layoutPositions(layout, options, function(ele, i) {
        // Find the angle of the ends of the chrom line
        var radA = (i - 1) * dtheta + chromPad / 2;
        var radB = i * dtheta - chromPad / 2;

        // Use trig to find the actual coordinates of the points
        var ax = Math.round(radius * Math.cos(radA) + center['x']);
        var ay = Math.round(radius * Math.sin(radA) + center['y']);
        var bx = Math.round(radius * Math.cos(radB) + center['x']);
        var by = Math.round(radius * Math.sin(radB) + center['y']);

        // Find the two relevant measures of line length, pixels and base pairs
        var chromLen = ele.data('end') - ele.data('start');
        var pxLen = Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));

        // Add some information in the node concerning it's position for style
        ele.data({
          len: pxLen,
          theta: (radA + radB) / 2,
          radWidth: options.radWidth
        });

        // Some data for future computations
        chromData[ele.data('id')] = {
          pxStart: {x: ax, y: ay},
          delta: {x: (bx - ax) / chromLen, y: (by - ay) / chromLen},
          BPperPX: chromLen / pxLen
        };
        return {x: Math.round((ax + bx) / 2), y: Math.round((ay + by) / 2)};
      });

      // Set the chromosomes style to make the lines
      chrom
        .style({
          shape: 'polygon',
          width: function(ele) {
            return ele.data('len');
          },
          height: function(ele) {
            return ele.data('len');
          },
          'shape-polygon-points': function(ele) {
            return getLinePolygon(ele);
          }
        })
        .lock()
        .unselectify();

      // ===============
      // Handle the SNPs
      // ===============
      // Make new SNP groups
      res = makeSNPGs(snpData, chromData, options.nodeDiameter);
      snpData = res['snpData'];

      // Add our fresh nodes
      var snps = cy.add(res['snpNodes']);

      // Position the new SNP groups
      var snpGData = {};
      snps
        .layoutPositions(layout, options, function(ele, i) {
          var eleData = ele.data();
          var chrom = chromData[eleData['chrom']];

          // Find the position of the snps based on all the data
          var x = Math.round(
            eleData['pos'] * chrom['delta']['x'] + chrom['pxStart']['x']
          );
          var y = Math.round(
            eleData['pos'] * chrom['delta']['y'] + chrom['pxStart']['y']
          );

          // Find theta from the center
          var theta = Math.atan2(y - center['y'], x - center['x']);

          // Return position and some metadata
          snpGData[eleData['id']] = {
            // Save the position for easy access
            pos: {x: x, y: y},

            // Save the coefficients for gene position calculations
            coef: {
              x: Math.cos(theta) * options.nodeDiameter,
              y: Math.sin(theta) * options.nodeDiameter
            },

            // Increment variales used for gene placement
            nextOffset: 0,
            numSNPs: 0
          };
          return {x: x, y: y};
        })
        .lock()
        .unselectify();

      // ================
      // Handle the genes
      // ================
      // Now sort the SNPs by thier highest degree member
      snpData = snpData.sort(function(a, b) {
        if (a['genes'].length === 0 || b['genes'].length === 0) {
          return b['genes'].length - a['genes'].length;
        } else {
          return (
            b['genes'][0].data('cur_ldegree') -
            a['genes'][0].data('cur_ldegree')
          );
        }
      });

      // Place the genes by order of SNP
      snpData.forEach(function(snp, idx, arr) {
        // Find the appropriate snpG
        var snpG = snpGData[snp['grp']];

        // Find the position of the genes
        snp['genes'].layoutPositions(layout, options, function(ele, i) {
          // Keep track of metadata
          snpG['nextOffset'] += 1;
          ele.addClass(
            'snp' + (snpG['numSNPs'] % options.snpLevels).toString()
          );

          // Return the position based on some math
          return {
            x: Math.round(
              snpG['nextOffset'] * snpG['coef']['x'] + snpG['pos']['x']
            ),
            y: Math.round(
              snpG['nextOffset'] * snpG['coef']['y'] + snpG['pos']['y']
            )
          };
        });

        // Increment the counters
        snpG['nextOffset'] += 1;
        snpG['numSNPs'] += 1;
      });

      // ==================
      // Finish the Layout!
      // ==================
      // End the batch operation
      cy.endBatch();

      // Trigger layoutready when each node has had its position set at least once
      layout.one('layoutready', options.ready);
      layout.trigger('layoutready');

      // Trigger layoutstop when the layout stops (e.g. finishes)
      layout.one('layoutstop', options.stop);
      layout.trigger('layoutstop');

      // Done
      return layout;
    };

    // Called on Continuous Layouts to Stop Them Before They Finish
    PolywasLayout.prototype.stop = function() {
      return this;
    };

    // Actually Register the layout!
    cytoscape('layout', 'polywas', PolywasLayout);
  };

  // Expose as a Commonjs Module
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = register;
  }

  // Expose as an AMD/Requirejs Module
  if (typeof define !== 'undefined' && define.amd) {
    define('cytoscape-polywas', function() {
      return register;
    });
  }

  // Expose to Global Cytoscape (i.e. window.cytoscape)
  if (typeof cytoscape !== 'undefined') {
    register(cytoscape);
  }
})();

// Helper function that, given a node containing theta in its data,
// returns the polygon points for a line oriented in that direction in
// relation to the origin (0,0) of the unit circle
function getLinePolygon(ele) {
  var radWidth = ele.data('radWidth');
  var theta = ele.data('theta') - Math.PI / 2;
  var ax = Math.cos(theta + radWidth / 2);
  var ay = Math.sin(theta + radWidth / 2);
  var bx = Math.cos(theta - radWidth / 2);
  var by = Math.sin(theta - radWidth / 2);
  var cx = -ax;
  var cy = -ay;
  var dx = -bx;
  var dy = -by;
  var res =
    ax.toString() +
    ' ' +
    ay.toString() +
    ' ' +
    bx.toString() +
    ' ' +
    by.toString() +
    ', ' +
    bx.toString() +
    ' ' +
    by.toString() +
    ' ' +
    cx.toString() +
    ' ' +
    cy.toString() +
    ', ' +
    cx.toString() +
    ' ' +
    cy.toString() +
    ' ' +
    dx.toString() +
    ' ' +
    dy.toString() +
    ', ' +
    dx.toString() +
    ' ' +
    dy.toString() +
    ' ' +
    ax.toString() +
    ' ' +
    ay.toString();
  return res;
}

// =======================
// Node Creation Functions
// =======================
// Make chromosomes and get snpData from SNP and gene nodes
function makeChroms(cy, genes, logSpacing) {
  // Make an array of important SNP Data for quicker access
  var snpData = [];
  var curSNP = null;
  var curNode = null;

  // Sort the genes first by SNP, then by local degree
  genes = genes.sort(function(a, b) {
    var snpDiff = a
      .data('snp')
      .localeCompare(b.data('snp'), {}, {numeric: true});
    if (snpDiff !== 0) {
      return snpDiff;
    } else {
      return b.data('cur_ldegree') - a.data('cur_ldegree');
    }
  });

  // Run through the list of genes and find the original SNPS
  genes.forEach(function(cur, idx, arr) {
    var curData = cur.data();
    // If this is starting a new SNP, build a new object
    if (curData['snp'] !== curSNP) {
      curSNP = curData['snp'];

      // Save the last one if there was one
      if (curNode !== null) {
        curNode['pos'] = Math.round((curNode['start'] + curNode['end']) / 2);
        curNode['genes'] = cy.collection(curNode['genes']);
        snpData.push(curNode);
      }

      // Build the next one
      curNode = {
        id: curData['snp'],
        chrom: curData['chrom'],
        start: parseInt(curData['start']),
        end: parseInt(curData['end']),
        genes: [cur]
      };
    } else {
      // Update some parameters with another gene
      curNode['start'] = Math.min(parseInt(curData['start']), curNode['start']);
      curNode['end'] = Math.max(parseInt(curData['end']), curNode['end']);
      curNode['genes'].push(cur);
    }
  });
  // Finish off the last node
  curNode['pos'] = Math.round((curNode['start'] + curNode['end']) / 2);
  curNode['genes'] = cy.collection(curNode['genes']);
  snpData.push(curNode);

  // Sort the SNP data by chromosome and position
  snpData = snpData.sort(function(a, b) {
    var chromDiff = a['chrom'].localeCompare(b['chrom'], {}, {numeric: true});
    if (chromDiff !== 0) {
      return chromDiff;
    } else {
      return a['pos'] - b['pos'];
    }
  });

  // Go through the snp data and find the chroms
  var chromNodes = []; // Container for chomosome nodes
  var curNode = null; // Current node being built
  var curChrom = null; // Current chromosome
  var curZero = 0; // Current virtual zero point in BP
  var curPos = 0; // Current Position on literal chromosome
  var curVPos = 0; // Current position on the virtual chromosome
  var dist = 0; // Distance in BP between this SNP and last SNP
  snpData.forEach(function(cur, idx, arr) {
    if (cur['chrom'] !== curChrom) {
      // Unles it is the first run push the node onto the stack
      if (curNode !== null) {
        chromNodes.push(curNode);
      }
      // Set initial values for new chromosome
      curChrom = cur['chrom'];
      curZero = cur['pos'] - 1;
      curPos = 1;
      curVPos = 1;
      curNode = {
        group: 'nodes',
        data: {
          id: cur['chrom'],
          type: 'chrom',
          start: 0,
          end: curVPos
        }
      };
    } else {
      // Find the virtual position along the chrom
      dist = cur['pos'] - curZero - curPos;
      curPos = curPos + dist;
      if (logSpacing) {
        curVPos = Math.round(curVPos + Math.log(dist));
      } else {
        curVPos = Math.round(curVPos + dist);
      }

      // Update the end value
      curNode['data']['end'] = curVPos;
    }
    // Set the virtual position of the SNP
    cur['vpos'] = curVPos;
  });
  // Push the last built node
  chromNodes.push(curNode);
  return {snpData: snpData, chromNodes: chromNodes};
}

// Make SNP groups given the data on chromosomes and snps
function makeSNPGs(snpData, chromData, nodeDiameter) {
  // Containers for derived vals
  var snpNodes = [];

  // Variables for use during processing
  var curNode = null;
  var curChrom = null;
  var totDist = 0;
  var lastPos = 0;
  var idNum = -1;

  // Run through each SNP!
  snpData.forEach(function(cur, idx, arr) {
    totDist = totDist + (cur['vpos'] - lastPos);
    lastPos = cur['vpos'];
    // Need to start a new node
    if (
      cur['chrom'] !== curChrom ||
      totDist >= nodeDiameter * chromData[curChrom]['BPperPX']
    ) {
      // Push the last node, find the position of it in virtual BP
      if (curNode !== null) {
        curNode['data']['pos'] =
          (curNode['data']['start'] + curNode['data']['end']) / 2;
        snpNodes.push(curNode);
      }

      // Set the new intial values
      idNum = idNum + 1;
      totDist = 0;
      curChrom = cur['chrom'];
      curNode = {
        group: 'nodes',
        data: {
          id: 'SNPG:' + idNum.toString(),
          type: 'snpG',
          chrom: curChrom,
          start: lastPos,
          end: lastPos,
          snps: []
        }
      };
    } else {
      // Otherwise just update the end position
      curNode['data']['end'] = lastPos;
    }

    // Update the SNP
    curNode['data']['snps'].push(cur['id']);
    cur['grp'] = 'SNPG:' + idNum.toString();
  });

  // Push the last built node
  curNode['data']['pos'] =
    (curNode['data']['start'] + curNode['data']['end']) / 2;
  snpNodes.push(curNode);

  // Return the stuff!
  return {snpNodes: snpNodes, snpData: snpData};
}