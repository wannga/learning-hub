import React from 'react';
import './root.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './routes/Login.tsx';
import Signup from './routes/Signup.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={Login} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* You can add more routes here in the future */}
      </Routes>
    </Router>
  );
}

export default App;
