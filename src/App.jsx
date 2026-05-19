import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/home'
import Login from './pages/Login/login'
import MovimentosPage from './pages/movimentos/movimentos.jsx'

function App() {


  return (
    <>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/home' element={<Home />} />
      <Route path='/movimentos' element={<MovimentosPage />} />
    </Routes>

  
    </>
  )
}

export default App
