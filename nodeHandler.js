var html = "";
var handler = {
    onopentag: function(name, attribs){
    	html+="<" + name;
	    for(key in attribs){
	    	if(key == "src"){
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
    	console.log(html);
    }
};

function getHTML() {
	return html;
}
exports.handler = handler;
exports.getHTML = getHTML;
