import React from 'react';
import './root.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/LoginPage.tsx";
import Signup from './components/Signup.tsx';
import Home from './components/Home.tsx';
import VideoMain from './components/VideoMain.tsx';
import VideoPage from './components/VideoPage.tsx';
import ArticlesMain from './components/ArticlesMain.tsx';
import ArticlePage from './components/ArticlePage.tsx';
import VocabularyPage from './components/VocabularyPage.tsx';
import CaseStudyMain from './components/CaseStudyMain.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/videoMain" element={<VideoMain />} />
        <Route path="/videoPage" element={<VideoPage />} />
        <Route path="/articleMain" element={<ArticlesMain />} />
        <Route path="/articlePage" element={<ArticlePage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path='/caseStudyMain' element={<CaseStudyMain />} />
      </Routes>
    </Router>
  );
}

export default App;
