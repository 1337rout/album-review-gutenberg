<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function album_review_cgb_block_assets()
{ // phpcs:ignore
	// Register block styles for both frontend + backend.
	$asset_file = include_once dirname(__FILE__) . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'build' . DIRECTORY_SEPARATOR . 'index.asset.php';
	wp_register_style(
		'album_review-cgb-style-css', // Handle.
		plugins_url('build/style-index.css', dirname(__FILE__)), // Block style CSS.
		is_admin() ? array('wp-editor') : null, // Dependency to include the CSS after it.
		$asset_file['version']
	);

	// Register block editor script for backend.
	wp_register_script(
		'album_review-cgb-block-js', // Handle.
		plugins_url('/build/index.js', dirname(__FILE__)), // Block.build.js: We register the block here. Built with Webpack.
		$asset_file['dependencies'],
		$asset_file['version'], 
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'album_review-cgb-block-editor-css', // Handle.
		plugins_url('build/style-index.css', dirname(__FILE__)), // Block editor CSS.
		array('wp-edit-blocks'), // Dependency to include the CSS after it.
		$asset_file['version']
	);

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
	wp_localize_script(
		'album_review-cgb-block-js',
		'cgbGlobal', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path(__DIR__),
			'pluginDirUrl' => plugin_dir_url(__DIR__),
			'lastFmApiKey' => get_option('album_review_last_fm_api_key', ''),
			// Add more data here that you want to access from `cgbGlobal` object.
		]
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'cgb/block-album-review',
		array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style' => 'album_review-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'album_review-cgb-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style' => 'album_review-cgb-block-editor-css',
			// Render the block on the front end with PHP.
			'render_callback' => 'render_album_review',
			//Setup Attributes for the Dynamic Function.
			'attributes' => [
				'albumTitle' => [
					'type' => 'string',
				],
				'albumArtist' => [
					'type' => 'string',
				],
				'albumGenre' => [
					'type' => 'array',
				],
				'albumRating' => [
					'type' => 'number',
					'default' => 3,
				],
				'albumCoverArtUri' => [
					'type' => 'string',
				],
				'albumReleaseDate' => [
					'type' => 'string',
				],
			]

		)
	);

}



// Hook: Block assets.
add_action('init', 'album_review_cgb_block_assets');

//
/**
 * Setup Options Page.
 */

class AlbumReviewSettings
{
	private $album_review_last_fm_api_key;

	public function __construct()
	{
		add_action('admin_menu', array($this, 'album_review_settings_add_plugin_page'));
		add_action('admin_init', array($this, 'album_review_settings_page_init'));
	}

	public function album_review_settings_add_plugin_page()
	{
		add_options_page(
			'Album Review Settings', // page_title
			'Album Review Settings', // menu_title
			'manage_options', // capability
			'album-review-settings', // menu_slug
			array($this, 'album_review_settings_create_admin_page') // function
		);
	}

	public function album_review_settings_create_admin_page()
	{
		$this->album_review_last_fm_api_key = get_option('album_review_last_fm_api_key', ''); ?>

		<div class="wrap">
			<h2>Album Review Settings</h2>
			<?php if (empty($this->album_review_last_fm_api_key)): ?>
				<p>Last.FM API Key is needed. </p>
			<?php endif; ?>
			<?php settings_errors(); ?>

			<form method="post" action="options.php">
				<?php
				settings_fields('album_review_settings_option_group');
				do_settings_sections('album-review-settings-admin');
				submit_button();
				?>
			</form>
		</div>
	<?php }

	public function album_review_settings_page_init()
	{
		register_setting(
			'album_review_settings_option_group', // option_group
			'album_review_last_fm_api_key', // option_name
			array($this, 'album_review_settings_sanitize') // sanitize_callback
		);

		add_settings_section(
			'album_review_settings_setting_section', // id
			'Settings', // title
			array($this, 'album_review_settings_section_info'), // callback
			'album-review-settings-admin' // page
		);

		add_settings_field(
			'last_fm_api_key_0', // id
			'Last.FM API Key', // title
			array($this, 'last_fm_api_key_0_callback'), // callback
			'album-review-settings-admin', // page
			'album_review_settings_setting_section' // section
		);
	}

