import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const SignUp = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      gender: "",
      image: null,
      interest: [],
      password: "",
      confirmpassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(15, "Must be 15 characters or less")
        .min(3, "Must be 3 characters or more")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      gender: Yup.string().required("Gender is required"),
      image: Yup.mixed().required("Image is required"),
      interest: Yup.array()
        .min(1, "Please select at least one interest")
        .required("Interest is required"),
      password: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(12, "Must be 12 characters or less")
        .required("Password is required"),
      confirmpassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
    
      // Append all text fields first
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('gender', values.gender);
      formData.append('password', values.password);
      formData.append('confirmpassword', values.confirmpassword);
      values.interest.forEach(interest => {
        formData.append('interest', interest);
      });
    
      // Append file if present
      if (values.image) {
        formData.append('image', values.image);
      }
    
      try {
        const response = await axios.post('http://localhost:8007/auth/signup', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Response:', response.data);
        alert('Signup successful!');
      } catch (error) {
        console.error('Signup error:', error.response ? error.response.data : error.message);
        alert('Signup failed!');
      }
    },
    
  });

  const handleInterestChange = (event) => {
    const { value, checked } = event.target;
    const newinterest = checked
      ? [...formik.values.interest, value]
      : formik.values.interest.filter((interest) => interest !== value);

    formik.setFieldValue("interest", newinterest);
  };

  const interestOptions = ["sports", "movies", "tech", "travel"];

  return (
    <div className="p-8  bg-gray-100 min-h-screen flex items-center justify-center ">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
        <div className="text-3xl font-bold underline text-center mb-6">
          SignUp Page
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-xs italic">
                {formik.errors.name}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-xs italic">
                {formik.errors.email}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.gender}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formik.touched.gender && formik.errors.gender ? (
              <div className="text-red-500 text-xs italic">
                {formik.errors.gender}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 text-sm font-bold mb-2 "
            >
              Image:
            </label>
            <input
              id="image"
              name="image"
              type="file"
              onChange={(event) => {
                formik.setFieldValue("image", event.currentTarget.files[0]);
              }}
              onBlur={formik.handleBlur}
              className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {formik.touched.image && formik.errors.image ? (
              <div className="text-red-500 text-xs italic">
                {formik.errors.image}
              </div>
            ) : null}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Interests:
            </label>
            {interestOptions.map((interest, index) => (
              <div key={index}>
                <label htmlFor={interest} className="inline-flex items-center">
                  <input
                    id={interest}
                    type="checkbox"
                    name="interest"
                    value={interest}
                    onChange={handleInterestChange}
                    checked={formik.values.interest.includes(interest)}
                    className="form-checkbox h-5 w-5 text-gray-600"
                  />
                  <span className="ml-2 text-gray-700 capitalize">
                    {interest}
                  </span>
                </label>
              </div>
            ))}
            {formik.touched.interest && formik.errors.interest ? (
              <div className="text-red-500 text-xs italic">
                {formik.errors.interest}
              </div>
            ) : null}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-xs italic">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmpassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm Password:
            </label>
            <input
              id="confirmpassword"
              name="confirmpassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmpassword}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
              <div className="text-red-500 text-xs italic">
                {formik.errors.confirmpassword}
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
