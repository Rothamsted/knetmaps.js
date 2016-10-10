/*
 * Generates a lightweight Network graph, using cytoscapeJS and jQuery.
 * @author: Ajit Singh.
 */

function activateButton(option){
$('.resultViewer:visible').fadeOut(0,function(){
		$('.button_off').attr('class','button_on');
		$('#'+option).fadeIn();
		$('#'+option+'_button').attr('class','button_off');
	});
}

function launchNetwork(jsonFileName) {
    // Add notification to the loading div.
    $("#loadingNetworkDiv").html("Loading, please wait...");

    var jsonFile= jsonFileName; // the JSON file received from index.html.
    console.log("generateCyJSNetwork>> input dataset: "+ jsonFile);

    try {
        $(/*"#knetmaps-menu"*/"#knet-maps").css("display","block"); // show the KNETviewer menubar.

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
