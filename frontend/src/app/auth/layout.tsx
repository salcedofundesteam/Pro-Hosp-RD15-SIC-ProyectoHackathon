export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFD6F3] via-[#F3B7FF] to-[#E08CFF] flex items-center justify-center p-6">
      {children}
    </div>
  );
}