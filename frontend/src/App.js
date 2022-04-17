import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Container from './components/layout/Container';
import Message from './components/layout/Message'


import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import Home from './components/pages/Home';


//Contexts
import { UserProvider } from './context/UserContext'
function App() {
  return (
    <>
      <Router>
        <UserProvider>
          <Navbar />
          <Message/>
          <Container>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
            </Routes>
          </Container>
          <Footer />
        </UserProvider>
      </Router>

    </>
  );
}

export default App;
