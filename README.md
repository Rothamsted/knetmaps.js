
# KnetMaps.js
Interactive network visualisation tool for exploration of heterogeneous biological knowledge graphs.

KnetMaps **paper** at https://f1000research.com/articles/7-1651/v1.

![KnetMaps_screenshot](https://raw.githubusercontent.com/Rothamsted/knetmaps.js/master/docs/knetmaps2.2.0.png)

**Note**:
- KnetMaps feature documentation is available, for new users, in the [User_Guide](docs/User_Guide.md)
- How to use **KnetMaps** in a static web page is explained in the [QuickStart_Guide](docs/QuickStart_Guide.md)
- A more detailed explanation on how to customize network datasets and stylesheets is available in the [Technical_Guide](docs/Technical_Guide.md)
- To explore KnetMaps and its features, check out this [Demo example](http://knetminer.rothamsted.ac.uk/KnetMaps/). Instructions to use it are available in the 3 aforementioned KnetMaps guide docs.

### For dev users: To build/package and test locally:
- Install Node.js (https://nodejs.org/en/download/) & NPM
- Install Git (https://git-scm.com/)
- Install npm dependencies: `npm install`
- To build: `npm run build`
- Note: Make sure  `Node version >= v12 `
- Note: Our test environment uses `node 12.22.12 and npm 8.10.0`. 


Testing on local PC's is easy and can be done using any lightweight servers like `jetty`, `apache`, `tomcat`, etc. 
`Python3` users can easily install `SimpleHTTPServer` via `pip` and test with that, e.g., on Windows via:

	pip install SimpleHTTPServer
	
	cd D:/<path-to-knetmaps-repo>/ #where our `index.html` is located
	
	python -m http.server 9000 #app should be up on http://localhost:9000/index.html
	
