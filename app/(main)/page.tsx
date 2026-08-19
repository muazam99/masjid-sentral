import Layout from '@/components/Layout'
import HeroSection from '@/components/landing/HeroSection'
import TrustStrip from '@/components/landing/TrustStrip'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import NarrativeSection from '@/components/landing/NarrativeSection'
import ImpactGridSection from '@/components/landing/ImpactGridSection'
import ApiPreviewSection from '@/components/landing/ApiPreviewSection'
import SubmissionFlowSection from '@/components/landing/SubmissionFlowSection'
import CtaSection from '@/components/landing/CtaSection'

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <TrustStrip />
      <TestimonialsSection />
      <NarrativeSection />
      <ImpactGridSection />
      <ApiPreviewSection />
      <SubmissionFlowSection />
      <CtaSection />
    </Layout>
  )
}
