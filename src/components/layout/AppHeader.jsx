import logoGroup from "../../assets/logos/logo-group.png";
import logoMhx from "../../assets/logos/logo-mhx-2026.png";

function AppHeader({ user, onLogout, theme = "green" }) {
  const mainColor = theme === "blue" ? "text-blue-700" : "text-green-600";
  const barColor = theme === "blue" ? "bg-blue-600" : "bg-green-600";

  return (
    <header className="mx-auto max-w-[1500px] px-10 pt-4">
      <p className="text-center text-base font-extrabold uppercase tracking-wide text-blue-900">
        CHÀO MỪNG KỈ NIỆM 50 NĂM NGÀY TRUYỀN THỐNG TRƯỜNG ĐẠI HỌC SƯ PHẠM TP. HỒ CHÍ MINH
      </p>

      <div className="mt-4 flex items-center justify-between">
        <img src={logoGroup} alt="Logo đơn vị" className="h-20 object-contain" />

        <img src={logoMhx} alt="Mùa hè xanh 2026" className="h-24 object-contain" />
      </div>

      <div className="mt-4 text-center">
        <h1
          className={`text-[42px] font-black uppercase tracking-wide ${mainColor}`}
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

        <p className="text-base font-bold uppercase text-blue-700">
          LẦN THỨ 33, NĂM 2026
        </p>
      </div>

      <div className={`mt-5 rounded-2xl ${barColor} px-6 py-3 text-white shadow-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">Xin chào, {user?.name}</p>
            <p className="text-sm opacity-90">{user?.team || "Ban Chỉ huy"}</p>
          </div>

          <button
            onClick={onLogout}
            className="rounded-xl bg-white px-5 py-2 font-bold text-gray-700 shadow hover:bg-gray-100"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;