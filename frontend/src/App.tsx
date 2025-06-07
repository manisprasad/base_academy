import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import { Toaster } from 'sonner';
import { Home } from './pages/course/Home';
import Courses from './pages/Courses';
import { CourseDetails } from './pages/CourseDetails';
import { UploadCourse } from './pages/admin/upload';
import MyCourses from './pages/students/MyCourses';
import Learning from './pages/students/Learning';
import AuthRequired from './components/authRequired'; 
import Unauthorized from './pages/Unauthorized';
// import Unauthorized from './pages/Unauthorized'; 

function App() {
  return (
    <div className="overflow-x-hidden p-3">
      <Toaster richColors />
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />

        {/* Admin Protected Routes */}
        <Route element={<AuthRequired allowedRole={5150} />}>
          <Route path="/admin/upload" element={<UploadCourse />} />
        </Route>

        {/* Student Protected Routes */}
        <Route element={<AuthRequired allowedRole={2004} />}>
          <Route path="/student/my-courses" element={<MyCourses />} />
          <Route path="/student/my-courses/:id" element={<Learning />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
