var html = "";
var uOb = {};
var handler = {
    onopentag: function(name, attribs){
    	//console.log("node");
    	html+="<" + name;
	    for(key in attribs){
	    	if(key == "src" || key == "href"){
	    		//console.log("src...");
	    		// relative url ... 
	    		if(attribs[key].indexOf("/") != 0 && attribs[key].indexOf("http") != 0 ){
	    			attribs[key] = uOb.protocol+"//"+uOb.hostname+attribs[key] + "/";
	    		}
	    		else if(attribs[key].indexOf("/") == 0){
	    			attribs[key] = uOb.protocol+"//"+uOb.hostname+attribs[key];
	    		}
	    		else if(attribs[key].indexOf("//") == 0){
	    			attribs[key] = uOb.protocol+attribs[key];
	    		}	    		
	    		html+=" " +key+"='https://localhost:8080/?url="+encodeURIComponent(attribs[key])+"'";
	    	}
	    	else{
	            html+=" " +key+"='"+attribs[key]+"'";
			}
        }   
    	html+=">";
    },
    ontext: function(text){
        html+=text;
    },
    onclosetag: function(name){
    	html+="</" + name + ">";
    },
    onend: function(){
    	console.log("parsing done.");
    },
    onreset: function(){
    	html="";
    }
};

function getHTML() {
	return html;
};
function setContext(urlObj) {
	uOb = urlObj;
}
exports.handler = handler;
exports.getHTML = getHTML;
exports.setContext = setContext;