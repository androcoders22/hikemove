import { api } from "../axios";

const MAX_UPLOAD_SIZE_MB = 2;
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

type AxiosLikeError = Error & {
  response?: {
    data?: {
      message?: string;
    };
  };
};

const buildSizeError = (message: string): AxiosLikeError => {
  const error = new Error(message) as AxiosLikeError;
  error.response = { data: { message } };
  return error;
};

const compressImageIfNeeded = async (file: File) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  if (!file.type.startsWith("image/")) {
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      throw buildSizeError(
        `File exceeds ${MAX_UPLOAD_SIZE_MB}MB. Please upload a smaller file.`,
      );
    }
    return file;
  }

  if (file.size <= MAX_UPLOAD_SIZE_BYTES) {
    return file;
  }

  return new Promise<File>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const scale = Math.min(
          1,
          Math.sqrt(MAX_UPLOAD_SIZE_BYTES / file.size) * 0.95,
        );
        const targetWidth = Math.max(Math.round(image.width * scale), 1);
        const targetHeight = Math.max(Math.round(image.height * scale), 1);

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Unable to prepare canvas for compression"));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
        const quality = mimeType === "image/jpeg" ? 0.82 : undefined;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Unable to compress image"));
              return;
            }

            if (blob.size > MAX_UPLOAD_SIZE_BYTES) {
              reject(
                buildSizeError(
                  `Image is too large even after compression. Please upload a file smaller than ${MAX_UPLOAD_SIZE_MB}MB.`,
                ),
              );
              return;
            }

            const compressed = new File([blob], file.name, {
              type: mimeType,
              lastModified: Date.now(),
            });
            resolve(compressed);
          },
          mimeType,
          quality,
        );
      };

      image.onerror = () => {
        reject(new Error("Unable to read image for compression"));
      };

      image.src = reader.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Unable to read file for compression"));
    };

    reader.readAsDataURL(file);
  });
};

export const uploadImageAPI = async (file: File) => {
  const processedFile = await compressImageIfNeeded(file);

  if (processedFile.size > MAX_UPLOAD_SIZE_BYTES) {
    throw buildSizeError(
      `File exceeds ${MAX_UPLOAD_SIZE_MB}MB. Please upload a smaller file.`,
    );
  }

  const formData = new FormData();
  formData.append("file", processedFile);

  const response = await api.post("/aws", formData, {
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
  return response.data;
};
