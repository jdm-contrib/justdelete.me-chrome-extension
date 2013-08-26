// Declare the main variables
var sites = {},
// The odd subdomains people append to their site.
subdomains = ['www', 'support', 'mail', 'ssl', 'new', 'cgi1', 'en', 'myaccount', 'meta', 'help', 'support', 'edit'];

function getHostname(url, strict){
	var a = document.createElement('a');
	a.href = url;

	// If we need to do this quickly.
	if(strict != true){
		return a.hostname;
	}
	
	// Quickly strip any odd subdomains off
	for(var i in subdomains){
		url = url.replace('/'+subdomains[i]+'.', '/');
	}
	a.href = url;

	return a.hostname;
}

function updateSites(){
	var req = new XMLHttpRequest();
	req.addEventListener("load", function(e){
		if(this.status == "200"){
			var response = JSON.parse(this.response),
				newSites = {};

			// set up the new sites object.
			for(var i in response){
				// Vine is annoying and uses twitter.com for support.
				if(response[i].name == 'Vine'){
					newSites['vine.co'] = response[i];	
				}else{
					newSites[getHostname(response[i].url, true)] = response[i];	
				}
			}

			sites = newSites;

			// Update our local cache.
			localStorage['sites'] = JSON.stringify(sites);
			localStorage['lastUpdated'] = (new Date() * 1);
		}
	}, false);
	req.open("GET", "https://raw.github.com/rmlewisuk/justdelete.me/master/sites.json", true);
	req.send();
}

// Load the list of supported sites
if(typeof localStorage['sites'] != 'undefined'){
	sites = JSON.parse(localStorage['sites']);

	// If we haven't updated in the last day.
	if(typeof localStorage['lastUpdated'] == "undefined" || localStorage['lastUpdated'] < new Date().setDate(new Date().getDate()-1)){
		updateSites();
	}
}else{
	// Set up a temp sites array
	sites['twitter.com'] = {
		"name" : "Twitter",
		"url" : "https://twitter.com/settings/accounts/confirm_deactivation",
		"difficulty" : "easy"
	};


	// Update the local storage.
	localStorage['sites'] = JSON.stringify(sites);

	// Reload it via AJAX
	updateSites();
}

/**
 * Cycle through the known sites and see if we have dirt on them.
 */
function getInfo(url){
	var hostname = getHostname(url, false);
	for(var i in sites){
		if(hostname.indexOf(i) != -1){
			return sites[i]
		}
	}

	return false;
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(changeInfo.status == 'loading'){
		var info = getInfo(tab.url);
		if(info != false){
			if(typeof info.notes != 'undefined'){
				chrome.pageAction.setTitle({tabId:tabId, title:info.notes});
			}
			chrome.pageAction.setIcon({tabId:tabId, path: '../img/icon_'+info.difficulty+'_38.png'});
			chrome.pageAction.show(tabId);
		}else{
			chrome.pageAction.hide(tabId);
		}
	}
});

chrome.pageAction.onClicked.addListener(function(tab){
	var info = getInfo(tab.url);
	if(info != false){
		chrome.tabs.create({ url: info.url });
	}
});