/**
 * BLOCK: album-review
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';
import React from 'react';
import styled from 'styled-components'
import StarRatingComponent from 'react-star-rating-component';
import LastFmAlbumSelector from './LastFmAlbumSelector.js';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { TextControl } = wp.components;
const { ServerSideRender } = wp.editor;

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-album-review', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Album Review' ), // Block title.
	icon: 'album', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'media', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Music' ),
		__( 'Album' ),
		__( 'Review' ),
	],
	attributes: {
		albumTitle: {
			type: 'string',
		},
		albumArtist: {
			type: 'string',
		},
		albumGenre: {
			type: 'array',
		},
		albumRating: {
			type: 'number',
			default:  3 ,
		},
		albumCoverArtUri: {
			type: 'string',
		},
		albumReleaseDate: {
			type: 'string',
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: ( props ) => {
		// Creates a <p class='wp-block-cgb-block-album-review'></p>.
		const onChangeAlbumTitle = value =>{
			props.setAttributes( {
				albumTitle: value
			});
		
		};
		const onChangeAlbumArtist = value =>{
			props.setAttributes( {
				albumArtist: value
			});
		};
		const onChangeAlbumGenre = value =>{
			props.setAttributes( {
				albumGenre: value
			});
		};
		const onChangeAlbumRating = value =>{
			props.setAttributes( {
				albumRating: value
			});
		};
		const onChangeAlbumCovertArtUri = value =>{
			props.setAttributes( {
				albumCoverArtUri: value
			});
		}; 
		const onChangeAlbumReleaseDate = value =>{
			props.setAttributes( {
				albumReleaseDate: value
			});
		};
		
		const onLastFmSelect = value =>{
			console.log(value);
			const releaseDate = ('wiki.published' in value) ? value.wiki.published.split(',')[0] : '';
			props.setAttributes( {
			albumCoverArtUri: value.image[2]['#text'],
		   // albumGenre: value,
			albumArtist: value.artist,
			albumTitle: value.name,
			albumGenre: value.tags.tag.map(({name}) => {
				let genreString ='';
				genreString = genreString + ' ' + name;
				return genreString;
		}),
			
			albumReleaseDate: releaseDate,
		  });
		};
		
		
		return (
			<div className={ props.className }>
				<LastFmAlbumSelector onSelect={ onLastFmSelect }/>
				<div className="admin-manual-enter">
				<p className="admin-album-60">
						Album Name
					<TextControl
					tagName= "p"
					placeholder={ __('Album Name') }
					value={ props.attributes.albumTitle }
					onChange={ onChangeAlbumTitle }
					/>
					</p>
					<p className="admin-album-40">
						Album Artist
					<TextControl
					tagName= "p"
					placeholder={ __('Album Artist') }
					value={ props.attributes.albumArtist }
					onChange={ onChangeAlbumArtist }
					/>
					</p>
					<p className="admin-album-60">
						Album Genre
					<TextControl
					tagName= "p"
					placeholder={ __('Album Genre') }
					value={ props.attributes.albumGenre }
					onChange={ onChangeAlbumGenre }
					/>
					</p>
					<p className="admin-album-40">Album Rating
				<StarRatingComponent
					name='Album Rating'
					 
    				value={props.attributes.albumRating} /* number of selected icon (`0` - none, `1` - first) */
    				onStarClick={ onChangeAlbumRating } /* on icon click handler */
						/>
					</p>
					<p className="admin-album-60">
						Album Cover Art URI
					<TextControl
					tagName= "p"
					placeholder={ __('Album Cover Art URI') }
					value={ props.attributes.albumCoverArtUri }
					onChange={ onChangeAlbumCovertArtUri }
					/>
					</p>
					<p className="admin-album-40">
						Album Release Date
					<TextControl
					tagName= "p"
					placeholder={ __('Album Release Date') }
					value={ props.attributes.albumReleaseDate }
					onChange={ onChangeAlbumReleaseDate }
					/>
					</p>
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
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: ( props ) => {
		
		
		return null
	},
} );
