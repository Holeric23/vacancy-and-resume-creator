import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';

import './App.css'

import Main from './pages/Main';
import NotFound from './pages/NotFound';

function App() {

  return (
    <>
      <Routes>
        <Route path="/main" element={<Main />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
