import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleCallback } from "@/lib/auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const ok = await handleCallback();
      navigate(ok ? "/account" : "/login");
    })();
  }, [navigate]);
  return null;
}
