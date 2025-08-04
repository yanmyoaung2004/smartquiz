import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import axios from "axios";
import { signInSuccess } from "@/store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "@/components/OAuth";
import { handleFailureToast } from "@/components/ToastService";
import { Toaster } from "@/components/ui/sooner";
import { removeExamCode } from "@/store/exam/ExamSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { invitedEmailUser, examCode } = useSelector((state) => state.exam);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post("/api/auth/login", {
        email: email,
        password: password,
      });

      if (res.status === 200) {
        dispatch(signInSuccess(res.data));
        if (invitedEmailUser?.examCode) {
          navigate(`/exams/${invitedEmailUser.examCode}`);
          return;
        }
        if (examCode) {
          console.log("object");
          dispatch(removeExamCode());
          navigate(`/exams/${examCode}`);
          return;
        }
        if (res.data.isSetupRequired) navigate("/set-up");
        else navigate("/home");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      handleFailureToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-900">
      <Toaster position="top-right" />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-slate-700 dark:text-slate-100">
            SmartQuiz
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-slate-700 dark:text-slate-300">
            Login your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <Label htmlFor="email-address">Email address</Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer dark:text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-purple-600 hover:text-purple-800"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
        <OAuth />
      </div>
    </div>
  );
}

export default Login;
