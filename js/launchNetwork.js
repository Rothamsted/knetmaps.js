/*
 * Generates a lightweight Network graph, using cytoscapeJS, jQuery and jQuery UI.
 * @author: Ajit Singh.
 */
window.onload= function() {
 launchNetwork($('#dataset_dropdown').val());
}

function launchNetwork(jsonFileName) {
    // Add notification to the loading div.
    $("#loadingNetworkDiv").html("Loading, please wait...");

    var jsonFile= jsonFileName; // the JSON file received from index.html.
	console.log("generateCyJSNetwork>> input dataset: "+ jsonFile);

    try {
        // Show maskloader.
        showNetworkLoader();

        // Generate the Network Graph after the page load event.
        generateNetworkGraph(jsonFile);
        
        // Remove maskloader.
        removeNetworkLoader();

        // Remove the preloader message for the new Network Viewer
	    $("#loadingNetworkDiv").replaceWith('<div id="loadingNetworkDiv"></div>');
        
        activateButton('NetworkCanvas');
       }
    catch(err) {
          var errorMsg= err.stack;
          console.log("Error: <br/>"+"Details: "+ errorMsg);
         }
}
