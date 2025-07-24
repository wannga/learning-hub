import React from 'react';
import './root.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './routes/Login.tsx';
import Signup from './routes/Signup.tsx';
import Home from './routes/Home.tsx';
import VideoPage from './routes/VideoPage.tsx';
import Articles from './routes/Articles.tsx';
import VocabularyPage from './routes/VocabularyPage.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/videoPage" element={<VideoPage />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
