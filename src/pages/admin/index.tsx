import { StyledBox } from "@/components/StyledBox";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      fetch("/api/post/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }).then((res) => {
        if (res.ok) {
        } else {
          throw new Error("Invalid credentials provided.");
        }
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      alert("Registration successful");
    } catch (error: any) {
      alert(error.message);
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-5 sm:px-20 py-5 space-y-5 w-screen ">
      <StyledBox className="w-full flex items-center justify-evenly">
        <div
          className="flex flex-col items-center justify-center space-y-5 w-96"
          hidden={!isLogin}
        >
          <h1 className="text-3xl font-bold text-center">Login</h1>
          <form
            className="flex flex-col space-y-5 w-full text-black"
          >
            <input
              type="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="p-3 bg-blue-500 text-white font-semibold rounded-md focus:outline-none"
            >
              Login
            </button>
            <p className="text-sm text-center text-white">
              Don&apos;t have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                Register
              </span>
            </p>
          </form>
          {error && (
            <p className="text-sm text-center text-red font-semibold">
              {error}
            </p>
          )}
        </div>
        <div
          className="flex flex-col items-center justify-center space-y-5 w-96"
          hidden={isLogin}
        >
          <h1 className="text-3xl font-bold text-center">Register</h1>
          <form
            className="flex flex-col space-y-5 w-full text-black"
            onSubmit={handleRegister}
          >
            <input
              type="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleRegister();
              }}
              className="p-3 bg-blue-500 text-white font-semibold rounded-md focus:outline-none"
            >
              Register
            </button>
            <p className="text-sm text-center text-white">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </p>
          </form>
          {error && (
            <p className="text-sm text-center text-red font-semibold">
              {error}
            </p>
          )}
        </div>
      </StyledBox>
    </div>
  );
}
