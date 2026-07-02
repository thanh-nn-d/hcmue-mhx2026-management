import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function ChangePasswordModal({
  open,
  onClose,
}) {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword.trim()) {
      alert("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Mật khẩu mới phải có tối thiểu 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Xác nhận mật khẩu không khớp.");
      return;
    }

    setLoading(true);

    const { data: account, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("username", user.username)
      .eq("password", currentPassword)
      .maybeSingle();

    if (error) {
      setLoading(false);
      alert("Không thể kết nối cơ sở dữ liệu.");
      return;
    }

    if (!account) {
      setLoading(false);
      alert("Mật khẩu hiện tại không đúng.");
      return;
    }

    const { error: updateError } = await supabase
      .from("accounts")
      .update({
        password: newPassword,
        password_changed: true,
      })
      .eq("id", account.id);

    setLoading(false);

    if (updateError) {
      alert("Không thể đổi mật khẩu.");
      return;
    }

    alert("Đổi mật khẩu thành công.");

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">

        <div className="bg-green-600 px-8 py-5 text-white">
          <h2 className="text-2xl font-black">
            Đổi mật khẩu
          </h2>

          <p className="mt-1 text-sm opacity-90">
            Thay đổi mật khẩu đăng nhập của đội hình.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-8"
        >
          <div>
            <label className="mb-2 block font-bold text-gray-700">
              Mật khẩu hiện tại
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-gray-700">
              Mật khẩu mới
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-gray-700">
              Xác nhận mật khẩu mới
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl bg-gray-300 px-6 py-3 font-bold text-gray-700 transition hover:bg-gray-400 disabled:opacity-60"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;