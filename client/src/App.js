import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './SignIn';
import VideoPlayer from './VideoPlayer';
import AccountsManager from './AccountsManager';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/accounts" element={<AccountsManager />} />
        <Route path="/" element={<VideoPlayer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
