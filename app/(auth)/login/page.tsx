"use client"; // 사용자 상호작용(버튼 클릭, 라우팅)이 필요하므로 클라이언트 컴포넌트로 선언

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 새로고침 방지
    // 실제로는 여기서 서버로 아이디/비밀번호를 보내 검증합니다.
    // 지금은 UI 구현 단계이므로 바로 대시보드로 이동시킵니다.
    document.cookie = "isLoggedIn=true; path=/;";
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Security Admin</h1>
          <p className="text-gray-500 mt-2 text-sm">
            대시보드에 접근하려면 로그인하세요.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <button
            type="submit"
            className="w-full bg-slate-900 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors mt-6"
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="w-full bg-slate-900 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors mt-3"
          >
            회원가입
          </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
