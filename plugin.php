<?php
/**
 * Plugin Name: Album Review - A Gutenberg Block
 * Plugin URI: https://github.com/ahmadawais/create-guten-block/
 * Description: Album Review - It's a Gutenberg Block with Last.FM API intergration.
 * Author: Brian Routzong
 * Author URI: https://AhmadAwais.com/
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';