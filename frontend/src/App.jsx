import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";

// Pages
import Login from "./page/Login";
import Register from "./page/register";
import Home from "./page/Home";
import QuestionCreationForm from "./page/QuestionCreationForm";
import Practice from "./page/Practice";
import ForgotPassword from "./page/ForgotPassword";
import QuestionsListPage from "./page/Question";
import Exams from "./page/Exams";
import ExamCreationForm from "./page/ExamCreationForm";
import ExamDetailsResults from "./page/ExamDetailResultPage";
import PracticeExam from "./page/PracticeExam";
import ExamResult from "./page/ExamResult";
import ExamInviteForm from "./page/ExamInviteForm";
import CreatedExam from "./page/CreatedExam";
import ScrollToTop from "./page/ScrollToTop";
import ResetPassword from "./page/ResetPassword";
import UserSettings from "./page/UserSettings";
import PracticeExamResultDetail from "./page/PracticeExamResultDetail";
import UserExamResultDetails from "./page/UserExamResultDetail";
import ValidateToken from "./page/ValidateExamToken";
import ExamUpdateForm from "./page/ExamUpdateForm";
import ImageUploader from "./page/Test";
import UserSubjectProfileSetup from "./components/UserSubjectProfileSetup";
import QuestionEditForm from "./page/QuestionEditForm";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import LoadingPage from "./components/LoadingPage";
import Landing from "./page/Landing";
import { removeInvitedEmailUser, setExamCode } from "./store/exam/ExamSlice";
import User from "./page/Users";
import Resources from "./page/Resources";
import Leaderboard from "./page/Leaderboard";
import AdminQuestions from "./page/AdminQuestion";

const routeConfig = [
  { path: "/test", element: <ImageUploader /> },
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },

  {
    path: "/reset-password",
    element: (
      <ResetPasswordProtectRoute>
        <ResetPassword />
      </ResetPasswordProtectRoute>
    ),
  },
  {
    path: "/reset-password/:token",
    element: (
      <ResetPasswordProtectRoute>
        <ResetPassword />
      </ResetPasswordProtectRoute>
    ),
  },
  {
    path: "/set-up",
    element: (
      <ProtectedRouteForSubjectSetup>
        <UserSubjectProfileSetup />
      </ProtectedRouteForSubjectSetup>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/leaderboard",
    element: (
      <ProtectedRoute>
        <Leaderboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/practice",
    element: (
      <ProtectedRoute>
        <Practice />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <UserSettings />
      </ProtectedRoute>
    ),
  },
  // question
  {
    path: "/questions",
    element: (
      <ProtectedRoute>
        <AdminTeacherProtectedRoute>
          <QuestionsListPage />
        </AdminTeacherProtectedRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/questions/create",
    element: (
      <ProtectedRoute>
        <AdminTeacherProtectedRoute>
          <QuestionCreationForm />
        </AdminTeacherProtectedRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/questions/edit",
    element: (
      <ProtectedRoute>
        <AdminTeacherProtectedRoute>
          <QuestionEditForm />
        </AdminTeacherProtectedRoute>
      </ProtectedRoute>
    ),
  },

  // exam
  {
    path: "/exams",
    element: (
      <ProtectedRoute>
        <Exams />
      </ProtectedRoute>
    ),
  },
  {
    path: "/exams/create",
    element: (
      <ProtectedRoute>
        <AdminTeacherProtectedRoute>
          <ExamCreationForm />
        </AdminTeacherProtectedRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/exams/:examCode/edit",
    element: (
      <ProtectedRoute>
        <AdminTeacherProtectedRoute>
          <ExamUpdateForm />
        </AdminTeacherProtectedRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/exams/:examCode/invite",
    element: (
      <ProtectedRoute>
        <AdminTeacherProtectedRoute>
          <ExamInviteForm />
        </AdminTeacherProtectedRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/exams/:examCode",
    element: (
      <ProtectedRouteForExamTaking>
        <CreatedExam />
      </ProtectedRouteForExamTaking>
    ),
  },
  {
    path: "/exams/:examCode/result",
    element: (
      <ProtectedRoute>
        <AdminTeacherProtectedRoute>
          <ExamDetailsResults />
        </AdminTeacherProtectedRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/exams/:examCode/review",
    element: (
      <ProtectedRoute>
        <UserExamResultDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/exams/:invitationCode/validate",
    element: <ValidateToken />,
  },

  // practice
  {
    path: "/practice/:examCode",
    element: (
      <ProtectedRoute>
        <PracticeExam />
      </ProtectedRoute>
    ),
  },
  {
    path: "/practice/:examCode/result",
    element: (
      <ProtectedRoute>
        <ExamResult />
      </ProtectedRoute>
    ),
  },
  {
    path: "/practice/:examCode/review",
    element: (
      <ProtectedRoute>
        <PracticeExamResultDetail />
      </ProtectedRoute>
    ),
  },

  // user
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <AdminProtectedRoute>
          <User />
        </AdminProtectedRoute>
      </ProtectedRoute>
    ),
  },
  // resources
  {
    path: "/resources",
    element: (
      <ProtectedRoute>
        <AdminProtectedRoute>
          <Resources />
        </AdminProtectedRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/ai-service",
    element: (
      <ProtectedRoute>
        <AdminProtectedRoute>
          <AdminQuestions />
        </AdminProtectedRoute>
      </ProtectedRoute>
    ),
  },
];

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        {routeConfig.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

function ProtectedRouteForSubjectSetup({ children }) {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ProtectedRouteForExamTaking({ children }) {
  const { currentUser } = useSelector((state) => state.user);
  const { invitedEmailUser } = useSelector((state) => state.exam);
  const dispatch = useDispatch();
  const { examCode } = useParams();

  if (!currentUser && examCode) {
    dispatch(setExamCode(examCode));
  }
  const isTheSameUser = currentUser?.email === invitedEmailUser?.email;
  if (invitedEmailUser && !isTheSameUser) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser) {
    if (invitedEmailUser?.isUserExisted)
      return <Navigate to="/login" replace />;
    else return <Navigate to="/register" replace />;
  } else {
    dispatch(removeInvitedEmailUser());
  }
  return children;
}

function ProtectedRoute({ children }) {
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    const checkProfileSetup = async () => {
      if (!currentUser?.email) return;
      try {
        const res = await axios.post(
          `/api/question-type/check-setup?email=${currentUser.email}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );
        if (res.status === 200) {
          setIsSetup(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileSetup();
  }, [currentUser?.email, currentUser?.token]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (isLoading) {
    return <LoadingPage />;
  }
  if (!isSetup) {
    return <Navigate to="/set-up" replace />;
  }

  return children;
}

function ResetPasswordProtectRoute({ children }) {
  const { token } = useParams();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await axios.get(`api/auth/validate-token/${token}`);
        if (res.status === 200) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.log(error);
        setIsValid(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setIsValid(false);
    }
  }, [token]);

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" />;
  }

  return children;
}

function AdminTeacherProtectedRoute({ children }) {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.role.some((r) => r.name === "ROLE_ADMIN");
  const isTeacher = currentUser?.role.some((r) => r.name === "ROLE_TEACHER");

  if (!(isAdmin || isTeacher)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function AdminProtectedRoute({ children }) {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.role.some((r) => r.name === "ROLE_ADMIN");

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
