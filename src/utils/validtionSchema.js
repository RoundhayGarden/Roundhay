import * as z from "zod";

const loginFormValidationSchema = z.object({
  email: z.email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const signupFormValidationSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(3, { message: "Username must be at least 3 characters." })
      .max(30, { message: "Username must be at most 30 characters." })
      .regex(/^[a-zA-Z]/, { message: "Username must start with a letter." }),

    email: z.email({ message: "Invalid email address." }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),

    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export { loginFormValidationSchema, signupFormValidationSchema };
