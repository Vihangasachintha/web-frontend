import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GrGoogle } from "react-icons/gr"
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const googleLogin  = useGoogleLogin({
        onSuccess: async (response)=>{
            try {
                const accessToken = response.access_token
                console.log("Access token:", accessToken)
                
                const res = await axios.post(
                    import.meta.env.VITE_BACKEND_URL+"/api/users/login/google", 
                    { accessToken: accessToken }
                )
                
                console.log("Backend response:", res.data)
                toast.success("Login Successful")
                localStorage.setItem("token", res.data.token)
                
                if(res.data.role === "admin"){
                    navigate("/admin/")
                } else {
                    navigate("/")
                }
            } catch (error) {
                console.error("Google login error:", error)
                const message = error.response?.data?.message || "Google login failed. Please try again."
                toast.error(message)
            }
        },
        onError: (error) => {
            console.error("Google OAuth error:", error)
            toast.error("Google login failed. Please try again.")
        }
    })

  async function handleLogin() {
    // console.log(email);
    // console.log(password);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/users/login",
        {
          email: email,
          password: password,
        }
      );
      toast.success("Login successful!");
      console.log(response.data);
      localStorage.setItem("token", response.data.token);

      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (e) {
      // console.log(e.response.data.message );
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
        console.error(e);
      }
    }
  }

  return (
    <div className="w-full h-screen bg-[url('/login.jpg')] bg-center bg-cover flex items-center justify-evenly">
      <div className="w-[50%] h-full"></div>
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[600px] backdrop-blur-md rounded-[20px] shadow-xl flex flex-col justify-center items-center">
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            type="email "
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[10px]"
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[20px] my-[20px]"
            type="password"
          />
          <button
            onClick={handleLogin}
            className="w-[300px] h-[50px] cursor-pointer  bg-[#c3efe9] rounded-[20px] text-[20px] font-bold text-white my-[20px] mb-[20px]"
          >
            Login
          </button>
          <button onClick={googleLogin} className="w-[300px] cursor-pointer h-[50px] flex justify-center items-center bg-[#c3efe9] rounded-[20px] my-[20px] text-[20px] font-bold text-white" >
                    <GrGoogle className="text-xl text-gray-600 cursor-pointer hover:text-gray-800 ml-2" />
                    <span className="text-gray-600 text-xl font-semibold">Login with Google</span>
                </button>
        </div>
      </div>
    </div>
  );
}
