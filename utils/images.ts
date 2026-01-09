/**
 * Constructs a full Cloudflare R2 URL from an image path
 * @param imagePath - The image path from R2 storage (e.g., "mosques/image.jpg")
 * @returns Full URL or empty string if path is invalid
 */
export function getR2ImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '';

  // If already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const baseUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL;
  if (!baseUrl) {
    console.warn('NEXT_PUBLIC_CLOUDFLARE_R2_URL is not defined');
    return imagePath;
  }

  // Ensure path starts with '/'
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${baseUrl}${normalizedPath}`;
}
