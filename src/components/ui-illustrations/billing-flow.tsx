import { ArrowBigDown, ArrowBigRight, Signature } from "lucide-react";
import { Vercel } from "@/components/ui-primitives/svgs/vercel";
import { Supabase } from "@/components/ui-primitives/svgs/supabase";
import { Firebase } from "@/components/ui-primitives/svgs/firebase";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { cn } from "@/lib/utils";

/**
 * Billing-flow illustration — three usage cards (Vercel / Supabase /
 * Cloudflare) flow into a signature-block payment authorization, then
 * into an invoice mock. Used by
 * `sections-secondary-hero/secondary-hero-6`. Mock copy is decorative;
 * treat as illustrations-only (no translations). The genuine
 * `InvoiceIllustration` (with its layered shadow-paper effect) and the
 * `Firebase` SVG were missing from `@tailark-pro/secondary-hero-6`'s
 * registry shipment — fetched separately via `@tailark-pro/invoice`
 * and `@tailark-pro/firebase` and inlined / promoted here.
 */
export const BillingFlow = () => {
  return (
    <div className="relative h-fit">
      <div
        aria-hidden
        className="absolute inset-0 mx-auto flex max-w-5xl flex-col justify-between"
      >
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />

        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed md:hidden" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed md:hidden" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed md:hidden" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed md:hidden" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed md:hidden" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed md:hidden" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed md:hidden" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed md:hidden" />
      </div>
      <div aria-hidden className="absolute inset-0 m-auto max-w-4xl">
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-4 left-0 w-1/11 border-l border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-4 left-1/11 w-1/11 border-l border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-4 left-2/11 w-1/11 border-l border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-4 left-3/11 w-1/11 border-x border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-4 left-5/11 w-1/11 border-x border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-4 left-6/11 w-1/11 border-r border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-4 left-7/11 w-1/11 border-r border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-4 left-8/11 w-1/11 border-r border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-4 left-9/11 w-1/11 border-r border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-4 left-10/11 w-1/11 border-r border-dashed" />
      </div>
      <div className="relative mx-auto grid max-w-4xl px-px max-md:gap-6 md:grid-cols-11">
        <div className="flex flex-wrap items-center justify-center gap-2 md:col-span-3">
          <div className="relative origin-top -translate-y-5 scale-75">
            {[
              { name: "Vercel", icon: Vercel },
              { name: "Supabase", icon: Supabase },
              { name: "Firebase", icon: Firebase },
            ].map((node, index) => (
              <div
                key={index}
                className="bg-illustration ring-border-illustration h-fit w-28 space-y-3 rounded-xl p-3 pb-6 shadow-md ring-1 shadow-black/6.5 not-first:absolute not-first:inset-0 nth-2:top-12 nth-2:rotate-15 nth-3:top-24 nth-3:-rotate-19"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs leading-tight font-medium">
                    {node.name} <br /> Usage
                  </div>

                  <div
                    className={cn(
                      "shrink-0 *:size-5",
                      node.name === "Vercel" && "*:fill-foreground",
                    )}
                  >
                    <node.icon />
                  </div>
                </div>
                <div className="space-y-1.5 self-start">
                  <div className="space-y-1.5">
                    {[1, 2].map((row) => (
                      <div key={row} className="flex gap-2">
                        <div className="bg-foreground/10 h-1 flex-1 rounded-full" />
                        <div className="bg-foreground/10 h-1 w-8 rounded-full" />
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <div className="bg-foreground/10 h-1 w-full rounded-full" />
                    </div>
                    <div className="flex gap-1">
                      <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
                      <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
                    </div>
                    <div className="mt-4 flex gap-1">
                      <div className="bg-foreground/10 h-1 w-2/3 rounded-full" />
                      <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
                    </div>
                    <div className="flex gap-1">
                      <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
                      <div className="bg-foreground/10 h-1 w-1/3 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center max-md:pt-4 dark:opacity-50">
          <ArrowBigRight
            strokeWidth={4}
            className="fill-illustration dark:fill-foreground stroke-illustration dark:stroke-foreground m-auto size-6 drop-shadow-sm max-md:hidden"
          />
          <ArrowBigDown
            strokeWidth={4}
            className="fill-illustration dark:fill-foreground stroke-illustration dark:stroke-foreground mt-auto size-6 drop-shadow-sm md:hidden"
          />
        </div>

        <div className="-ml-px flex flex-col items-center justify-center overflow-hidden border-t border-r max-md:mx-auto max-md:size-fit md:col-span-3">
          <div className="bg-illustration ring-border size-56 translate-x-4 -translate-y-4 rounded-bl-xl p-6 pt-22 shadow ring-1 shadow-black/6.5">
            <div className="relative w-fit translate-y-3 border border-blue-500/50 px-5 py-3">
              <div className="absolute -inset-0.5 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="size-1 bg-blue-500" />
                  <div className="size-1 bg-blue-500" />
                  <div className="size-1 bg-blue-500" />
                </div>
                <div className="flex justify-between">
                  <div className="size-1 bg-blue-500" />
                  <div className="size-1 bg-blue-500" />
                </div>
                <div className="flex justify-between">
                  <div className="size-1 bg-blue-500" />
                  <div className="size-1 bg-blue-500" />
                  <div className="size-1 bg-blue-500" />
                </div>
              </div>
              <svg
                height="81"
                viewBox="0 0 204 81"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 translate-y-2"
              >
                <path
                  d="M0.672 62.976C0.224 62.976 0 62.592 0 61.824C0 61.184 0.128 60.416 0.384 59.52C0.704 58.624 1.056 57.792 1.44 57.024C2.016 55.936 2.88 54.016 4.032 51.264C5.376 48.256 6.496 45.856 7.392 44.064C8.288 42.208 9.152 40.8 9.984 39.84C10.88 38.752 11.584 38.208 12.096 38.208C12.416 38.208 12.672 38.432 12.864 38.88C13.056 39.264 13.152 39.712 13.152 40.224C13.152 40.736 13.088 41.056 12.96 41.184C12.448 41.696 11.776 42.56 10.944 43.776C10.112 44.992 9.344 46.208 8.64 47.424C7.296 49.92 6.624 51.776 6.624 52.992C6.624 53.12 6.624 53.248 6.624 53.376C6.688 53.504 6.752 53.632 6.816 53.76C7.584 53.376 8.288 52.992 8.928 52.608C9.568 52.224 10.304 51.68 11.136 50.976L16.992 45.6C17.632 45.024 18.208 44.544 18.72 44.16C19.232 43.776 19.648 43.456 19.968 43.2C20.608 42.752 21.216 42.528 21.792 42.528C22.304 42.528 22.912 42.848 23.616 43.488C23.936 43.808 24.096 44.672 24.096 46.08V48.48C24.096 48.736 24.064 48.992 24 49.248C24 49.44 24 49.664 24 49.92C24 50.752 24.096 51.488 24.288 52.128C24.544 52.704 24.896 52.992 25.344 52.992C25.536 52.992 25.792 52.832 26.112 52.512L28.8 49.344C31.04 46.72 32.768 44.8 33.984 43.584C35.2 42.368 36.576 41.536 38.112 41.088C38.304 41.024 38.464 40.992 38.592 40.992C38.784 40.928 38.944 40.896 39.072 40.896C39.648 40.896 40.128 41.088 40.512 41.472C40.96 41.856 41.088 42.368 40.896 43.008C40.64 44.032 40.288 45.216 39.84 46.56C39.456 47.84 39.104 48.864 38.784 49.632C38.016 51.168 37.632 52.384 37.632 53.28C37.632 53.856 37.856 54.24 38.304 54.432C38.816 54.624 39.296 54.752 39.744 54.816C40.256 54.88 40.512 55.008 40.512 55.2C41.792 54.752 42.752 54.528 43.392 54.528C44.032 54.528 44.192 54.752 43.872 55.2C43.552 55.584 42.976 56.064 42.144 56.64C41.312 57.216 40.384 57.728 39.36 58.176C38.4 58.56 37.536 58.752 36.768 58.752C35.168 58.752 34.368 57.888 34.368 56.16C34.368 55.264 34.496 54.432 34.752 53.664C35.648 50.4 36.096 48.288 36.096 47.328C36.096 46.368 35.84 45.888 35.328 45.888C34.176 45.888 31.712 48.192 27.936 52.8C27.552 53.248 27.104 53.728 26.592 54.24C26.144 54.752 25.632 55.264 25.056 55.776C24.288 56.48 23.552 57.216 22.848 57.984C22.464 58.368 21.952 58.56 21.312 58.56C19.968 58.56 19.232 58.08 19.104 57.12C19.04 56.096 18.976 55.264 18.912 54.624C18.912 53.92 18.912 53.44 18.912 53.184C18.784 51.52 18.688 50.4 18.624 49.824C18.56 49.248 18.272 48.96 17.76 48.96C17.12 48.96 15.52 49.984 12.96 52.032C9.504 54.784 6.336 57.856 3.456 61.248C2.24 62.4 1.312 62.976 0.672 62.976Z M50.2448 60.384C49.9888 60.384 49.7968 60.064 49.6688 59.424C49.5408 58.784 49.4767 58.432 49.4767 58.368C49.4767 58.048 49.5728 57.792 49.7648 57.6C51.8768 56.512 53.1887 55.872 53.7007 55.68C53.7647 55.616 53.8928 55.584 54.0848 55.584C54.4048 55.584 54.4688 56 54.2768 56.832C53.9568 57.984 53.7967 58.848 53.7967 59.424C53.7967 59.616 53.6047 59.776 53.2207 59.904C52.7727 60.032 52.2287 60.128 51.5887 60.192C51.0127 60.32 50.5648 60.384 50.2448 60.384Z M59.8957 70.176C58.6157 70.176 57.6558 69.792 57.0158 69.024C56.4398 68.32 56.1517 67.424 56.1517 66.336C56.1517 65.12 56.5357 64 57.3037 62.976C58.0717 62.016 59.0318 61.44 60.1838 61.248H60.4717C61.1757 61.248 61.5278 61.568 61.5278 62.208C61.5278 62.656 61.4317 63.072 61.2397 63.456L60.5677 65.76C60.5037 65.952 60.4398 66.112 60.3758 66.24C60.3758 66.368 60.3758 66.496 60.3758 66.624C60.3758 67.136 60.6317 67.392 61.1437 67.392C61.4637 67.392 61.7198 67.36 61.9118 67.296C65.1118 66.336 68.3117 64.832 71.5117 62.784C74.7758 60.8 77.8478 58.528 80.7278 55.968C83.6078 53.408 86.0718 50.912 88.1198 48.48C91.0638 45.152 93.9758 41.408 96.8558 37.248C99.7358 33.088 102.36 28.768 104.728 24.288C107.096 19.744 108.952 15.36 110.296 11.136C110.68 9.792 110.872 8.672 110.872 7.776C110.872 5.024 109.4 3.648 106.456 3.648C105.112 3.648 103.32 4.064 101.08 4.896C98.9037 5.728 96.5998 6.848 94.1678 8.256C91.7998 9.6 89.5918 11.168 87.5438 12.96C84.7918 15.264 82.2638 17.824 79.9598 20.64C77.7198 23.392 75.9597 25.984 74.6797 28.416C73.3997 30.656 72.7598 32.512 72.7598 33.984C72.7598 35.712 73.6878 36.576 75.5438 36.576C78.4238 36.576 81.2718 36.128 84.0878 35.232C86.9038 34.336 89.2717 33.28 91.1917 32.064C91.8957 31.68 92.5038 31.488 93.0158 31.488C93.5918 31.488 93.7838 31.584 93.5918 31.776C93.5918 31.84 93.3998 32.032 93.0158 32.352C92.5038 32.672 91.5117 33.28 90.0397 34.176C88.5677 35.072 87.0637 35.872 85.5277 36.576C82.0077 38.304 78.6798 39.168 75.5438 39.168C70.2958 39.168 67.6718 37.408 67.6718 33.888C67.6718 32.736 68.0238 31.296 68.7278 29.568C69.8798 26.88 71.7678 23.936 74.3918 20.736C77.0798 17.472 80.1518 14.336 83.6077 11.328C86.6158 8.768 89.6558 6.656 92.7278 4.992C95.8638 3.328 98.8078 2.08 101.56 1.248C104.312 0.416 106.584 0 108.376 0C110.104 0 111.48 0.608 112.504 1.824C113.592 3.04 114.136 4.672 114.136 6.72C114.136 7.36 114.072 8.032 113.944 8.736C113.816 9.44 113.624 10.24 113.368 11.136C111.832 16 109.848 20.864 107.416 25.728C104.984 30.528 102.328 35.04 99.4478 39.264C96.6318 43.424 93.7518 46.976 90.8078 49.92L90.7118 50.016C86.3598 54.368 81.8158 58.368 77.0798 62.016C72.3437 65.664 67.4157 68.256 62.2957 69.792C61.5917 70.048 60.7917 70.176 59.8957 70.176Z M99.8887 61.824C99.0567 61.824 98.6407 61.088 98.6407 59.616C98.6407 58.4 98.9288 57.216 99.5048 56.064C100.977 53.248 102.321 50.464 103.537 47.712C104.369 46.048 105.137 44.448 105.841 42.912C106.609 41.376 107.313 39.968 107.953 38.688C108.337 38.304 108.721 38.112 109.105 38.112C109.937 38.112 110.193 38.496 109.873 39.264C109.745 39.712 109.553 40.256 109.297 40.896C109.105 41.472 108.849 42.176 108.529 43.008C107.505 45.696 106.897 47.584 106.705 48.672C108.497 47.072 110.321 45.6 112.177 44.256C114.097 42.848 115.889 41.696 117.553 40.8C119.217 39.904 120.625 39.456 121.777 39.456C122.801 39.456 123.313 39.872 123.313 40.704C123.313 41.408 122.993 42.176 122.353 43.008C121.713 43.776 121.073 44.16 120.433 44.16C120.113 44.16 119.857 44.064 119.665 43.872C119.473 43.808 119.089 43.776 118.513 43.776C116.465 43.776 114.321 44.768 112.081 46.752C109.713 48.736 107.569 51.136 105.649 53.952C103.729 56.704 102.321 59.104 101.425 61.152C100.977 61.6 100.465 61.824 99.8887 61.824Z M136.682 62.592C135.018 62.592 134.186 61.376 134.186 58.944C134.186 56.448 135.05 52.768 136.778 47.904C134.73 50.528 132.682 52.864 130.634 54.912C128.65 56.896 126.666 58.528 124.682 59.808C123.274 60.832 121.994 61.344 120.842 61.344C119.306 61.344 118.538 60.288 118.538 58.176C118.538 57.024 118.73 55.968 119.114 55.008C119.626 53.6 120.362 51.968 121.322 50.112C122.346 48.256 123.53 46.4 124.874 44.544C126.218 42.688 127.594 41.12 129.002 39.84C129.514 39.52 129.834 39.36 129.962 39.36C130.41 39.36 130.634 39.616 130.634 40.128C130.634 40.32 130.538 40.576 130.346 40.896C129.77 41.536 129.098 42.464 128.33 43.68C127.562 44.896 126.826 46.208 126.122 47.616C125.418 49.024 124.81 50.336 124.298 51.552C123.85 52.704 123.626 53.568 123.626 54.144C123.626 55.296 124.138 55.872 125.162 55.872C125.61 55.872 126.09 55.712 126.602 55.392C128.97 53.92 131.146 52.16 133.13 50.112C135.114 48 136.97 45.152 138.698 41.568C139.274 41.184 139.914 40.992 140.618 40.992C141.322 40.992 141.898 41.216 142.346 41.664C142.858 42.112 143.114 42.72 143.114 43.488C143.114 44.064 142.954 44.736 142.634 45.504C142.57 45.76 142.442 46.016 142.25 46.272C142.122 46.528 141.962 46.816 141.77 47.136C141.578 47.456 141.418 47.776 141.29 48.096C141.162 48.352 141.034 48.576 140.906 48.768C139.69 50.944 138.73 52.768 138.026 54.24C137.386 55.712 137.066 56.992 137.066 58.08C137.066 59.36 137.642 60 138.794 60C139.818 60 140.842 59.616 141.866 58.848C142.506 58.4 143.05 58.176 143.498 58.176C144.202 58.176 144.042 58.624 143.018 59.52C142.058 60.352 140.874 61.12 139.466 61.824C138.122 62.336 137.194 62.592 136.682 62.592Z M146.306 61.344C145.154 61.344 144.578 60.896 144.578 60C144.578 59.424 144.77 58.688 145.154 57.792C145.602 56.896 146.05 56.032 146.498 55.2C147.714 53.024 148.834 50.912 149.858 48.864C150.882 46.816 151.874 44.64 152.834 42.336C153.282 41.312 153.954 40.8 154.85 40.8C155.81 40.8 156.098 41.376 155.714 42.528C155.33 43.488 154.946 44.352 154.562 45.12C152.77 48.768 151.874 51.232 151.874 52.512C151.874 53.088 152.066 53.44 152.45 53.568C153.346 52.864 154.018 52.352 154.466 52.032C154.914 51.648 155.17 51.424 155.234 51.36C156.13 50.656 157.122 49.856 158.21 48.96C159.362 48 160.61 46.912 161.954 45.696C164.066 43.776 165.826 42.816 167.234 42.816C168.962 42.816 169.698 44.384 169.442 47.52C169.378 48.736 169.378 49.92 169.442 51.072C169.506 51.328 169.538 51.712 169.538 52.224C169.538 52.672 169.538 53.216 169.538 53.856C169.538 54.496 169.922 54.816 170.69 54.816C171.586 54.816 172.418 54.56 173.186 54.048L175.298 52.608L177.41 51.264C177.538 51.2 177.762 51.168 178.082 51.168C178.466 51.168 178.466 51.456 178.082 52.032C174.05 57.024 170.722 59.52 168.098 59.52C167.586 59.52 167.074 59.424 166.562 59.232C166.114 59.04 165.794 58.496 165.602 57.6C165.41 56.64 165.282 55.616 165.218 54.528C165.218 53.44 165.218 52.608 165.218 52.032L165.314 48.864C165.314 47.52 164.962 46.848 164.258 46.848C162.594 46.848 158.498 50.272 151.97 57.12C151.458 57.76 150.658 58.624 149.57 59.712C148.482 60.8 147.394 61.344 146.306 61.344Z M178.072 80.448C176.664 80.448 175.512 79.776 174.616 78.432C173.656 77.152 173.176 75.68 173.176 74.016C173.176 72.672 173.368 71.68 173.752 71.04C174.264 70.336 174.744 69.984 175.192 69.984C175.704 69.984 175.96 70.272 175.96 70.848C175.96 71.36 175.768 71.872 175.384 72.384C175.128 72.704 175 73.12 175 73.632C175 74.592 175.32 75.552 175.96 76.512C176.6 77.472 177.368 77.952 178.264 77.952C178.392 77.952 178.52 77.92 178.648 77.856C178.776 77.856 178.936 77.824 179.128 77.76C182.136 76.608 184.888 74.208 187.384 70.56C189.88 66.848 191.928 62.784 193.528 58.368C195.128 53.888 196.312 49.76 197.08 45.984L196.696 45.888C196.504 45.76 196.216 45.92 195.832 46.368C195.448 46.752 195.064 47.2 194.68 47.712C194.296 48.16 194.04 48.48 193.912 48.672C193.72 48.928 193.208 49.504 192.376 50.4C191.608 51.232 190.68 52.192 189.592 53.28C188.504 54.304 187.416 55.328 186.328 56.352C185.24 57.376 184.312 58.208 183.544 58.848C182.584 59.68 181.4 60.096 179.992 60.096C179.608 60.096 179.224 60.032 178.84 59.904C178.136 59.52 177.784 58.912 177.784 58.08C177.784 56.992 178.424 55.328 179.704 53.088C180.664 51.424 182.104 49.344 184.024 46.848C185.944 44.288 188.056 42.112 190.36 40.32C192.024 38.976 193.752 38.112 195.544 37.728C195.864 37.664 196.184 37.632 196.504 37.632C196.824 37.568 197.144 37.504 197.464 37.44C197.784 37.44 198.072 37.44 198.328 37.44C198.584 37.44 198.84 37.408 199.096 37.344C199.16 37.344 199.64 37.312 200.536 37.248C201.496 37.12 202.104 36.8 202.36 36.288L202.648 36.192C202.904 36.192 203.16 36.32 203.416 36.576C203.608 36.768 203.704 37.152 203.704 37.728C203.704 37.92 203.672 38.176 203.608 38.496C203.544 38.752 203.512 39.072 203.512 39.456V39.552C203.512 41.92 203.064 44.384 202.168 46.944C201.272 49.44 200.312 52 199.288 54.624C197.176 59.936 194.488 64.864 191.224 69.408C188.024 73.952 184.472 77.376 180.568 79.68C179.736 80.192 178.904 80.448 178.072 80.448ZM180.952 56.64C181.208 56.768 181.4 56.832 181.528 56.832C181.848 56.832 182.328 56.672 182.968 56.352C183.416 56.096 183.864 55.776 184.312 55.392C184.824 55.008 185.4 54.56 186.04 54.048C186.488 53.728 187 53.28 187.576 52.704C188.152 52.128 188.824 51.456 189.592 50.688L191.416 48.96C192.312 48.064 193.272 47.008 194.296 45.792C195.32 44.576 196.184 43.392 196.888 42.24C197.592 41.088 197.944 40.192 197.944 39.552C197.944 38.976 197.592 38.688 196.888 38.688C196.184 38.688 195.224 39.072 194.008 39.84C192.856 40.608 191.64 41.536 190.36 42.624C189.144 43.712 188.088 44.768 187.192 45.792C186.36 46.624 185.56 47.552 184.792 48.576C184.088 49.536 183.384 50.56 182.68 51.648C181.848 52.864 181.272 53.92 180.952 54.816C180.568 55.776 180.568 56.384 180.952 56.64Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="border-t px-4 pt-2">
              <div className="text-xs">Méschac Irung</div>
              <div className="text-foreground/65 text-[10px]">Founder, CEO</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center dark:opacity-50">
          <ArrowBigRight
            strokeWidth={4}
            className="fill-illustration dark:fill-foreground stroke-illustration dark:stroke-foreground m-auto size-6 drop-shadow-sm max-md:hidden"
          />
          <ArrowBigDown
            strokeWidth={4}
            className="fill-illustration dark:fill-foreground stroke-illustration dark:stroke-foreground mt-auto size-6 drop-shadow-sm md:hidden"
          />
        </div>
        <div className="flex items-center justify-center md:col-span-3">
          <InvoiceMock className="mx-auto scale-75" />
        </div>
      </div>
    </div>
  );
};

const InvoiceMock = ({ className }: { className?: string }) => (
  <div aria-hidden className="relative">
    <div
      className={cn(
        "before:bg-card before:border-border after:ring-border-illustration after:bg-card/75 before:ring-border-illustration group relative -mx-4 mask-b-from-65% px-4 pt-6 before:absolute before:inset-x-6 before:top-4 before:bottom-0 before:z-1 before:rounded-2xl before:ring-1 before:backdrop-blur after:absolute after:inset-x-9 after:top-2 after:bottom-0 after:rounded-2xl after:ring-1",
        className,
      )}
    >
      <div className="bg-card ring-border-illustration relative z-10 overflow-hidden rounded-2xl border border-transparent p-8 text-sm shadow-xl ring-1 shadow-black/6.5">
        <div className="mb-6 flex items-start justify-between gap-8">
          <div className="space-y-0.5">
            <LogoIcon />
            <div className="mt-4 font-mono text-xs">INV-456789</div>
            <div className="mt-1 -translate-x-1 font-mono text-2xl font-semibold">
              $284,342.57
            </div>
            <div className="text-xs font-medium">Due in 15 days</div>
          </div>
          <DocumentIllustration />
        </div>
        <div className="space-y-1.5 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)]">
          <div className="grid grid-cols-[auto_1fr] items-center">
            <span className="text-muted-foreground block w-18">To</span>
            <span className="bg-border h-2 w-1/4 rounded-full px-2" />
          </div>
          <div className="grid grid-cols-[auto_1fr] items-center">
            <span className="text-muted-foreground block w-18">From</span>
            <span className="bg-border h-2 w-1/2 rounded-full px-2" />
          </div>
          <div className="grid grid-cols-[auto_1fr] items-center">
            <span className="text-muted-foreground block w-18">Address</span>
            <span className="bg-border h-2 w-2/3 rounded-full px-2" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DocumentIllustration = () => (
  <div
    aria-hidden
    className="bg-illustration ring-border-illustration w-16 space-y-2 rounded-md p-2 shadow-md ring-1 shadow-black/6.5 [--color-border:color-mix(in_oklab,var(--color-foreground)15%,transparent)]"
  >
    <div className="flex items-center gap-1">
      <div className="bg-border size-2.5 rounded-full" />
      <div className="bg-border h-[3px] w-4 rounded-full" />
    </div>
    <div className="space-y-1.5">
      <div className="flex items-center gap-1">
        <div className="bg-border h-[3px] w-2.5 rounded-full" />
        <div className="bg-border h-[3px] w-6 rounded-full" />
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-border h-[3px] w-2.5 rounded-full" />
        <div className="bg-border h-[3px] w-6 rounded-full" />
      </div>
    </div>
    <div className="space-y-1.5">
      <div className="bg-border h-[3px] w-full rounded-full" />
      <div className="flex items-center gap-1">
        <div className="bg-border h-[3px] w-2/3 rounded-full" />
        <div className="bg-border h-[3px] w-1/3 rounded-full" />
      </div>
    </div>
    <Signature className="ml-auto size-3" />
  </div>
);
