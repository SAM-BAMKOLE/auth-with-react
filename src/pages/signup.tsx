import { HeroHeader } from "@/components/header";
import { RegisterForm } from "@/components/register-form";

export default function SignupPage() {
  return (
    <>
      <HeroHeader />
      <main className="flex items-center justify-center min-h-screen p-5">
        <div className="w-full max-w-4xl mx-auto">
          <RegisterForm />
        </div>
      </main>
    </>
  );
}
