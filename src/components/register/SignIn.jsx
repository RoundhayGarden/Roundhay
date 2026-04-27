import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginFormValidationSchema } from "../../utils/validtionSchema";
import { onInvalid, handleToastMessage } from "../../utils/toastMassages";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { signInUser } from "../../../services/seriesApi";

const SignIn = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(loginFormValidationSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      const user = await signInUser(values);
      localStorage.setItem("user", JSON.stringify(user));
      handleToastMessage(`Welcome back, ${user.username}!`, "success");
      navigate("/");
    } catch (err) {
      handleToastMessage(err.message || "Something went wrong.", "error");
    }
  };

  const fields = [
    { name: "email",    label: "Email",    type: "text",     placeholder: "you@example.com" },
    { name: "password", label: "Password", type: "password", placeholder: "" },
  ];

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .su-input::placeholder { color: var(--muted-foreground); opacity: 0.6; }
        .su-submit:hover  { opacity: 0.88; transform: translateY(-1px); }
        .su-submit:active { transform: translateY(0px); }
        .su-ghost:hover   { background-color: var(--accent) !important; }
      `}</style>

      <div style={{ borderRadius: "16px", width: "100%", maxWidth: "420px", padding: "0", overflow: "hidden", animation: "slideUp 0.5s ease both" }}>
        <div style={{ padding: "32px 32px 28px" }}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ color: "var(--foreground)", fontSize: "clamp(22px, 4vw, 28px)", fontWeight: "600", lineHeight: "1.15", letterSpacing: "-0.02em", margin: 0 }}>
              Sign in Roundhay
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
              {fields.map((f) => (
                <div key={f.name} style={{ marginBottom: "12px" }}>
                  <FormField
                    control={form.control}
                    name={f.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: "600", letterSpacing: "0.04em", textTransform: "uppercase", display: "flex", alignItems: "center", marginBottom: "6px" }}>
                          {f.label}
                        </FormLabel>
                        <FormControl>
                          <Input type={f.type} placeholder={f.placeholder} className="su-input"
                            style={{ backgroundColor: "var(--input)", borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "8px", height: "44px", fontSize: "14px", paddingLeft: "12px", transition: "border-color 0.2s, box-shadow 0.2s" }}
                            {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <div style={{ marginTop: "8px" }}>
                <button type="submit" className="su-submit"
                  style={{ width: "100%", height: "46px", backgroundColor: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", letterSpacing: "0.04em", cursor: "pointer", transition: "opacity 0.2s, transform 0.15s" }}>
                  SIGN IN
                </button>
              </div>
            </form>
          </Form>

          <div style={{ paddingTop: "24px" }}>
            <button type="button" className="su-ghost" onClick={() => navigate("/signup")}
              style={{ width: "100%", height: "44px", backgroundColor: "transparent", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "background-color 0.2s" }}>
              CREATE A NEW ACCOUNT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;