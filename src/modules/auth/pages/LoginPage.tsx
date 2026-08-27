import AuthBranding from
  "../components/AuthBranding";

import LoginForm from
  "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBranding />

      <div className="flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#123B7A] font-bold text-white">
                DG
              </div>

              <span className="font-bold text-gray-900">
                DG Service
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to access your
              service management
              dashboard.
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 rounded-lg bg-gray-100 p-3 text-center text-xs text-gray-500">
            Demo: admin@dg.com /
            123456
          </div>
        </div>
      </div>
    </div>
  );
}