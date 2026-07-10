/** Inserts a Cloudinary transformation for a 1:1 cropped thumbnail. */
export function cloudinaryThumb(url: string): string {
  return url.replace('/upload/', '/upload/c_fill,ar_1:1,g_auto/')
}
