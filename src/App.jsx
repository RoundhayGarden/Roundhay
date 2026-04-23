import { Route, Routes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Series from './pages/Series'
import Collection from './pages/Collection'
import SearchResults from './pages/SearchResults'

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/search" element={<SearchResults />} />
      </Route>
    </Routes>
  )
}

export default App