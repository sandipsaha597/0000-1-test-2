import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<HomePage />} />
        <Route
          path="/browseAllLaunches/page/:pageNumber"
          element={<HomePage />}
        />
        <Route path="*" element={<h1>Page does not exist</h1>} />
      </Routes>
    </div>
  )
}

export default App
