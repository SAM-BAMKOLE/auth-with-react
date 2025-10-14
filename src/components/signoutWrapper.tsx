import { userSignout } from "@/utils/helpers";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function SignoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const handleSignout = async () => {
    const result = await userSignout();
    toast.info(result.message);
    navigate("/signin");
  };

  return <span onClick={handleSignout}>{children}</span>;
}
