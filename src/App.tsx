import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/hero/Hero';
import { WorkReviews } from '@/components/reviews/WorkReviews';
import { PassionProjects } from '@/components/projects/PassionProjects';

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <WorkReviews />
        <PassionProjects />
      </main>
      <Footer />
    </>
  );
}
