import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Disc3,
  AlertCircle,
  ArrowLeft,
  Flame,
} from 'lucide-react';
import { MusicTrack, Playlist } from '../types';
import { soundManager } from '../utils/audioSynth';
import { useTheme } from '../context/ThemeContext';

interface MusicPlayerProps {
  tracks: MusicTrack[];
  playlists: Playlist[];
  recipientNickname: string;
  onReturn?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  tracks,
  playlists,
  recipientNickname,
  onReturn,
}) => {
  const { logAction } = useTheme();
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('all');
  const [showPlaylistDrawer, setShowPlaylistDrawer] = useState<boolean>(true);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitialMount = useRef(true);

  // Filter tracks by playlist
  const activeTracks = selectedPlaylistId === 'all'
    ? tracks
    : tracks.filter((t) => t.playlistId === selectedPlaylistId);

  const currentTrack = activeTracks[currentTrackIndex % (activeTracks.length || 1)] || null;

  // Sync volume
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Handle track changing WITHOUT unexpected autoplay
  useEffect(() => {
    if (!currentTrack) return;
    setAudioError(null);
    setCurrentTime(0);

    // If first load, do not autoplay
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    soundManager.stopTrackSynth();

    if (isPlaying) {
      soundManager.playTrackSynth(currentTrack.id || currentTrack.playlistId);
    }

    if (!currentTrack.isSynthesizedBuiltIn && audioRef.current && currentTrack.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Fallback seamlessly to synth
          soundManager.playTrackSynth(currentTrack.id || currentTrack.playlistId);
        });
      }
    }
  }, [currentTrack?.id]);

  const togglePlayPause = () => {
    if (!currentTrack) return;
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);

    if (nextPlay) {
      logAction('music_play', 'Music Player', `Playing: ${currentTrack.title}`);
      soundManager.playTrackSynth(currentTrack.id || currentTrack.playlistId);

      if (!currentTrack.isSynthesizedBuiltIn && audioRef.current && currentTrack.audioUrl) {
        audioRef.current.play().catch(() => {
          soundManager.playTrackSynth(currentTrack.id || currentTrack.playlistId);
        });
      }
    } else {
      soundManager.stopTrackSynth();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const handleNext = () => {
    if (activeTracks.length <= 1) return;
    let nextIndex = currentTrackIndex + 1;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * activeTracks.length);
    } else if (nextIndex >= activeTracks.length) {
      nextIndex = 0;
    }
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrev = () => {
    if (activeTracks.length <= 1) return;
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = activeTracks.length - 1;
    }
    setCurrentTrackIndex(prevIndex);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !currentTrack?.isSynthesizedBuiltIn) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    } else if (currentTrack?.isSynthesizedBuiltIn && isPlaying) {
      setCurrentTime((prev) => (prev + 0.5) % (currentTrack.duration || 180));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current && !currentTrack?.isSynthesizedBuiltIn) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleTrackEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'all') {
      handleNext();
    } else {
      setIsPlaying(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Real audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
        onError={() => {
          setAudioError('Audio streaming from synth chordscape.');
          soundManager.startSynthMusic();
        }}
      />

      {/* Top Navigation Back Button */}
      {onReturn && (
        <div className="flex items-center justify-between">
          <button
            onClick={onReturn}
            className="px-4 py-2 rounded-xl bg-[#173B32] border border-[#B8A8D9]/25 text-xs sm:text-sm font-semibold text-[#FFFDF8] hover:bg-[#102A25] flex items-center gap-2 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#B8A8D9]" />
            <span>Wapas Cozy Room Jayein</span>
          </button>

          <span className="text-xs text-[#A7B7A0] bg-[#173B32] px-3 py-1.5 rounded-full border border-[#B8A8D9]/15">
            10+ Curated Comfort Tracks
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#B8A8D9]">
          <Disc3 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
          <span>Cozy Music Player</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFFDF8]">
          Soothing Sounds for {recipientNickname} 🎵
        </h1>
        <p className="text-sm sm:text-base text-[#A7B7A0] max-w-xl mx-auto font-body">
          Baarish, ambient chords, period relief notes, aur gentle lofi tunes jo aapke sharir aur mann ko sukoon dein.
        </p>
      </div>

      {/* Playlist Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setSelectedPlaylistId('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            selectedPlaylistId === 'all'
              ? 'bg-[#B8A8D9] text-[#102A25] border-[#B8A8D9] shadow-sm'
              : 'bg-[#173B32] text-[#A7B7A0] border-[#B8A8D9]/20 hover:text-white'
          }`}
        >
          All Tracks ({tracks.length})
        </button>

        <button
          onClick={() => setSelectedPlaylistId('period-care')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
            selectedPlaylistId === 'period-care'
              ? 'bg-rose-950 text-rose-200 border-rose-400 shadow-sm'
              : 'bg-rose-950/40 text-rose-300 border-rose-400/30 hover:bg-rose-900/40'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>Day 5 Rest & Recovery (Cramps Relief)</span>
        </button>

        {playlists.map((pl) => {
          if (pl.id === 'period-care') return null;
          return (
            <button
              key={pl.id}
              onClick={() => setSelectedPlaylistId(pl.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedPlaylistId === pl.id
                  ? 'bg-[#B8A8D9] text-[#102A25] border-[#B8A8D9] shadow-sm'
                  : 'bg-[#173B32] text-[#A7B7A0] border-[#B8A8D9]/20 hover:text-white'
              }`}
            >
              {pl.name}
            </button>
          );
        })}
      </div>

      {/* The Central Player Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#173B32] via-[#1A4238] to-[#102A25] border border-[#B8A8D9]/30 p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Authentic Rotating Vinyl Turntable */}
          <div className="relative shrink-0">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-br from-[#0B1A16] to-[#122A23] border-2 border-[#B8A8D9]/40 p-3 shadow-2xl relative flex items-center justify-center overflow-hidden">
              {/* Turntable Platter Metal Rim */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-[#181818] border-2 border-[#333333] flex items-center justify-center shadow-inner relative">
                {/* The Vinyl Record */}
                <div
                  className="w-44 h-44 sm:w-52 sm:h-52 rounded-full relative flex items-center justify-center shadow-[0_4px_25px_rgba(0,0,0,0.9)] transition-all"
                  style={{
                    background: 'radial-gradient(circle, #252525 0%, #151515 30%, #0d0d0d 60%, #1a1a1a 85%, #050505 100%)',
                    animation: isPlaying ? 'spin 3.5s linear infinite' : 'none',
                  }}
                >
                  {/* Vinyl Concentric Grooves */}
                  <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-5 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
                  <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />

                  {/* Grooves Sheen Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                  {/* Center Sticker / Vinyl Label */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#B8A8D9] to-[#E8B878] p-1 flex flex-col items-center justify-center text-center shadow-md relative z-10 border border-[#102A25]">
                    <span className="text-base sm:text-lg">☁️💜</span>
                    <span className="text-[9px] font-bold text-[#102A25] tracking-tight leading-none font-serif">
                      Diyuuuu
                    </span>
                    <span className="text-[8px] text-[#102A25]/80 font-medium">
                      Sir jiii
                    </span>
                    {/* Spindle hole */}
                    <div className="w-2.5 h-2.5 rounded-full bg-[#102A25] mt-0.5 border border-white/30" />
                  </div>
                </div>
              </div>

              {/* Tonearm Assembly */}
              <div
                className="absolute top-2 right-2 w-16 h-28 pointer-events-none transition-transform duration-1000 ease-out z-20"
                style={{
                  transformOrigin: 'top right',
                  transform: isPlaying ? 'rotate(24deg)' : 'rotate(0deg)',
                }}
              >
                {/* Pivot base */}
                <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-gradient-to-b from-[#A7B7A0] to-[#556B60] border border-white/30 shadow-md flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#E8B878]" />
                </div>
                {/* Arm shaft */}
                <div className="absolute top-4 right-3.5 w-1 h-20 bg-gradient-to-r from-[#D8D4C8] to-[#999] rounded-full shadow" />
                {/* Cartridge & Stylus head */}
                <div className="absolute bottom-2 left-6 w-3 h-5 bg-[#E8B878] rounded border border-[#102A25] shadow transform -rotate-12" />
              </div>

              {/* Power / Speed indicator */}
              <div className="absolute bottom-2 left-3 flex items-center gap-1.5 z-20">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[9px] font-mono text-[#A7B7A0] font-bold">
                  {isPlaying ? '33 ⅓ RPM · SPINNING' : 'PAUSED'}
                </span>
              </div>
            </div>
          </div>

          {/* Track Info */}
          <div className="w-full space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B8A8D9] font-body">
                {currentTrack?.playlistId === 'period-care' ? 'Special Rest Frequency 🌸' : 'Cozy Ambient Soundscape'}
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#FFFDF8] leading-tight">
                {currentTrack?.title || 'No Track Selected'}
              </h2>
              <p className="text-sm text-[#A7B7A0] font-body font-medium">
                {currentTrack?.artist || 'Nishant Raj / Diyuuuu Space'}
              </p>
            </div>

            <p className="text-xs text-[#F6F1E8]/75 font-body leading-relaxed max-w-md">
              {currentTrack?.description || 'Calming, gentle frequencies designed for peaceful rest.'}
            </p>

            {audioError && (
              <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{audioError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar & Timestamps */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={duration || 180}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 rounded-lg bg-[#102A25] accent-[#B8A8D9] cursor-pointer"
            aria-label="Seek track"
          />
          <div className="flex justify-between text-xs text-[#A7B7A0] font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Control Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#B8A8D9]/15">
          {/* Shuffle & Repeat */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-2 rounded-xl transition-all ${
                isShuffle ? 'text-[#B8A8D9] bg-[#102A25]' : 'text-[#A7B7A0] hover:text-[#FFFDF8]'
              }`}
              title={isShuffle ? 'Shuffle active' : 'Shuffle off'}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setRepeatMode((prev) => (prev === 'all' ? 'one' : prev === 'one' ? 'off' : 'all'));
              }}
              className={`p-2 rounded-xl transition-all ${
                repeatMode !== 'off' ? 'text-[#B8A8D9] bg-[#102A25]' : 'text-[#A7B7A0] hover:text-[#FFFDF8]'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Central Playback Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-[#102A25] border border-[#B8A8D9]/20 text-[#F6F1E8] hover:text-[#B8A8D9] hover:scale-105 active:scale-95 transition-all"
              aria-label="Previous track"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlayPause}
              className="p-4 rounded-full bg-gradient-to-r from-[#B8A8D9] to-[#D8CEEE] text-[#102A25] hover:scale-105 active:scale-95 shadow-lg transition-all"
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-[#102A25] border border-[#B8A8D9]/20 text-[#F6F1E8] hover:text-[#B8A8D9] hover:scale-105 active:scale-95 transition-all"
              aria-label="Next track"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Slider & Playlist Drawer Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-[#A7B7A0] hover:text-[#FFFDF8]"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 sm:w-24 h-1.5 rounded-lg bg-[#102A25] accent-[#B8A8D9] cursor-pointer"
              aria-label="Volume slider"
            />

            <button
              onClick={() => setShowPlaylistDrawer(!showPlaylistDrawer)}
              className={`p-2 rounded-xl border transition-all ${
                showPlaylistDrawer
                  ? 'bg-[#B8A8D9] text-[#102A25] border-[#B8A8D9]'
                  : 'bg-[#102A25] border-[#B8A8D9]/20 text-[#A7B7A0] hover:text-[#FFFDF8]'
              }`}
              title="Show Playlist"
            >
              <ListMusic className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Playlist Drawer */}
        {showPlaylistDrawer && (
          <div className="pt-6 border-t border-[#B8A8D9]/15 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-title text-xl font-bold text-[#FFFDF8]">
                Tracks in Queue ({activeTracks.length})
              </h3>
              <span className="text-xs text-[#A7B7A0]">Click any track to listen</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {activeTracks.map((trk, i) => {
                const isCurrent = currentTrack?.id === trk.id;
                return (
                  <div
                    key={trk.id}
                    onClick={() => {
                      setCurrentTrackIndex(i);
                      setIsPlaying(true);
                      if (trk.isSynthesizedBuiltIn) {
                        soundManager.startSynthMusic();
                      } else if (audioRef.current) {
                        audioRef.current.src = trk.audioUrl;
                        audioRef.current.play().catch(() => soundManager.startSynthMusic());
                      }
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between gap-4 transition-all ${
                      isCurrent
                        ? 'bg-[#102A25] border-[#B8A8D9] shadow-sm'
                        : 'bg-[#102A25]/40 border-[#B8A8D9]/10 hover:bg-[#102A25]/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#A7B7A0] font-mono w-4">{i + 1}</span>
                      <div>
                        <p className={`text-xs sm:text-sm font-semibold ${isCurrent ? 'text-[#B8A8D9]' : 'text-[#FFFDF8]'}`}>
                          {trk.title}
                        </p>
                        <p className="text-[11px] text-[#A7B7A0]">{trk.artist}</p>
                      </div>
                    </div>
                    <span className="text-xs text-[#A7B7A0] font-mono">{formatTime(trk.duration)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
