/* Messages used by this command */	
var bitly_msg= {
	description: "Shorten a long URL using Bit.ly API",
		shorturl : "Short URL",
		generalerror: "<b>WARNING:</b> Service is not available",
		invalidurl: "Invalid Url Format"
}
	
/* There is a bug in Ubiquity under windows with selection and copy in clipboard of text from preview. For this reason I put the shortened url in clipboard */

function  copyToClipboard(str) {
			const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
			.getService(Components.interfaces.nsIClipboardHelper);
			gClipboardHelper.copyString(str);
}

CmdUtils.CreateCommand({
	name: "bitly",
	icon: "http://bit.ly/favicon.ico",
	homepage: "http://www.gialloporpora.netsons.org",
	author: { name: "Sandro Della Giustina", email: "sandrodll@yahoo.it"},
	license: "MPL,GPL",
	description: bitly_msg.description,
	help: 'Short a long URL using Bitly API.  Command require no input, only type it and it return the shortened  URL of  current page',
	_isUrl : function ( url ) {
		var regex=/http|https|ftp:\/\/[^"\s]/;
			if (url.search(regex)==-1) return "false";
			else return "vero";
		},
			
	preview: function( pblock ) {
		var url=CmdUtils.getDocument().location.href;
		var html=bitly_msg.description;
		html+='<br><em>'+url+'</em><br>';
		var questo=this;
		CmdUtils.previewAjax(pblock, {
			type: 'GET',
			url:  " http://api.bit.ly/shorten",
			data: {version : "2.0.1",
				login: "gialloporpora",
				apiKey : "R_d7b1cb733163eff7887128b54d51eb79",
				longUrl: url },

			dataType: "json",
			error: function(){
			pblock.innerHTML=bitly_msg.generalerror;
		},
		success: function  (data){
			html+='<br/>Short URL:</b><br/><br>';
		CmdUtils.log(data)
		if (data.results[url]){
				html+='<input  type="text" style="font-weight: bold; color: green; -moz-border-radius: 2em";  value="'+data.results[url].shortUrl+'" accesskey="s"/><br>';
				if (typeof(copyToClipboard)=='function') copyToClipboard( data.results[url].shortUrl );
		}
		else html+=bitly_msg.invalidurl;
		
				pblock.innerHTML=html;
			}
		});
	}
});