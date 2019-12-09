/*
 * Generates a lightweight Network graph, using cytoscapeJS, jQuery and jQuery UI.
 * @author: Ajit Singh.
 */
 
 var knetmaps = KNETMAPS.KnetMaps();

 window.onload= function() {
 launchNetwork($('#dataset_dropdown').val());
};

function launchNetwork(jsonFileName) {
	var graphData= "sampleFiles/"+ jsonFileName +".json";
	//console.log("launchNetwork>> dataset: "+ graphData);
	var datasetDescription_text= "sampleFiles/"+ jsonFileName +"_summary.txt";
    try {
	 
	 jQuery.getJSON(graphData, function( data ) {
		 // response contents (pure JSON).
		 var eles_jsons= data.graph.graphJSON.elements;
		 var eles_styles= data.graph.graphJSON.style;
		 var metadata_json= data.graph.allGraphData;
		 knetmaps.draw('#knet-maps', eles_jsons, metadata_json, eles_styles);
		 
		 // add dataset description for end-users.
		 $("#dataset-description").html('<p id="dataset-desc"></p>'); // TODO
		 
		}).fail(function() { // failed: as this is a KnetMiner JSON with JS vars.
			// Include file's contents on the page at runtime using jQuery & a callback function.
			jQuery.getScript(graphData, function() {
				knetmaps.drawRaw('#knet-maps', graphData.graph);
			});
			
			// add dataset description for end-users.
			jQuery.get(datasetDescription_text, function(data) {
				// update dataset description.
				$("#dataset-description").html('<p id="dataset-desc">'+data+'</p>');
			});
			
  });
 
    }
    catch(err) {
          var errorMsg= err.stack+":::"+err.name+":::"+err.message;
          console.log(errorMsg);
         }
}

