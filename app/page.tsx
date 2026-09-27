import WeddingExperience from "@/components/wedding-experience";
import { getWeddingData } from "@/lib/wedding-data";
export default function Home() {
  return <WeddingExperience data={getWeddingData()} />;
}
