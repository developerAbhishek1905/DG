// import {
//   Mail,
// } from "lucide-react";

// import {
//   useState,
// } from "react";

// import {
//   useForm,
// } from "react-hook-form";

// import {
//   Link,
// } from "react-router-dom";

// import {
//   forgotPasswordApi,
// } from "../services/authApi";

// import type {
//   ForgotPasswordPayload,
// } from "../types/auth.types";

// export default function ForgotPasswordForm() {
//   const [
//     message,
//     setMessage,
//   ] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: {
//       errors,
//       isSubmitting,
//     },
//   } =
//     useForm<ForgotPasswordPayload>();

//   const onSubmit = async (
//     data: ForgotPasswordPayload
//   ) => {
//     const response =
//       await forgotPasswordApi(
//         data
//       );

//     setMessage(
//       response.message
//     );
//   };

//   return (
//     <form
//       onSubmit={
//         handleSubmit(onSubmit)
//       }
//       className="space-y-5"
//     >
//       {message && (
//         <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
//           {message}
//         </div>
//       )}

//       <div>
//         <label className="mb-1.5 block text-sm font-medium text-gray-700">
//           Email Address
//         </label>

//         <div className="relative">
//           <Mail
//             size={18}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//           />

//           <input
//             type="email"
//             {...register(
//               "email",
//               {
//                 required:
//                   "Email is required",
//               }
//             )}
//             className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
//           />
//         </div>

//         {errors.email && (
//           <p className="mt-1 text-xs text-red-600">
//             {
//               errors.email
//                 .message
//             }
//           </p>
//         )}
//       </div>

//       <button
//         disabled={isSubmitting}
//         className="w-full rounded-lg bg-[#123B7A] py-3 text-sm font-semibold text-white disabled:opacity-60"
//       >
//         {isSubmitting
//           ? "Sending..."
//           : "Send Reset Link"}
//       </button>

//       <div className="text-center">
//         <Link
//           to="/login"
//           className="text-sm font-medium text-[#123B7A]"
//         >
//           ← Back to Login
//         </Link>
//       </div>
//     </form>
//   );
// }