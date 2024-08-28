import ReactDom from "react-dom/client";
import { StrictMode } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SuAdminIndex from './superAdminPortal/suAdminIndex'
import AdminIndex from './adminPortal/adminIndex'
import UserIndex from './userPortal/userIndex'
import IndexPage from "./components/indexPage";

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  // You can customize the theme here
});

export default function App(){
  return(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<IndexPage/>} />
            <Route path="/super-admin-portal" element={<SuAdminIndex/>} />
            <Route path ='/admin-portal' element={<AdminIndex/>}/>
            <Route path ='/user-portal' element={<UserIndex/>}/>
          </Routes>
        </Router>           
      </ThemeProvider>  
    </StrictMode>
  );
}

const root = ReactDom.createRoot(document.getElementById('root'));
root.render(<App/>);
