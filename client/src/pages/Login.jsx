import React from "react";

const Login = () => {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const handleLogin = (provider) => {
    window.location.href = `${API_BASE}/api/auth/${provider}`;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500 mb-8">Sign in to continue</p>

        {/* Google Login */}
        <button
          onClick={() => handleLogin("google")}
          className="w-full flex items-center justify-center gap-3 py-3 mb-4 border rounded-lg hover:bg-gray-50 transition"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google"
            className="w-6 h-6"
          />
          <span className="font-medium text-gray-700">Sign in with Google</span>
        </button>

        {/* GitHub Login */}
        <button
          onClick={() => handleLogin("github")}
          className="w-full flex items-center justify-center gap-3 py-3 mb-4 border rounded-lg hover:bg-gray-50 transition"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
            alt="GitHub"
            className="w-6 h-6"
          />
          <span className="font-medium text-gray-700">Sign in with GitHub</span>
        </button>

        {/* Facebook Login */}
        <button
          onClick={() => handleLogin("facebook")}
          className="w-full flex items-center justify-center gap-3 py-3 mb-4 border rounded-lg hover:bg-gray-50 transition"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg"
            alt="Facebook"
            className="w-6 h-6"
          />
          <span className="font-medium text-gray-700">
            Sign in with Facebook
          </span>
        </button>

        {/* 🧪 Dummy Login Button */}
        <button
          onClick={() => handleLogin("dummy")}
          className="w-full flex items-center justify-center gap-3 py-3 border rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
            alt="Dummy"
            className="w-6 h-6 rounded-full"
          />
          <span className="font-medium">Continue as Demo User</span>
        </button>

        <div className="mt-8 text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default Login;
