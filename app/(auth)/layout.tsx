import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real app, we would check server-side if the user is authenticated
  // For this demo, we'll just render the children
  return <>{children}</>;
}