/*
 * Generates a lightweight Network graph, using cytoscapeJS, jQuery and jQuery UI.
 * @author: Ajit Singh.
 */
window.onload= function() {
 // Add KnetMaps menu bar
 var knet_menu= "<input type='image' id='maximizeOverlay' src='image/maximizeOverlay.png' title='Toggle full screen' onclick='OnMaximizeClick();' onmouseover='onHover($(this));' onmouseout='offHover($(this));'>"+
                    "<input type='image' id='showAll' src='image/showAll.png' onclick='showAll();' title='Show all the concept & relations in the Network' onmouseover='onHover($(this));' onmouseout='offHover($(this));'>"+
                    "<input type='image' id='relayoutNetwork' src='image/relayoutNetwork.png' onclick='rerunLayout();' title='Re-run the Layout' onmouseover='onHover($(this));' onmouseout='offHover($(this));'>"+
                    "<input type='image' id='openItemInfoBtn' src='image/openItemInfoBtn.png' onclick='popupItemInfo();' title='Show Info box' onmouseover='onHover($(this));' onmouseout='offHover($(this));'>"+
                    "<span class='knet-dropdowns'>"+
                        "<select id='layouts_dropdown' class='knet-dropdowns' onChange='rerunLayout();' title='Select network layout'>"+
                            "<option value='Cose_layout' selected='selected' title='using CoSE layout algorithm (useful for larger networks with clustering)'>CoSE layout</option>"+
                            "<option value='ngraph_force_layout' title='using ngraph_force layout (works well on planar graphs)'>Force layout</option>"+
                            "<option value='Circle_layout'>Circular layout</option>"+
                            "<option value='Concentric_layout'>Concentric layout</option>"+
                            "<option value='Cose_Bilkent_layout' title='using CoSE-Bilkent layout (with node clustering, but performance-intensive for larger networks)'>CoSE-Bilkent layout</option>"+
                        "</select>"+
                        "<select id='changeLabelVisibility' class='knet-dropdowns' onChange='showHideLabels(this.value);' title='Select label visibility'>"+
                            "<option value='None' selected='selected'>Labels: None</option>"+
                            "<option value='Concepts'>Labels: Concepts</option>"+
                            "<option value='Relations'>Labels: Relations</option>"+
                            "<option value='Both'>Labels: Both</option>"+
                        "</select>"+
                        "<select id='changeLabelFont' class='knet-dropdowns' onChange='changeLabelFontSize(this.value);' title='Select label font size'>"+
                            "<option value='8'>Label size: 8px</option>"+
                            "<option value='12'>Label size: 12px</option>"+
                            "<option value='16' selected='selected'>Label size: 16px</option>"+
                            "<option value='20'>Label size: 20px</option>"+
                            "<option value='24'>Label size: 24px</option>"+
                            "<option value='28'>Label size: 28px</option>"+
                            "<option value='32'>Label size: 32px</option>"+
                            "<option value='36'>Label size: 36px</option>"+
                            "<option value='40'>Label size: 40px</option>"+
                        "</select>"+
			        "</span>"+
                    "<input type='image' id='resetNetwork' src='image/resetNetwork.png' onclick='resetGraph();' title='Reposition (reset and re-fit) the graph' onmouseover='onHover($(this));' onmouseout='offHover($(this));'>"+
                    "<input type='image' id='savePNG' src='image/savePNG.png' onclick='exportAsImage();' title='Export the network as a .png image' onmouseover='onHover($(this));' onmouseout='offHover($(this));'>"+
                    "<input type='image' id='saveJSON' src='image/saveJSON.png' onclick='exportAsJson();' title='Export the network in JSON format' onmouseover='onHover($(this));' onmouseout='offHover($(this));'>"+
                    "<input type='image' id='helpURL' src='image/help.png' onclick='openKnetHelpPage();' title='Go to help documentation' onmouseover='onHover($(this));' onmouseout='offHover($(this));'>";
 $('#knetmaps-menu').html(knet_menu);

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
