import { supabase } from "../lib/supabase";

const IMAGE_BUCKET = "activity-images";
const FILE_BUCKET = "activity-files";

function buildSafeFileName(fileName, index = 0) {
  const extension = fileName.split(".").pop()?.toLowerCase() || "file";
  const timestamp = Date.now();
  return `${timestamp}-${index}.${extension}`;
}

function getPublicUrl(bucketName, filePath) {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}

function isFileObject(value) {
  return value instanceof File;
}

function useActivityUpload() {
  const uploadEvidenceImages = async (activityId, files = []) => {
    const newFiles = files.filter(isFileObject);

    if (newFiles.length < 2) {
      throw new Error("Vui lòng tải tối thiểu 02 ảnh minh chứng.");
    }

    if (newFiles.length > 5) {
      throw new Error("Chỉ được tải tối đa 05 ảnh minh chứng.");
    }

    const uploadedImages = [];

    for (const [index, file] of newFiles.entries()) {
      const fileName = buildSafeFileName(file.name, index + 1);
      const filePath = `${activityId}/${fileName}`;

      const { error } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw new Error("Không thể tải ảnh minh chứng.");
      }

      uploadedImages.push({
        name: file.name,
        path: filePath,
        url: getPublicUrl(IMAGE_BUCKET, filePath),
        size: file.size,
        type: file.type,
      });
    }

    return uploadedImages;
  };

  const uploadParticipantFile = async (activityId, file) => {
    if (!isFileObject(file)) {
      throw new Error("Vui lòng tải danh sách chiến sĩ tham gia hoạt động.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      throw new Error("Danh sách chiến sĩ chỉ chấp nhận file Excel.");
    }

    const fileName = buildSafeFileName(file.name);
    const filePath = `${activityId}/${fileName}`;

    const { error } = await supabase.storage
      .from(FILE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw new Error("Không thể tải danh sách chiến sĩ.");
    }

    return {
      name: file.name,
      path: filePath,
      url: getPublicUrl(FILE_BUCKET, filePath),
      size: file.size,
      type: file.type,
    };
  };

  const deleteFiles = async (bucketName, filePaths = []) => {
    const validPaths = filePaths.filter(Boolean);

    if (!validPaths.length) return;

    const { error } = await supabase.storage
      .from(bucketName)
      .remove(validPaths);

    if (error) {
      console.error("Lỗi xóa file:", error);
    }
  };

  const deleteActivityUploads = async ({
    evidenceImages = [],
    participantFile = null,
  }) => {
    const imagePaths = evidenceImages.map((item) => item.path).filter(Boolean);
    const filePaths = participantFile?.path ? [participantFile.path] : [];

    await deleteFiles(IMAGE_BUCKET, imagePaths);
    await deleteFiles(FILE_BUCKET, filePaths);
  };

  return {
    uploadEvidenceImages,
    uploadParticipantFile,
    deleteActivityUploads,
  };
}

export default useActivityUpload;