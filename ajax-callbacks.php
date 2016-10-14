<?php 

add_action( 'wp_ajax_deactivate_plugin', 'deactivate_plugin_callback' );
function deactivate_plugin_callback() {

	$nonce = $_POST['deactivateNonce'];
 
	if ( ! wp_verify_nonce( $nonce, 'deactivatePluginNonce' ) ) {
		wp_die( 'Busted!');
	}

	if ( current_user_can( 'manage_options' ) ) {
		$plugin = $_POST['plugin'];

		deactivate_plugins($plugin);
		$response = json_encode( array( 'success' => true ) );

		header( "Content-Type: application/json" );
		echo $response;
	}

	wp_die();
}




 ?>