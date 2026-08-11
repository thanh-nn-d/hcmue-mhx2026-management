import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const BUCKET = "activity-images";

const START_DATE = "2026-07-07T00:00:00+07:00";
const END_DATE = "2026-07-30T00:00:00+07:00";

async function main() {
  console.log("Đang lấy danh sách ảnh cần xóa...");

  const { data, error } = await supabase
    .schema("storage")
    .from("objects")
    .select("name, created_at")
    .eq("bucket_id", BUCKET)
    .gte("created_at", START_DATE)
    .lt("created_at", END_DATE);

  if (error) {
    console.error("Không lấy được danh sách ảnh:", error);
    process.exit(1);
  }

  const paths = (data || []).map((item) => item.name);

  console.log(`Tìm thấy ${paths.length} ảnh cần xóa.`);

  if (paths.length === 0) {
    console.log("Không có ảnh nào cần xóa.");
    return;
  }

  const batchSize = 100;

  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize);

    const { error: removeError } = await supabase.storage
      .from(BUCKET)
      .remove(batch);

    if (removeError) {
      console.error(
        `Lỗi khi xóa batch ${i + 1}-${i + batch.length}:`,
        removeError
      );
      process.exit(1);
    }

    console.log(
      `Đã xóa ${Math.min(i + batch.length, paths.length)}/${paths.length} ảnh`
    );
  }

  console.log("Hoàn tất xóa ảnh từ 07/07/2026 đến hết 29/07/2026.");
}

main();