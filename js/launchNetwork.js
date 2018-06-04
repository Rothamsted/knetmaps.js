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
    try {
	
	 // Include this file's contents on the page at runtime using jQuery and a callback function.
     jQuery.getScript(data, function() {
	   knetmaps.draw('#knet-maps', data.graph);
	  });
    }
    catch(err) {
          var errorMsg= err.stack+":::"+err.name+":::"+err.message;
          console.log(errorMsg);
         }
}
