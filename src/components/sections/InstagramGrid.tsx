import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { BRAND } from "@/lib/brand";

/** Real @wearbayan posts — image lives in /public/images/instagram, links to the post. */
type Post = { image: string; postUrl: string };

const POSTS: Post[] = [
  { image: "/images/instagram/1.jpg", postUrl: "https://www.instagram.com/p/DYrP-UvDiKK/" },
  { image: "/images/instagram/2.jpg", postUrl: "https://www.instagram.com/p/DYmKCFguBrs/" },
  { image: "/images/instagram/3.jpg", postUrl: "https://www.instagram.com/p/DYrfKHrDmVo/" },
  { image: "/images/instagram/4.jpg", postUrl: "https://www.instagram.com/p/DYpACa8jQ5f/" },
  { image: "/images/instagram/5.jpg", postUrl: "https://www.instagram.com/p/DYtMAbQCK6O/" },
  { image: "/images/instagram/6.jpg", postUrl: "https://www.instagram.com/p/DYuUub5DU6N/" },
];

export function InstagramGrid() {
  return (
    <section className="bg-bayan-bg px-6 py-[120px] md:px-9">
      <SectionHead
        eyebrow={`@${BRAND.instagramHandle}`}
        titleStart="Follow the"
        titleEm="Atelier"
      />

      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-6">
        {POSTS.map((post, i) => (
          <Reveal key={post.image} delay={i * 0.06}>
            <a
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-bayan-bg-alt"
              aria-label="View this post on Instagram"
            >
              <Image
                src={post.image}
                alt="Bayan on Instagram"
                fill
                sizes="(min-width: 768px) 16vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-bayan-bg-dark/55 text-bayan-bg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <InstagramIcon className="h-[22px] w-[22px]" />
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 text-center">
        <a
          href={BRAND.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] uppercase tracking-[0.28em] text-bayan-text transition-colors hover:text-bayan-primary-dark"
        >
          View Instagram →
        </a>
      </Reveal>
    </section>
  );
}
