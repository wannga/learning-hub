import React from 'react';
import './root.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/LoginPage.tsx";
import Signup from './components/Signup.tsx';
import Home from './components/Home.tsx';
import VideoMain from './components/VideoMain.tsx';
import VideoPage from './components/VideoPage.tsx';
import VideoCreate from './components/VideoCreate.tsx';
import ArticlesMain from './components/ArticlesMain.tsx';
import ArticlePage from './components/ArticlePage.tsx';
import ArticleCreate from './components/ArticleCreate.tsx';
import VocabularyPage from './components/VocabularyPage.tsx';
import VocabularyCreate from './components/VocabularyCreate.tsx';
import CaseStudyMain from './components/CaseStudyMain.tsx';
import CaseStudyCreate from './components/CaseStudyCreate.tsx';
import UserProfile from './components/UserProfile.tsx';
import ArticleHistory from './components/ArticleHistory.tsx';
import VideoHistory from './components/VideoHistory.tsx';
import CaseStudyHistory from './components/CaseStudyHistory.tsx';
import UserEdit from './components/UserEdit.tsx';
import QuizPage from './components/QuizPage.tsx';
import QuizResultPage from './components/QuizResultPage.tsx';
import TestPage from './components/TestPage.tsx';
import TestResultPage from './components/TestResultPage.tsx';
import TestCreate from './components/TestCreate.tsx';

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
        <Route path="/videoCreate" element={<VideoCreate />} />
        <Route path="/articleMain" element={<ArticlesMain />} />
        <Route path="/articlePage" element={<ArticlePage />} />
        <Route path="/articleCreate" element={<ArticleCreate />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/vocabularyCreate" element={<VocabularyCreate />} />
        <Route path="/caseStudyMain" element={<CaseStudyMain />} />
        <Route path="/caseStudyCreate" element={<CaseStudyCreate />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/articleHistory" element={<ArticleHistory />} />
        <Route path="/videoHistory" element={<VideoHistory />} />
        <Route path="/caseStudyHistory" element={<CaseStudyHistory />} />
        <Route path="/userEdit" element={<UserEdit />} />
        <Route path="/quizPage" element={<QuizPage />} />
        <Route path="/quizResultPage" element={<QuizResultPage />} />
        <Route path="/testPage" element={<TestPage />} />
        <Route path="/testResultPage" element={<TestResultPage />} />
        <Route path="/testCreate" element={<TestCreate />} />
      </Routes>
    </Router>
  );
}

export default App;
