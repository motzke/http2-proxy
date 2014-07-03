var htmlparser = require("htmlparser2");
var parser = new htmlparser.Parser({
    onopentag: function(name, attribs){
        console.log(attribs);
	    for(key in attribs){
            console.log(key+" " +attribs[key]);
        }   
        if(name === "script" && attribs.type === "text/javascript"){
            console.log("JS! Hooray!");
        }
    },
    ontext: function(text){
        console.log("-->", text);
    },
    onclosetag: function(tagname){
        if(tagname === "script"){
            console.log("That's it?!");
        }
    }
});
parser.write("Xyz <script type='text/javascript'>var foo = '<<bar>>';</ script>");
parser.end();
