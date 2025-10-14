import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import downloadImage from "@/assets/download.jpeg";
import { useState } from "react";
import { userSignin } from "@/utils/helpers";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // await the async signup so errors are caught here and the network request is actually made
    const result = await userSignin({ ...form });

    if (result.error && !result.data) {
      toast.error("There was an error with the request");
      return;
    } else if (result.error) {
      if (result.data.details) {
        const errors = (result.data.details as Array<{ message: string }>).map(
          (error) => error.message
        );
        setFormErrors(errors);
      }
      toast.error(result.data.message);
      return;
    }

    login(result.accessToken, result.user);
    toast.success("You have been logged in successfully");
    navigate("/dashboard");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={submitHandler}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Acme Inc account
                </p>
              </div>
              {formErrors && (
                <ul className="pl-3.5 font-mono text-xs text-red-500 space-y-1.5 list-disc">
                  {formErrors.map((error) => (
                    <li>{error}</li>
                  ))}
                </ul>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <Button type="submit">Sign in</Button>
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={downloadImage}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
