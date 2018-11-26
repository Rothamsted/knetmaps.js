/*
 * Generates a lightweight Network graph, using cytoscapeJS, jQuery and jQuery UI.
 * @author: Ajit Singh.
 */
 
 var knetmaps = KNETMAPS.KnetMaps();

 window.onload= function() {
 launchNetwork($('#dataset_dropdown').val());
};

function launchNetwork(jsonFileName) {
	var data= "sampleFiles/"+ jsonFileName +".json";
	//console.log("launchNetwork>> dataset: "+ data);
	var datasetDescription_text= "sampleFiles/"+ jsonFileName +"_summary.txt";
    try {
	
	 // Include this file's contents on the page at runtime using jQuery and a callback function.
     jQuery.getScript(data, function() {
	   knetmaps.drawRaw('#knet-maps', data.graph);
	  });
	  
	 // add dataset description for end-users
     jQuery.get(datasetDescription_text, function(data) {
	   // update dataset description
	   $("#dataset-description").html('<p id="dataset-desc">'+data+'</p>');
	  });
    }
    catch(err) {
          var errorMsg= err.stack+":::"+err.name+":::"+err.message;
          console.log(errorMsg);
         }
}

