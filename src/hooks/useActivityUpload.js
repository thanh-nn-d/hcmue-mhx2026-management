import { supabase } from "../lib/supabase";

const IMAGE_BUCKET = "activity-images";
const FILE_BUCKET = "activity-files";

const MAX_IMAGE_WIDTH = 1600;
const MAX_IMAGE_HEIGHT = 1600;
const IMAGE_QUALITY = 0.75;

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

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Không thể đọc ảnh."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Không thể nén ảnh."));
          return;
        }

        resolve(blob);
      },
      type,
      quality
    );
  });
}

async function compressImage(file) {
  const image = await loadImageFromFile(file);

  let width = image.width;
  let height = image.height;

  const scale = Math.min(
    MAX_IMAGE_WIDTH / width,
    MAX_IMAGE_HEIGHT / height,
    1
  );

  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Không thể xử lý ảnh.");
  }

  context.drawImage(image, 0, 0, width, height);

  const compressedBlob = await canvasToBlob(
    canvas,
    "image/jpeg",
    IMAGE_QUALITY
  );

  const originalNameWithoutExtension =
    file.name.replace(/\.[^/.]+$/, "");

  return new File(
    [compressedBlob],
    `${originalNameWithoutExtension}.jpg`,
    {
      type: "image/jpeg",
      lastModified: Date.now(),
    }
  );
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
      try {
        const compressedFile = await compressImage(file);

        const fileName = buildSafeFileName(
          compressedFile.name,
          index + 1
        );

        const filePath = `${activityId}/${fileName}`;

        const { error } = await supabase.storage
          .from(IMAGE_BUCKET)
          .upload(filePath, compressedFile, {
            cacheControl: "3600",
            upsert: true,
            contentType: compressedFile.type,
          });

        if (error) {
          console.error("Lỗi upload ảnh:", error);
          throw new Error("Không thể tải ảnh minh chứng.");
        }

        uploadedImages.push({
          name: file.name,
          path: filePath,
          url: getPublicUrl(IMAGE_BUCKET, filePath),

          // Lưu kích thước SAU KHI nén
          size: compressedFile.size,

          type: compressedFile.type,
        });
      } catch (error) {
        console.error("Lỗi xử lý ảnh:", error);

        throw new Error(
          error?.message || "Không thể tải ảnh minh chứng."
        );
      }
    }

    return uploadedImages;
  };

  const uploadParticipantFile = async (activityId, file) => {
    if (!isFileObject(file)) {
      throw new Error(
        "Vui lòng tải danh sách chiến sĩ tham gia hoạt động."
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!["xlsx", "xls"].includes(extension)) {
      throw new Error(
        "Danh sách chiến sĩ chỉ chấp nhận file Excel."
      );
    }

    const fileName = buildSafeFileName(file.name);
    const filePath = `${activityId}/${fileName}`;

    const { error } = await supabase.storage
      .from(FILE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error("Lỗi upload danh sách chiến sĩ:", error);

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
    const imagePaths = evidenceImages
      .map((item) => item.path)
      .filter(Boolean);

    const filePaths = participantFile?.path
      ? [participantFile.path]
      : [];

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