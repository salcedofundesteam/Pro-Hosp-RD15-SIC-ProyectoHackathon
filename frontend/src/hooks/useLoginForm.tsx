"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useLoginForm() {
  const router = useRouter();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [handleInputs, setHandleInputs] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHandleInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const { username, password } = handleInputs;

    if (username === "admin" && password === "admin") {
      setSuccessMessage("✅ Autenticación completa");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } else {
      setErrorMessage("❌ Error al autentificar");
    }
  };

  useEffect(() => {
    if (!errorMessage) return;
    const t = setTimeout(() => setErrorMessage(""), 3000);
    return () => clearTimeout(t);
  }, [errorMessage]);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  return { handleInputs, handleChange, handleSubmit, successMessage, errorMessage };
}