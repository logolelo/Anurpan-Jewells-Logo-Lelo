import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { isAuthenticated, startLogin, logout } from "@/lib/auth";
import { User, LogOut } from "lucide-react";

export default function Login() {
  const authed = isAuthenticated();
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold mb-6">Customer Account</h1>
        {authed ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">You are signed in.</p>
            <Button onClick={() => logout("/")} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">Sign in to view your orders and manage your account.</p>
            <Button onClick={() => startLogin()} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Sign in
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
