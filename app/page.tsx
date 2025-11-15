"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { generateSong } from "../lib/jazz";
import { AudioEngine } from "../lib/audio";

export default function Page() {
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1e9));
  const [song, setSong] = useState(() => generateSong(seed));
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(song.tempo);
  const engineRef = useRef<AudioEngine | null>(null);

  useEffect(() => {
    setSong(generateSong(seed));
  }, [seed]);

  useEffect(() => {
    setSong(s => ({ ...s, tempo }));
  }, [tempo]);

  const engine = useMemo(() => {
    const e = new AudioEngine();
    engineRef.current = e;
    return e;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlay = async () => {
    await engine.start();
    engine.playSong(song);
    setIsPlaying(true);
  };

  const handleStop = () => {
    engine.stop();
    setIsPlaying(false);
  };

  const handleRegenerate = () => {
    setSeed(Math.floor(Math.random() * 1e9));
    setIsPlaying(false);
    engine.stop();
  };

  const minutes = Math.round((song.bars * 4 * (60 / song.tempo)) / 60 * 10) / 10;

  return (
    <div className="container">
      <div className="card">
        <div className="title">{song.title}</div>
        <div className="subtitle">Key {song.key} ? Tempo {tempo} BPM ? ~{minutes} min ? <span className="badge">Swing</span></div>
        <div className="controls" style={{marginBottom:12}}>
          {!isPlaying ? (
            <button onClick={handlePlay}>Play</button>
          ) : (
            <button className="danger" onClick={handleStop}>Stop</button>
          )}
          <button className="secondary" onClick={handleRegenerate}>Regenerate</button>
          <label style={{display:"flex",alignItems:"center",gap:10}}>
            Tempo
            <input className="slider" type="range" min={80} max={200} value={tempo} onChange={e=>setTempo(parseInt(e.target.value))} />
          </label>
          <label style={{display:"flex",alignItems:"center",gap:10}}>
            Volume
            <input className="slider" type="range" min={0} max={100} defaultValue={80} onChange={e=>engine.setVolume(parseInt(e.target.value)/100)} />
          </label>
        </div>
        <div className="grid">
          <div className="card">
            <div className="panelTitle">Chord chart (AABA 32 bars)</div>
            <div className="chords">
              {song.chart.map((sym, i) => (
                <div key={i} className="chord">{sym}</div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="panelTitle">Lyrics</div>
            <div className="lyrics">{song.lyrics}</div>
          </div>
        </div>
        <div className="footer">Generated with procedural harmony, swing phrasing, and WebAudio synthesis.</div>
      </div>
    </div>
  );
}
