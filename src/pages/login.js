import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(12, "Must be 12 characters or less")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:8007/auth/login", {
          email: values.email,
          password: values.password,
        });
        console.log("Login successful:", response.data);
        if (response.data && response.data?.token) {
            const expiry = new Date().getTime() + 3600 * 1000;  // `expiresIn` is expected to be in seconds
            localStorage.setItem('authToken', JSON.stringify({ Token: response.data?.token, expiry }));
        }
        if(response.data.message){
          toast.success(response.data.message);
        }
        navigate("/");
      } catch (error) {
        toast.error(error.response.data.message);
        console.error(
          "Login failed:",
          error.response ? error.response.data : error.message
        );
      }
     
    },
    
  });

  const {  handleChange,handleBlur,handleSubmit,values,touched,errors} = formik;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
      <div className="text-3xl font-bold underline text-center mb-6">
          Login
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
           
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            
            placeholder="Enter your email"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {touched.email && errors.email ? (
              <div className="text-red-500 text-xs italic">
                {errors.email}
              </div>
            ) : null}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            placeholder="Enter your password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
          />
          {touched.password && errors.password ? (
              <div className="text-red-500 text-xs italic">
                {errors.password}
              </div>
            ) : null}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
