import useAccounts from "../hooks/useAccounts";

function AccountManagement() {
  const { accounts, loading, resetPassword } = useAccounts();

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow">
        Đang tải danh sách tài khoản...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg backdrop-blur">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-green-700">
          Quản lý tài khoản
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Quản lý tài khoản đăng nhập của các đội hình.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse overflow-hidden rounded-xl">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Tài khoản</th>
              <th className="px-4 py-3 text-left">Đội hình</th>
              <th className="w-40 px-4 py-3 text-center">Vai trò</th>
              <th className="px-4 py-3 text-center">Trạng thái mật khẩu</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {accounts.map((account) => {
              const isAdmin = account.role === "admin";

              return (
                <tr key={account.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 font-semibold">
                    {account.username}
                  </td>

                  <td className="px-4 py-4">{account.full_name}</td>

                  <td className="w-40 px-4 py-4 text-center">
                    {isAdmin ? (
                      <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-red-100 px-4 py-1 text-xs font-bold text-red-700">
                        ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-blue-100 px-4 py-1 text-xs font-bold text-blue-700">
                        ĐỘI HÌNH
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {isAdmin ? (
                      "-"
                    ) : account.password_changed ? (
                      <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                        ✅ Đã đổi
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
                        ⚠ Mặc định
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {!isAdmin && (
                      <button
                        onClick={() => resetPassword(account)}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700"
                      >
                        🔑 Reset
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-bold">Ghi chú</p>

        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Mật khẩu mặc định của tất cả đội hình là <b>123456</b>.
          </li>

          <li>
            Sau khi Reset, trạng thái sẽ trở về <b>Mặc định</b>.
          </li>

          <li>Admin không thể tự Reset mật khẩu của chính mình tại đây.</li>
        </ul>
      </div>
    </div>
  );
}

export default AccountManagement;