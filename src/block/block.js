/**
 * BLOCK: album-review
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import "./editor.scss";
import "./style.scss";
import React from "react";
import Rating from '@mui/material/Rating';
import LastFmAlbumSelector from "./LastFmAlbumSelector.js";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { TextControl } = wp.components; // Import TextControl from wp.components
const { ServerSideRender } = wp.editor; // Import ServerSideRender from wp.editor for Dynamic Preview.
const apiKey = cgbGlobal.lastFmApiKey; // Get Our API Key for checks in the Edit Function.

/**
 * Register the Album Review Gutenberg Block.
 *
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType("cgb/block-album-review", {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __("Album Review"), // Block title.
	icon: "album", // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: "media", // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [__("Music"), __("Album"), __("Review")],
	attributes: {
		albumTitle: {
			type: "string",
		},
		albumArtist: {
			type: "string",
		},
		albumGenre: {
			type: "array",
		},
		albumRating: {
			type: "number",
			default: 3,
		},
		albumCoverArtUri: {
			type: "string",
		},
		albumReleaseDate: {
			type: "string",
		},
	},

	/**
	 * Setting up the edit function. This renders all of the functionality on the admin side of the post to edit and save the block.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: (props) => {
		// Setup functions to handle setting attributes on change.
		const onChangeAlbumTitle = (value) => {
			props.setAttributes({
				albumTitle: value.split(","),
			});
		};
		const onChangeAlbumArtist = (value) => {
			props.setAttributes({
				albumArtist: value,
			});
		};
		const onChangeAlbumGenre = (value) => {
			props.setAttributes({
				albumGenre: value,
			});
		};
		const onChangeAlbumRating = (_event, value) => {
			props.setAttributes({
				albumRating: value,
			});
		};
		const onChangeAlbumCovertArtUri = (value) => {
			props.setAttributes({
				albumCoverArtUri: value,
			});
		};
		const onChangeAlbumReleaseDate = (value) => {
			props.setAttributes({
				albumReleaseDate: value,
			});
		};

		const onLastFmSelect = (value) => {
			const releaseDate =
				"wiki" in value ? value.wiki.published.split(",")[0] : "";
			props.setAttributes({
				albumCoverArtUri: value.image[2]["#text"],
				albumArtist: value.artist,
				albumTitle: value.name,
				albumGenre: value.tags.tag.map((tag) => tag.name),
				albumReleaseDate: releaseDate,
			});
		};
		//Hide Last.FM Album Selector if API Key not set.
		let albumChooser;
		if (apiKey) {
			albumChooser = <LastFmAlbumSelector onSelect={onLastFmSelect} />;
		} else {
			albumChooser = (
				<h4>
					Add your Last.FM API Key to use the Album Chooser.
					<br />
					<strong>{`Go to Settings > Album Review Settings`}</strong>
				</h4>
			);
		}
		//Render the Gutenberg Block in admin
		return (
			<div className={props.className}>
				{albumChooser}
				<div className="admin-manual-enter">
					<div className="admin-album-60">
						Album Name
						<TextControl
							placeholder={__("Album Name")}
							value={props.attributes.albumTitle}
							onChange={onChangeAlbumTitle}
						/>
					</div>
					<div className="admin-album-40">
						Album Artist
						<TextControl
							placeholder={__("Album Artist")}
							value={props.attributes.albumArtist}
							onChange={onChangeAlbumArtist}
						/>
					</div>
					<div className="admin-album-60">
						Album Genre (comma separated)
						<TextControl
							placeholder={__("Album Genre")}
							value={props.attributes.albumGenre}
							onChange={onChangeAlbumGenre}
						/>
					</div>
					<div className="admin-album-40">
						Album Rating
						<Rating
							name="Album Rating"
							value={
								props.attributes.albumRating
							} /* number of selected icon (`0` - none, `1` - first) */
							onChange={onChangeAlbumRating} /* on icon click handler */
						/>
					</div>
					<div className="admin-album-60">
						Album Cover Art URI
						<TextControl
							placeholder={__("Album Cover Art URI")}
							value={props.attributes.albumCoverArtUri}
							onChange={onChangeAlbumCovertArtUri}
						/>
					</div>
					<div className="admin-album-40">
						Album Release Date
						<TextControl
							placeholder={__("Album Release Date")}
							value={props.attributes.albumReleaseDate}
							onChange={onChangeAlbumReleaseDate}
						/>
					</div>
				</div>
				<p>Front End Preview</p>
				<ServerSideRender
					block="cgb/block-album-review"
					attributes={{
						albumGenre: props.attributes.albumGenre,
						albumArtist: props.attributes.albumArtist,
						albumCoverArtUri: props.attributes.albumCoverArtUri,
						albumTitle: props.attributes.albumTitle,
						albumRating: props.attributes.albumRating,
						albumReleaseDate: props.attributes.albumReleaseDate,
					}}
				/>
			</div>
		);
	},

	/**
	 * Return null on the save function as we are dynamically rendering the blocks with PHP.
	 */
	save: (props) => {
		return null;
	},
});
