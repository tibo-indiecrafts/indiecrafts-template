import Image from "next/image";
import { Download } from "lucide-react";
import Link from "next/link";

export function DownloadableLogoCard({
  src,
  alt,
  width = 720,
  height = 600,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  return (
    <div data-grid-content className="group relative p-1">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-xl border"
      />
      <Link
        href={src}
        download
        className="bg-background/80 text-foreground ring-foreground/10 hover:bg-background absolute right-3 bottom-3 inline-flex size-8 origin-bottom-right items-center justify-center rounded-md text-sm ring-1 backdrop-blur-sm duration-200 not-group-hover:scale-90 not-group-hover:opacity-0 active:scale-98"
      >
        <Download className="size-4" />
        <span className="sr-only">Download {alt}</span>
      </Link>
    </div>
  );
}
