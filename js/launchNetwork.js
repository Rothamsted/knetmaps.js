/*
 * Generates a lightweight Network graph, using cytoscapeJS, jQuery and jQuery UI.
 * @author: Ajit Singh.
 */
window.onload= function() {
 launchNetwork($('#dataset_dropdown').val());
}

function launchNetwork(jsonFileName) {
    var jsonFile= jsonFileName; // the JSON file selected by the user.
	//console.log("generateCyJSNetwork>> input dataset: "+ jsonFile);
    try {
        // Show maskloader.
        showNetworkLoader();

        // Generate the Network Graph after the page load event.
        generateNetworkGraph(jsonFile);
        
        // Remove maskloader.
        removeNetworkLoader();
       }
    catch(err) {
          var errorMsg= err.stack;
          console.log("Error: <br/>"+"Details: "+ errorMsg);
         }
}
