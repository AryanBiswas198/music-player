import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import Player from '../components/Player';
import ColorThief from 'color-thief-browser';
import { FaTimes } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';

const MainLayout = () => {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  });

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('https://cms.samespace.com/items/songs');
        setSongs(response.data.data);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };
    fetchSongs();
  }, []);

    useEffect(() => {
      if (currentSongIndex !== null && songs.length > 0) {
        const currentSong = songs[currentSongIndex];
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = `https://cms.samespace.com/assets/${currentSong.cover}`;
        img.onload = () => {
          const colorThief = new ColorThief();
          const colors = colorThief.getColor(img);
          const darkenedColor = colors.map(color => Math.floor(color * 0.5));
          setBackgroundStyle({
            background: `linear-gradient(to left, rgba(${darkenedColor[0]}, ${darkenedColor[1]}, ${darkenedColor[2]}, 2), rgba(${darkenedColor[0]}, ${darkenedColor[1]}, ${darkenedColor[2]}, 1))`
          });
        };
      }
    }, [currentSongIndex, songs]);

  const handleSongClick = (index) => {
    setCurrentSongIndex(index);
  };

  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[100vh] min-w-[100vw] h-full bg-slate-950 py-5" style={backgroundStyle}>
      <Navbar onMenuClick={toggleMenu} />
      <Sidebar />
      <div className='flex w-full mx-auto md:ml-2 lg:ml-11'>
        {isDesktopOrLaptop && (
          <Content songs={songs} currentSongIndex={currentSongIndex} onSongClick={handleSongClick} />
        )}
        {currentSongIndex !== null && (
          <Player
            currentSong={songs[currentSongIndex]}
            nextSong={nextSong}
            prevSong={prevSong}
          />
        )}
      </div>

      <div
        className={`fixed md:hidden top-0 left-0 h-full bg-gray-800 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '75%' }}
      >
        {/* Cross Icon */}
        <div className="flex justify-end p-4">
          <FaTimes size={32} className="text-white cursor-pointer" onClick={toggleMenu} />
        </div>
        <Content songs={songs} currentSongIndex={currentSongIndex} onSongClick={handleSongClick} />
      </div>
    </div>
  );
};

export default MainLayout;
