import { useState } from 'react'
import './App.css'
import EmailEditor from './components/emailEditor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Email Builder</h1>

      <EmailEditor />
      
    </div>
  )
}

export default App
