// src/components/Auth.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  LoginInput,
  loginSchema,
  SignupInput,
  signupSchema,
} from "../utils/validations";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { unauthClient } from "../utils/api-client";


// Define the response type for the auth API
interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const {login} = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginInput | SignupInput>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
  });

  const authMutation = async (
    data: LoginInput | SignupInput
  ): Promise<AuthResponse> => {
    const response = await unauthClient.post<AuthResponse>(
      `/auth/${isLogin ? "login" : "signup"}`,
      data
    );
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: authMutation,
    onSuccess: (response: AuthResponse) => {
      if (response.token) {
        login(response.token, response.user)
      }
      toast.success(`${isLogin ? 'Logged In Successfully': 'User created'}`);
    },
    onError: (error: unknown) => {
      // Handle error with toast notification
      const errMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errMessage);
    },
  });

  const onSubmit = (data: LoginInput | SignupInput) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 flex flex-col justify-center h-screen w-full">
      <h2 className="text-2xl font-extrabold mb-5 text-center uppercase">
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              id="name"
              {...register("name")}
              className="w-full p-2 border rounded"
            />
            {errors.root?.message && (
              <span className="text-red-500 text-sm">
                {errors.root.message}
              </span>
            )}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full p-2 border rounded"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={mutation.isPending} // Corrected to use `mutation.isPending`
        >
          {mutation.isPending ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-center">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            reset();
          }}
          className="text-blue-500"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
