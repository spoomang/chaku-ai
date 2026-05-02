import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Users from './pages/Users'
import Groups from './pages/Groups'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import SnakeGame from './snake/SnakeGame'

function ProtectedRoute({ children }) {
  const { auth } = useAuth()
  return auth ? children : <Navigate to="/" replace />
}

function AppLayout() {
  return <div id="app"><Outlet /></div>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/snake" element={<ProtectedRoute><SnakeGame /></ProtectedRoute>} />
      <Route element={<AppLayout />}>
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/users/:userId/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
        <Route path="/users/:userId/groups/:groupId/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/users/:userId/groups/:groupId/events/:eventId/details" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}
