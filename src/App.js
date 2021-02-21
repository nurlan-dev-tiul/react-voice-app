import React, { useState, useEffect } from 'react';

import { AudioOutlined, StopOutlined } from '@ant-design/icons';

import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

// SpeechRecognition свойства этого обьекта, описываем конфиг
mic.continuous = true;
mic.interimResults = true;
mic.lang = 'ru';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log('continue');
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log('Stopped Mic');
      };
    }
    mic.onstart = () => {
      console.log('Go gogog');
    };
    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      console.log('Запись пошла');
      setNote(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note]);
    setNote('');
  };

  return (
    <>
      <h1>nurlan-dev-tiul</h1>
      <div className="container">
        <div className="box">
          <h2>Текущие заметки</h2>
          {isListening ? (
            <span>
              <AudioOutlined />
            </span>
          ) : (
            <span>
              <StopOutlined />
              <AudioOutlined />
            </span>
          )}
          <button onClick={handleSaveNote} disabled={!note}>
            Сохранить
          </button>
          <button onClick={() => setIsListening((prevState) => !prevState)}>Старт/Стоп</button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Сохраненные заметки</h2>
          {savedNotes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
