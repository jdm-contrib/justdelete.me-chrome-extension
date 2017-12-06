// Declare the main variables
var sites = {},
// The odd subdomains people append to their site.
subdomains = ['www', 'support', 'mail', 'ssl', 'new', 'cgi1', 'en', 'myaccount', 'meta', 'help', 'support', 'edit'];


function updateSites(){
	var req = new XMLHttpRequest();
	req.addEventListener("load", function(e){
		if(this.status == "200"){
			sites = JSON.parse(this.response);

			// Update our local cache.
			localStorage['sites'] = JSON.stringify(sites);
			localStorage['lastUpdated'] = (new Date() * 1);
		}
	}, false);
	req.open("GET", "https://raw.githubusercontent.com/jdm-contrib/justdelete.me/master/sites.json", true);
	req.send();
}

function runUpdater(){
  // Load the list of supported sites
  if(typeof localStorage['sites'] != 'undefined'){
    sites = JSON.parse(localStorage['sites']);

    // If we haven't updated in the last day.
    if(typeof localStorage['lastUpdated'] == "undefined" || localStorage['lastUpdated'] < new Date().setDate(new Date().getDate()-1)){
      updateSites();
    }
  }else{
    // Reload it via AJAX
    updateSites();
  }
}

// Turns url string into just the hostname.
function getHostname(url, opts_strict){
	var a = document.createElement('a');
	a.href = url;

  if(opts_strict == true){
    return a.hostname;
  }

	// Quickly strip any odd subdomains off
	for(var i in subdomains){
		url = url.replace('/'+subdomains[i]+'.', '/');
	}
	a.href = url;

	return a.hostname;
}

/**
 * Cycle through the known sites and see if we have dirt on them.
 */
function getInfo(url){
  // Start with a strict search
	var hostname = getHostname(url, true);

	for(var i in sites){
    var site = sites[i];

    for(var d in site.domains){
      var domain = site.domains[d];
      if(domain.indexOf(hostname) != -1){
        return site;
      }
    }
	}

  // do a less strict search
	hostname = getHostname(url, false);
	for(var i in sites){
    var site = sites[i];

    for(var d in site.domains){
      var domain = site.domains[d];
      if(domain.indexOf(hostname) != -1){
        return site;
      }
    }
	}

	return false;
}

runUpdater();

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(changeInfo.status == 'loading'){
		var info = getInfo(tab.url);
		if(info != false){
			if(typeof info.notes != 'undefined'){
				chrome.pageAction.setTitle({tabId:tabId, title: info.name + ': ' + info.notes});
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
