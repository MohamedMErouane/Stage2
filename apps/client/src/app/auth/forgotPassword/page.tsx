"use client";

import Appbar from "@/app/components/Appbar";
import { forgotPassword } from "@/lib/actions/authActions";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email!"),
});

type InputType = z.infer<typeof FormSchema>;

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const submitRequest: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await forgotPassword(data.email);
      if (result) toast.success("Reset password link was sent to your email.");
      reset();
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <Appbar />
      <div className="flex h-screen">
        <div className="flex-1 flex justify-center items-center bg-white">
          <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl mb-4 font-poppins font-semibold text-center text-black">
              Forgot Password
            </h1>
            <div className="items-center gap-4">
              <form
                className="col-span-1 flex flex-col gap-2 p-2"
                onSubmit={handleSubmit(submitRequest)}
              >
                <Input
                  placeholder="Email"
                  {...register("email")}
                  startContent={<EnvelopeIcon className="w-4" />}
                  errorMessage={errors.email?.message}
                  className="w-full rounded-md p-3 focus:outline-none focus:border-blue-500 text-black"
                />
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  disabled={isSubmitting}
                  color="primary"
                  className="w-full bg-gradient-to-r from-indigo-500 to-indigo-500 text-white rounded-md py-3 font-semibold transition duration-300 hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-600"
                >
                  {isSubmitting ? "Please Wait..." : "Submit"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
