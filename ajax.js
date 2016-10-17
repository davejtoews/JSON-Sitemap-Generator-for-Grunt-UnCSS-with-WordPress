function deactivatePlugin(plugin) {
	(function($) {
		var data = {
			'action'			: 'deactivate_plugin',
			'plugin'			: plugin,
			'deactivateNonce'	: diffAjax.deactivateNonce
		}
		$.post(diffAjax.ajaxurl, data, function(response) {
			console.log(response);
		});
	})(jQuery);
}

function deactivateHandler() {
	(function($) {
		var plugin = $('#pluginName').val();
		deactivatePlugin(plugin);
	})(jQuery);
}

function activatePlugin(plugin) {
	(function($) {
		var data = {
			'action'			: 'activate_plugin',
			'plugin'			: plugin,
			'activateNonce'		: diffAjax.activateNonce
		}
		$.post(diffAjax.ajaxurl, data, function(response) {
			console.log(response);
		});
	})(jQuery);
}

function activateHandler() {
	(function($) {
		var plugin = $('#pluginName').val();
		activatePlugin(plugin);
	})(jQuery);
}


function connectToDiffServer() {
	(function($) {
		var server = $('#serverUrl').val();
		var data = {
			'rootUrl'	: diffAjax.rootUrl,
			'sitemapUrl': diffAjax.sitemapUrl
		}

		serverLog("Connecting...");
		$.post(server, data, function(response) {
			console.log(response);
			serverLog("Connected.");
		});
	})(jQuery);
}

function requestScrape() {
	(function($) {
		var server = $('#serverUrl').val() + '/scrape';
		var data = {
			'rootUrl'	: diffAjax.rootUrl,
			'sitemapUrl': diffAjax.sitemapUrl
		}
		serverLog("Scraping...");
		$.post(server, data, function(response) {
			console.log(response);
			serverLog("Scraped.")
		});
	})(jQuery);
}

function requestBranch(branch) {
	(function($) {
		var server = $('#serverUrl').val() + '/checkout';
		var path = $('#muPath').val();
		var data = {
			'path' : path,
			'branch' : branch
		}
		serverLog("Creating Branch: " + branch);
		$.post(server, data, function(response) {
			console.log(response);
			serverLog(response);
		});
	})(jQuery);
}

function activateHandler() {
	(function($) {
		var branch = $('#branch').val();
		requestBranch(branch);
	})(jQuery);
}

function requestCommit() {
	(function($) {
		var server = $('#serverUrl').val() + '/commit';
		var path = $('#muPath').val();
		var data = {
			'path' : path
		}
		serverLog("Comitting...");
		$.post(server, data, function(response) {
			if(!response.error) {
				serverLog(response);
			} else {
				serverLog("Not Committed");
			}
			
		});		
	})(jQuery);
}

function autoDiff() {
	var plugins = getPluginList();

	var diffQueue = [];
	diffQueue = addToDiffQueue(diffQueue, 'master');
	diffQueue = addToDiffQueue(diffQueue, 'control');

	plugins.forEach(function(plugin) {
		var branch = getBranchName(plugin);
		diffQueue = addToDiffQueue(diffQueue, branch, plugin);
	});

	console.log(diffQueue);
}

function addToDiffQueue(queue, branch, plugin=false) {
	queue.push({
		'branch': branch,
		'plugin': plugin
	});

	return queue;
}

function getBranchName(pluginPath) {
	pathArray = pluginPath.split("/");

	return pathArray[0];
}

function serverLog(newItem, newLine = "\n") {
	(function($) {
		var log = $('#serverLog').val() + newItem + newLine;
		$('#serverLog').val(log);
	})(jQuery);
}

function getPluginList() {
	var plugins = [];

	for (var key in diffAjax.pluginList) {
		plugins.push(diffAjax.pluginList[key]);
	}

	return plugins;
}















