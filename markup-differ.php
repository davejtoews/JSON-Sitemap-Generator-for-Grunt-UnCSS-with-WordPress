<?php
/**
 * Plugin Name: Plugin Markup Differ
 * Plugin URI: https://github.com/davejtoews/Wordpress-Plugin-Markup-Differ
 * Description: Programatically turn plugins on and off to allow remote server to diff markup. Sitemap code forked from https://github.com/phoenixMag00/JSON-Sitemap-Generator-for-Grunt-UnCSS-with-WordPress
 * Author: Dave J Toews
 * Author URI: http://davejtoews.com
 * Version: 0.1
 */
 
require( plugin_dir_path( __FILE__ ) . 'sitemap.php');
require( plugin_dir_path( __FILE__ ) . 'ajax-callbacks.php');

add_action( 'admin_menu', 'markup_differ_admin_menu' );

function printPre($object) {
	echo "<pre>";
	print_r($object);
	echo "</pre>";
}

function markup_differ_admin_menu() {
	add_management_page( 'Markup Differ', 'Markup Differ', 'manage_options', 'markup_differ', 'markup_differ_admin_page' ); 
}

add_action('admin_enqueue_scripts', 'enqueue_ajax_plugin_functions');

function enqueue_ajax_plugin_functions() {
	wp_enqueue_script('ajax-plugin-functions', plugin_dir_url(__FILE__) . 'ajax.js');

	wp_localize_script( 'ajax-plugin-functions', 'diffAjax', array(
		'ajaxurl'          	=> admin_url( 'admin-ajax.php' ),
		'deactivateNonce' 	=> wp_create_nonce( 'deactivatePluginNonce' ),
		'activateNonce' 	=> wp_create_nonce( 'activatePluginNonce' ),
		'rootUrl'			=> site_url(),
		'sitemapUrl'		=> site_url() . '/?show_sitemap',
		'pluginList'		=> get_other_plugin_list()
		)
	);
}


function markup_differ_admin_page() {
	$plugins = get_other_plugin_list();

	printPre($plugins); 
	?>

	<input type="text" id="pluginName" name="pluginName">
	<br>
	<input type="button" onclick="deactivateHandler();" value="Deactivate">
	<input type="button" onclick="activateHandler();" value="Activate">

	<form>
		<label for="serverUrl">Server Url</label>
		<input type="text" id="serverUrl" name="serverUrl">
		<br>
		<label for="muPath">Markup Path</label>
		<input type="text" id="muPath" name="muPath">
		<br>
		<label for="branch">Branch</label>
		<input type="text" id="branch" name="branch">
		<br>
		<input type="button" onclick="connectToDiffServer();" value="Connect">	
		<input type="button" onclick="requestScrape()" value="Scrape">
		<input type="button" onclick="branchHandler()" value="Branch">
		<input type="button" onclick="requestCommit()" value="Commit">
		<br>
		<input type="button" onclick="autoDiff()" value="autoDiff">
	</form>

	<textarea name="serverLog" id="serverLog" cols="60" rows="20"></textarea>



<?php }

function get_other_plugin_list() {
	$plugins = get_option('active_plugins');
	return array_filter($plugins, 'is_plugin_not_current_plugin');	
}

function is_plugin_not_current_plugin($plugin) {
	if($plugin == basename( __DIR__ ) . '/' . basename(__FILE__)) {
		return false;
	} else {
		return true;
	}
}

?>