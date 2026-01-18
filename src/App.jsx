import React from 'react'
import EditorDemo from './pages/EditorDemo'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import RoomJoin from './pages/RoomJoin'
import ChatPage from './pages/ChatPage'
import EditorPage from './pages/EditorPage'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>

      
      <Route path='/' element={<RoomJoin/>}/>
      <Route path='/editor/:roomId' element={<EditorPage/>}/>
     
    </Routes>
    </BrowserRouter>
  )
}

export default App
