function deactivatePlugin(plugin, queue = false) {
	(function($) {
		var data = {
			'action'			: 'deactivate_plugin',
			'plugin'			: plugin,
			'deactivateNonce'	: diffAjax.deactivateNonce
		}
		$.post(diffAjax.ajaxurl, data, function(response) {
			console.log(response);
			if(queue) {
				updateQueue(queue, 'deactivated');
			}
		});
	})(jQuery);
}

function deactivateHandler() {
	(function($) {
		var plugin = $('#pluginName').val();
		deactivatePlugin(plugin);
	})(jQuery);
}

function activatePlugin(plugin, queue = false) {
	(function($) {
		var data = {
			'action'			: 'activate_plugin',
			'plugin'			: plugin,
			'activateNonce'		: diffAjax.activateNonce
		}
		console.log('activating');
		$.post(diffAjax.ajaxurl, data, function(response) {
			console.log(response);
			if(queue) {
				updateQueue(queue, 'activated');
			}
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
			if (response.muPath) {
				$('#muPath').val(response.muPath);
				serverLog("Connected.");
				$('.enableOnConnect').prop('disabled', false);				
			}

		});
	})(jQuery);
}

function requestScrape(queue = false) {
	(function($) {
		var server = $('#serverUrl').val() + '/scrape';
		var data = {
			'rootUrl'	: diffAjax.rootUrl,
			'sitemapUrl': diffAjax.sitemapUrl
		}
		serverLog("Scraping...");
		$.post(server, data, function(response) {
			console.log(response);
			if(queue) {
				updateQueue(queue, 'scraped');
			}
		});
	})(jQuery);
}

function requestBranch(branch, queue = false) {
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
			if(queue) {
				updateQueue(queue, 'branched');
			}
		});
	})(jQuery);
}

function branchHandler() {
	(function($) {
		var branch = $('#branch').val();
		requestBranch(branch);
	})(jQuery);
}

function requestCommit(queue = false ) {
	(function($) {
		var server = $('#serverUrl').val() + '/commit';
		var path = $('#muPath').val();
		var data = {
			'path' : path
		}
		serverLog("Comitting...");
		$.post(server, data, function(response) {
			console.log(response);
			if(queue) {
				updateQueue(queue, 'committed');
			}
			
		});		
	})(jQuery);
}

function autoCommit() {
	var plugins = getPluginList();

	var queue = [];
	queue = addToCommitQueue(queue, 'master');
	queue = addToCommitQueue(queue, 'control');

	plugins.forEach(function(plugin) {
		var branch = getBranchName(plugin);
		queue = addToCommitQueue(queue, branch, plugin);
	});
	console.log(queue);
	processCommitQueue(queue);
}

function addToCommitQueue(queue, branch, plugin=false) {
	queue.push({
		'branch': branch,
		'plugin': plugin
	});

	return queue;
}

function processCommitQueue(queue) {
	if(queue.length) {
		
		commit = queue[0];

		if (!commit.status) {
			requestBranch(commit.branch, queue);
		} else {
			switch (commit.status) {
				case "branched":
					if (commit.plugin) {
						deactivatePlugin(commit.plugin, queue);
					} else {
						requestScrape(queue);
					}
					break;
				case "deactivated": 
					requestScrape(queue);
					break;
				case "scraped": 
					requestCommit(queue);
					break;
				case "committed":
					if (commit.plugin) {
						activatePlugin(commit.plugin, queue);
					} else {
						updateQueue(queue, 'done');
					}
					break;
				case "activated": 
					updateQueue(queue, 'done')
					break;
				case "done":
					queue.splice(0, 1);
					processCommitQueue(queue);
					break;					
			}
		}
	}
}

function updateQueue(queue, status) {
	queue[0].status = status;
	console.log(queue);
	serverLog(queue[0].branch + " : " + queue[0].status);
	processCommitQueue(queue);
}

function getBranchName(pluginPath) {
	pathArray = pluginPath.split("/");

	return pathArray[0];
}

function serverLog(newItem, newLine = "\n") {
	(function($) {
		var log = $('#serverLog').val() + newItem + newLine;
		$('#serverLog').val(log);
		$('#serverLog').scrollTop($('#serverLog')[0].scrollHeight);
	})(jQuery);
}

function getPluginList() {
	var plugins = [];

	for (var key in diffAjax.pluginList) {
		plugins.push(diffAjax.pluginList[key]);
	}

	return plugins;
}

function getTest() {
	(function($) {
		var server = $('#serverUrl').val() + '/test';
		var htaUser = $('#htaUser').val();
		var htaPass = $('#htaPass').val();
		var path = $('#muPath').val();
		var data = {
			'path' : path
		}
		serverLog("Testing...");	
		$.ajax({
		  type: "POST",
		  url: server,
		  data: data,
		  success: function(resonse) {
		  	console.log(response);
		  }
		});		
	})(jQuery);	
}















