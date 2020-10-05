import React from 'react';
import styled from 'styled-components';
const { TextControl } = wp.components;

const apiKey =  cgbGlobal.lastFmApiKey ;

const Container = styled.div`
position: relative;
`;

const Select = styled.div`
position: absolute;
top: 100%;
left: 0;
width: 100%;
max-height: 30vh;
padding: 10px;
background: white;
box-shadow: 0 3px 3px rgba(0,0,0,.1);
overflow: scroll;
`;

const LastFmAlbum = styled.div`
display: flex;
align-items: center;
margin: 0 5px;
`;

const AlbumImage = styled.img`
width: 75px;
height: 75px;
`;

const AlbumInfo = styled.div`
display: flex;
flex-direction: column;
padding: 5px;
border-bottom: 1px solid #f1f1f1;
`;


class LastFmAlbumSelector extends React.Component {
  state = {
    searchTerm: '',
    albums: [],
  };

  catchInput = e => {
    this.setState({ searchTerm: e });
    if(this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(this.doSearch, 500);
  };

  doSearch = async () => {
    try {
      const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${this.state.searchTerm}&api_key=${apiKey}&format=json`)
      const jsonRes  = await res.json();
      const { albummatches } = jsonRes.results;
      const albums = albummatches.album.map(({name, artist, image}) =>{
        const normilizedAlbums = {};
        normilizedAlbums['name'] = name;
        normilizedAlbums['artist'] = artist;
        normilizedAlbums['thumbnailUri'] = image[2]['#text'];
        return normilizedAlbums;
      });
      this.setState({ albums: albums });
    } catch(err) {
    }
  };

  doSelect = async item => {
    try {
      const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${item.artist}&album=${item.name}&format=json`)
      const  { album }  = await res.json()
      this.props.onSelect(album);
      
    } catch(err) {
      console.log(err);
    }
    
    this.setState({ albums: [] });
  };


  render = () => (
    <Container>
      <TextControl
        placeholder="Search for Albums on Last.FM"
        value={this.state.value}
        onChange={this.catchInput}
      />
      {this.state.albums.length > 0 && (
        <Select>
          {this.state.albums.map(item => (
            <LastFmAlbum role="button" onClick={() => this.doSelect(item)}>
              <AlbumImage src={item.thumbnailUri} />
              <AlbumInfo>
                <strong>{item.name}</strong>
                {item.artist}
              </AlbumInfo>
            </LastFmAlbum>
          ))}
        </Select>
      )}
    </Container>
  );
}

export default LastFmAlbumSelector