import React, { useState } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import "./Signup.scss";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await axiosClient.post("/auth/signup", {
        name,
        email,
        password,
      });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="Signup">
      <div className="signup-box">
        <h2 className="heading">Signup</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            className="name"
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            className="email"
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            className="password"
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input type="submit" className="submit" />
        </form>
        <p className="subheading">
          Already have an account? <Link to="/login">Log In</Link>{" "}
        </p>
      </div>
    </div>
  );
}

export default Signup;
