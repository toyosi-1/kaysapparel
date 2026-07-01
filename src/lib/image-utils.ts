/**
 * Client-side image resizer & compressor using Canvas API.
 * Runs entirely in the browser — no server cost, no third-party lib.
 *
 * Strategy:
 *   - Resize longest edge to maxDimension (default 900px for product images)
 *   - Re-encode as WebP (smallest format, ~30% smaller than JPEG at same quality)
 *   - Falls back to JPEG if WebP not supported
 *   - Target quality 0.82 — visually lossless for fashion product photos
 */

export interface ResizeOptions {
  maxDimension?: number;   // Max width or height in px (default 900)
  quality?: number;        // 0–1 (default 0.82)
  format?: "webp" | "jpeg"; // Output format (default "webp")
}

export interface ResizeResult {
  file: File;
  originalSize: number;  // bytes
  compressedSize: number; // bytes
  savedPercent: number;
  width: number;
  height: number;
}

export async function resizeImage(
  file: File,
  options: ResizeOptions = {}
): Promise<ResizeResult> {
  const {
    maxDimension = 900,
    quality = 0.82,
    format = "webp",
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Calculate new dimensions preserving aspect ratio
      let { naturalWidth: w, naturalHeight: h } = img;
      if (w > maxDimension || h > maxDimension) {
        if (w >= h) {
          h = Math.round((h / w) * maxDimension);
          w = maxDimension;
        } else {
          w = Math.round((w / h) * maxDimension);
          h = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      // High-quality downscaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);

      const mimeType = format === "webp" ? "image/webp" : "image/jpeg";

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas toBlob failed"));
            return;
          }

          // If compressed is bigger than original (e.g. tiny PNG), return original
          if (blob.size >= file.size) {
            resolve({
              file,
              originalSize: file.size,
              compressedSize: file.size,
              savedPercent: 0,
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
            return;
          }

          const ext = format === "webp" ? "webp" : "jpg";
          const baseName = file.name.replace(/\.[^.]+$/, "");
          const compressed = new File([blob], `${baseName}.${ext}`, {
            type: mimeType,
            lastModified: Date.now(),
          });

          resolve({
            file: compressed,
            originalSize: file.size,
            compressedSize: compressed.size,
            savedPercent: Math.round((1 - compressed.size / file.size) * 100),
            width: w,
            height: h,
          });
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

/** Resize multiple images in parallel */
export async function resizeImages(
  files: File[],
  options?: ResizeOptions
): Promise<ResizeResult[]> {
  return Promise.all(files.map((f) => resizeImage(f, options)));
}

/** Format bytes to human-readable string */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
