import AuthBranding from
  "../components/AuthBranding";

import ForgotPasswordForm from
  "../components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBranding />

      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900">
            Forgot password?
          </h1>

          <p className="mb-8 mt-2 text-sm text-gray-500">
            Enter your registered
            email address and we'll
            send password reset
            instructions.
          </p>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}