	public function album_review_settings_sanitize($input)
	{
		return sanitize_text_field($input);
	}

	public function album_review_settings_section_info()
	{

	}

	public function last_fm_api_key_0_callback()
	{
		printf(
			'<input class="regular-text" type="text" name="album_review_last_fm_api_key" id="last_fm_api_key_0" value="%s">',
			isset($this->album_review_last_fm_api_key) ? esc_attr($this->album_review_last_fm_api_key) : ''
		);
	}

}
if (is_admin())
	$album_review_settings = new AlbumReviewSettings();
//function to render the Album Review Gutenber Block Dynamically.
function render_album_review($attributes)
{
	ob_start();
	?>
	<div class="album-review">
		<div class="album-cover-cont">
			<img
				src="<?php echo !empty($attributes['albumCoverArtUri']) ? $attributes['albumCoverArtUri'] : 'https://picsum.photos/174/174'; ?>">
		</div>
		<div class="album-details">
			<h3 class="album-name-author">
				<strong><?php echo !empty($attributes['albumTitle']) ? $attributes['albumTitle'] : 'Lorem Ipsum'; ?></strong>
				<?php if (!empty($attributes['albumArtist'])): ?>
					by <?php echo $attributes['albumArtist']; ?>
				<?php endif; ?>
			</h3>
			<?php if (!empty($attributes['albumReleaseDate'])): ?>
				<p class="album-release-date">Released: <?php echo $attributes['albumReleaseDate']; ?></p>
			<?php endif;
			?>
			<?php if (!empty($attributes['albumGenre'])): ?>
				<p class="album-genre"><?php echo join(', ', $attributes['albumGenre']); ?></p>
			<?php endif; ?>
			<div class="album-rating">
				<?php
				$rating = $attributes['albumRating'];

				if ($rating) {
					$average_stars = round($rating * 2) / 2;

					$drawn = 5;

					echo '<div class="star-rating">';

					// full stars.
					for ($i = 0; $i < floor($average_stars); $i++) {
						$drawn--;
						echo '<svg aria-hidden="true" data-prefix="fas" data-icon="star" class="svg-inline--fa fa-star fa-w-18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/></svg>';
					}

					// half stars.
					if ($rating - floor($average_stars) === 0.5) {
						$drawn--;
						echo '<svg aria-hidden="true" data-prefix="fas" data-icon="star-half-alt" class="svg-inline--fa fa-star-half-alt fa-w-17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 536 512"><path fill="currentColor" d="M508.55 171.51L362.18 150.2 296.77 17.81C290.89 5.98 279.42 0 267.95 0c-11.4 0-22.79 5.9-28.69 17.81l-65.43 132.38-146.38 21.29c-26.25 3.8-36.77 36.09-17.74 54.59l105.89 103-25.06 145.48C86.98 495.33 103.57 512 122.15 512c4.93 0 10-1.17 14.87-3.75l130.95-68.68 130.94 68.7c4.86 2.55 9.92 3.71 14.83 3.71 18.6 0 35.22-16.61 31.66-37.4l-25.03-145.49 105.91-102.98c19.04-18.5 8.52-50.8-17.73-54.6zm-121.74 123.2l-18.12 17.62 4.28 24.88 19.52 113.45-102.13-53.59-22.38-11.74.03-317.19 51.03 103.29 11.18 22.63 25.01 3.64 114.23 16.63-82.65 80.38z"/></svg>';
					}

					// empty stars.
					for ($i = 0; $i < $drawn; $i++) {
						echo '<svg aria-hidden="true" data-prefix="far" data-icon="star" class="svg-inline--fa fa-star fa-w-18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"/></svg>';
					}

					echo '</div>';
				}
				?>
			</div>
		</div>
	</div>
	<?php
	return ob_get_clean();
}

