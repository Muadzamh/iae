import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LandingPage } from "./pages/LandingPage";
import { MemberLogin } from "./pages/auth/MemberLogin";
import { AdminLogin } from "./pages/auth/AdminLogin";
import { MemberRegister } from "./pages/auth/MemberRegister"; 
import { MemberDashboard } from "./pages/member/MemberDashboard";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminBooks } from "./pages/admin/AdminBooks";
import { AdminMembers } from "./pages/admin/AdminMembers";
import { AdminLoans } from "./pages/admin/AdminLoans";

// cihuy

function App() {

  function ScrollToTop() {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/member_login" element={<MemberLogin/>}/>
        <Route path="/admin_login" element={<AdminLogin/>}/>
        <Route path="/member_register" element={<MemberRegister/>}/>
        <Route path="/member_dashboard" element={<MemberDashboard/>}/>
        <Route path="/admin_dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin_books" element={<AdminBooks/>}/>
        <Route path="/admin_members" element={<AdminMembers/>}/>
        <Route path="/admin_loans" element={<AdminLoans/>}/>
      </Routes>
    </Router>
  )
}

export default App
