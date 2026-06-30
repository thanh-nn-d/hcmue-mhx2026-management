import { useState } from "react";
import { useNavigate } from "react-router-dom";
import accounts from "../data/accounts";
import { useAuth } from "../context/AuthContext";

import logoGroup from "../assets/logos/logo-group.png";
import logoMhx from "../assets/logos/logo-mhx-2026.png";
import bgSkyCity from "../assets/backgrounds/bg-sky-soft.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const account = accounts.find(
      (item) => item.username === username && item.password === password
    );

    if (!account) {
      alert("Sai tài khoản hoặc mật khẩu!");
      return;
    }

    login(account);

    if (account.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/team");
    }
  };

  return (
    <div
      className="min-h-screen overflow-y-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgSkyCity})` }}
    >
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col px-10 py-4">
        <p className="text-center text-base font-extrabold uppercase tracking-wide text-blue-900">
          CHÀO MỪNG KỈ NIỆM 50 NĂM NGÀY TRUYỀN THỐNG TRƯỜNG ĐẠI HỌC SƯ PHẠM TP. HỒ CHÍ MINH (27/10/1976 - 27/10/2026)
        </p>

        <div className="mt-4 flex items-center justify-between">
          <img
            src={logoGroup}
            alt="Logo đơn vị"
            className="h-28 object-contain"
          />

          <img
            src={logoMhx}
            alt="Mùa hè xanh 2026"
            className="h-34 object-contain"
          />
        </div>

        <div className="mt-4 text-center">
          <h1
            className="text-[42px] font-black uppercase tracking-wide text-green-600"
            style={{
              textShadow: "0 2px 0 #fff, 0 4px 10px rgba(0,0,0,.16)",
            }}
          >
            HỆ THỐNG QUẢN LÝ HOẠT ĐỘNG
          </h1>

          <p
            className="mt-2 text-[22px] font-black uppercase text-blue-700"
            style={{
              textShadow: "0 2px 0 #fff, 0 3px 8px rgba(0,0,0,.14)",
            }}
          >
            CHIẾN DỊCH TÌNH NGUYỆN MÙA HÈ XANH
          </p>

          <p
            className="text-[22px] font-black uppercase text-blue-700"
            style={{
              textShadow: "0 2px 0 #fff, 0 3px 8px rgba(0,0,0,.14)",
            }}
          >
            TRƯỜNG ĐẠI HỌC SƯ PHẠM TP.HCM
          </p>

          <p className="mt-1 text-base font-bold uppercase text-blue-700">
            LẦN THỨ 33, NĂM 2026
          </p>
        </div>

        <main className="mt-5 flex justify-center">
          <div className="w-full max-w-[560px] rounded-[26px] border-4 border-green-500 bg-white/95 px-8 py-6 shadow-2xl">
            <h2 className="mb-5 text-center text-3xl font-black text-green-600">
              Đăng nhập
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-base font-bold text-gray-700">
                  Tài khoản
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tài khoản..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-base font-bold text-gray-700">
                  Mật khẩu
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-green-600 py-3 text-lg font-black text-white shadow-lg transition hover:bg-green-700"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;