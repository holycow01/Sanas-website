import { Hero } from "@/components/sections/Hero";
import { NewArrivals } from "@/components/sections/NewArrivals";
import { Story } from "@/components/sections/Story";
import { EditorialQuote } from "@/components/sections/EditorialQuote";
import { InstagramGrid } from "@/components/sections/InstagramGrid";
import { Newsletter } from "@/components/sections/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <Story />
      <EditorialQuote />
      <InstagramGrid />
      <Newsletter />
    </>
  );
}
