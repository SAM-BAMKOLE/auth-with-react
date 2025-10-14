import { HeroHeader } from "@/components/header";
import { LoginForm } from "@/components/login-form";

export default function SigninPage() {
  return (
    <>
      <HeroHeader />
      <main className="flex items-center justify-center min-h-screen p-5">
        <div className="w-full max-w-4xl mx-auto">
          <LoginForm />
        </div>
      </main>
    </>
  );
}
