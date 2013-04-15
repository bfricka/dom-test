// From MooTools core

(function(){
	var ua = navigator.userAgent.toLowerCase()
		, platform = navigator.platform.toLowerCase()
		, UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0]
		, mode = UA[1] === 'ie' && document.documentMode

	, Browser = {
		name: (UA[1] === 'version') ? UA[3] : UA[1]
		, version: mode || parseFloat((UA[1] === 'opera' && UA[4]) ? UA[4] : UA[2])
		, Platform: {
			name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
		}
		, Features: {
			xpath: !!(document.evaluate),
			air: !!(window.runtime),
			query: !!(document.querySelector),
			json: !!(window.JSON)
		}
	};

	Browser[Browser.name] = true;
	window.Browser = Browser;
}());