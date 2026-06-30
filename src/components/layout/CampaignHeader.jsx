import logoGroup from "../../assets/logos/logo-group.png";
import logoMhx from "../../assets/logos/logo-mhx-2026.png";

function CampaignHeader({ variant = "dashboard" }) {
  const isLogin = variant === "login";

  return (
    <div
      className={`mx-auto ${
        isLogin ? "max-w-[1500px] px-10 pt-4" : "max-w-7xl px-8 pt-3"
      }`}
    >
      <p
        className={`text-center font-extrabold uppercase tracking-wide text-blue-900 ${
          isLogin ? "text-base" : "text-sm"
        }`}
      >
        CHÀO MỪNG KỈ NIỆM 50 NĂM NGÀY TRUYỀN THỐNG
        TRƯỜNG ĐẠI HỌC SƯ PHẠM TP. HỒ CHÍ MINH
        (27/10/1976 - 27/10/2026)
      </p>

      <div
        className={`flex items-center justify-between ${
          isLogin ? "mt-4" : "mt-3"
        }`}
      >
        <img
          src={logoGroup}
          alt="Logo đơn vị"
          className={`object-contain ${
            isLogin ? "h-28" : "h-20"
          }`}
        />

        <img
          src={logoMhx}
          alt="MHX"
          className={`object-contain ${
            isLogin ? "h-32" : "h-24"
          }`}
        />
      </div>

      <div
        className={`text-center ${
          isLogin ? "mt-4" : "mt-2"
        }`}
      >
        <h1
          className={`font-black uppercase tracking-wide text-green-600 ${
            isLogin ? "text-[42px]" : "text-4xl"
          }`}
          style={{
            textShadow:
              "0 2px 0 #fff, 0 4px 10px rgba(0,0,0,.16)",
          }}
        >
          HỆ THỐNG QUẢN LÝ HOẠT ĐỘNG
        </h1>

        <p
          className={`mt-2 font-black uppercase text-blue-700 ${
            isLogin ? "text-[22px]" : "text-lg"
          }`}
          style={{
            textShadow:
              "0 2px 0 #fff, 0 3px 8px rgba(0,0,0,.14)",
          }}
        >
          CHIẾN DỊCH TÌNH NGUYỆN MÙA HÈ XANH
        </p>

        <p
          className={`font-black uppercase text-blue-700 ${
            isLogin ? "text-[22px]" : "text-lg"
          }`}
          style={{
            textShadow:
              "0 2px 0 #fff, 0 3px 8px rgba(0,0,0,.14)",
          }}
        >
          TRƯỜNG ĐẠI HỌC SƯ PHẠM TP.HCM
        </p>

        <p
          className={`mt-1 font-bold uppercase text-blue-700 ${
            isLogin ? "text-base" : "text-sm"
          }`}
        >
          LẦN THỨ 33, NĂM 2026
        </p>
      </div>
    </div>
  );
}

export default CampaignHeader;