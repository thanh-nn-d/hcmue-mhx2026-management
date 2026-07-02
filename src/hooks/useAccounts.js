import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .order("role", { ascending: true })
      .order("team", { ascending: true });

    setLoading(false);

    if (error) {
      console.error("Lỗi tải tài khoản:", error);
      alert("Không thể tải danh sách tài khoản.");
      return;
    }

    setAccounts(data || []);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const resetPassword = async (account) => {
    const confirmed = window.confirm(
      `Đặt lại mật khẩu của "${account.full_name}" về mặc định (123456)?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("accounts")
      .update({
        password: "123456",
        password_changed: false,
      })
      .eq("id", account.id);

    if (error) {
      console.error(error);
      alert("Không thể đặt lại mật khẩu.");
      return;
    }

    setAccounts((prev) =>
      prev.map((item) =>
        item.id === account.id
          ? {
              ...item,
              password: "123456",
              password_changed: false,
            }
          : item
      )
    );

    alert("Đã đặt lại mật khẩu.");
  };

  return {
    loading,
    accounts,
    fetchAccounts,
    resetPassword,
  };
}

export default useAccounts;