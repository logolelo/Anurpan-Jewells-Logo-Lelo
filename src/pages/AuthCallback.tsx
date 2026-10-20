import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleCallback } from "@/lib/auth";
import SEO from "@/components/SEO";

export default function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const ok = await handleCallback();
      navigate(ok ? "/account" : "/login");
    })();
  }, [navigate]);
  return <SEO title="Authenticating — Anurpan Jewellery" noindex />;
}
