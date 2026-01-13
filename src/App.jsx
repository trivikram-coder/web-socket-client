import React from 'react'
import EditorDemo from './pages/EditorDemo'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import RoomJoin from './pages/RoomJoin'
import ChatPage from './pages/ChatPage'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>

      <Route path='/chatpage/:roomId' element={<ChatPage/>}/>
      <Route path='/' element={<RoomJoin/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
