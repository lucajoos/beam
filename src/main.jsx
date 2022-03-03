import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import View from './routes/View';
import Home from './routes/Home';
import Invalid from './routes/NotFound';
import Archives from './routes/Archives';

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path={'/'} element={<Home />} />
            <Route path={'/archives'} element={<Archives />} />
            <Route path={'/s/:id'} element={<View />} />
            <Route path={'*'} element={<Invalid />} />
        </Routes>
    </BrowserRouter>,
  document.getElementById('root')
)
