import React from 'react';
import styled from 'styled-components';
import { TextControl } from '@wordpress/components';

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
overflow: scroll;
z-index: 99;
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


const LastFmAlbumSelector = ({onSelect}) => {

  const [searchTerm, setSearchTerm] = React.useState('');
  const [albums, setAlbums] = React.useState([]);
  const [timerId, setTimerId] = React.useState(null);

  const catchInput = (term) => {
    setSearchTerm(term);
    if (timerId) {
      clearTimeout(timerId);
    }

    setTimerId(setTimeout(() => {
      doSearch();
    }, 500));
  };

  const doSearch = async () => {
    try {
      const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${searchTerm}&api_key=${apiKey}&format=json`)
      const jsonRes  = await res.json();
      const { albummatches } = jsonRes.results;
      const albums = albummatches.album.map(({name, artist, image}) =>{
        const normilizedAlbums = {};
        normilizedAlbums['name'] = name;
        normilizedAlbums['artist'] = artist;
        normilizedAlbums['thumbnailUri'] = image[2]['#text'];
        return normilizedAlbums;
      });
      setAlbums(albums);
    } catch(err) {
      console.error(err);
    }
  };

  const doSelect = async item => {
    try {
      const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=${item.artist}&album=${item.name}&format=json`)
      const  { album }  = await res.json()
      onSelect(album);
      setAlbums([]);
    } catch(err) {
      console.error(err);
    }
    
  };


  return (
    <Container>
      <TextControl
        placeholder="Search for Albums on Last.FM"
        value={searchTerm}
        onChange={(e) => catchInput(e)}
      />
      {albums.length > 0 && (
        <Select>
          {albums.map(item => (
            <LastFmAlbum role="button" onClick={() => doSelect(item)} key={`${item.name}${item.artist}`}>
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