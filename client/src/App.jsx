
import React from "react"
import AnimatedRoutes from "./components/AnimatedRoutes"
import { BrowserRouter as Router } from "react-router-dom";


export function App() {

  return (
    <>
    <Router>
    <AnimatedRoutes />
    </Router>
    </>
    );
}