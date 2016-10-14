function deactivatePlugin() {
	(function($) {
		var plugin = $('#pluginName').val();
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

function activatePlugin() {
	(function($) {
		var plugin = $('#pluginName').val();
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

function requestBranch() {
	(function($) {
		var server = $('#serverUrl').val() + '/checkout';
		var branch = $('#branch').val();
		var path = $('#muPath').val();
		var data = {
			'path' : path,
			'branch' : branch
		}
		serverLog("Branching...");
		$.post(server, data, function(response) {
			console.log(response);
			serverLog(response);
		});
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
			console.log(response);
			serverLog(response);
		});		
	})(jQuery);
}

function serverLog(newItem) {
	(function($) {
		var log = $('#serverLog').val() + newItem + "\n";
		$('#serverLog').val(log);
	})(jQuery);
}