import {
  createBrandOpenGraphImage,
  OG_ALT,
  OG_SIZE,
} from "@/lib/og/brand-og";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function TwitterImage() {
  return createBrandOpenGraphImage();
}
