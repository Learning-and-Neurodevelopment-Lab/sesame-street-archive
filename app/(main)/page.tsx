import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import vanderbilt from '@/app/(main)/assets/vanderbilt.png';
import minnesota from '@/app/(main)/assets/minnesota.png';
import texas from '@/app/(main)/assets/texas.png';
import landlab from '@/app/(main)/assets/landlab.png';
import digitalLab from '@/app/(main)/assets/digital-lab-hz.png';
import sesameworkshop from '@/app/(main)/assets/sesame-workshop-cooney-center.png';
import one from '@/app/(main)/assets/annotated-examples/03212.png';
import two from '@/app/(main)/assets/annotated-examples/S35-E4057_01283.png';
import three from '@/app/(main)/assets/annotated-examples/S35-E4058_00212.png'
import four from '@/app/(main)/assets/annotated-examples/S35-E4058_00332.png';
import { researchArticles } from '@/lib/research-data';

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-64px-64px)] flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="relative flex flex-col w-full py-16 px-4">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Researching Brain Development Through Children's Media
            </h1>
            <p className="text-lg text-gray-600 mb-8 font-bold"> 
              MRI, Computer Vision, and 4,000+ Labeled <em>Sesame Street</em> images
            </p>
            <Button asChild size="lg" className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-4">
              <Link href="/explore">Explore the Archive</Link>
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-80 h-80 bg-gray-200 border-2 border-gray-300 flex justify-center">
              <Image src={four} alt="Rep" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-white py-12 border-t border-b">
        <div className="max-w-6xl mx-auto flex justify-around text-center">
          <div>
            <div className="text-4xl font-bold text-gray-800">4,500+</div>
            <div className="text-gray-600">episodes</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-800">5 research</div>
            <div className="text-gray-600">labs</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-800">4k+</div>
            <div className="text-gray-600">labeled images</div>
          </div>
        </div>
      </section>

      {/* Secondary Featured Stories */}
      <section className="w-full py-16 px-4 bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Research Highlights
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how our interdisciplinary research is advancing understanding of child development through innovative computer vision and neuroscience approaches.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {researchArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-200 border-b">
                  <Image src={article.image} alt={article.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold ${article.category.color} ${article.category.bgColor} rounded-full mb-3`}>
                    {article.category.name}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <Link href={`/research/${article.id}`} className="text-blue-600 text-sm font-medium hover:underline">
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/research">View All Research</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="w-full py-16 px-4 patterned">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-12">
            Labeled stills powered by YOLO ML Model
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[one,two,three,four,two,one,four,three].map((image, i) => (
              <div key={i} className="aspect-square bg-gray-200 border border-gray-300 flex justify-center">
                <Image src={image} alt={`Annotated example ${i + 1}`} className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 px-4 border-t bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-brain-icon lucide-brain"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Deep MRI Studies</h3>
            <p className="text-gray-600 text-sm">
              Lorem ipsum dolor stamet consectetur adipiscing
            </p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-graduation-cap-icon lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Multi-Lab Collaboration</h3>
            <p className="text-gray-600 text-sm">
              Lorem ipsum dolor sitam et, consectetur elit
            </p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chart-column-icon lucide-chart-column"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">AI & Machine Learning</h3>
            <p className="text-gray-600 text-sm">
              Lorem ipsum dolor sitam consectetur adipisci
            </p>
          </div>
        </div>
      </section>

      {/* University Logos */}
      <section className="w-full py-12 border-t bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16 px-4">
          {/* <div className="text-gray-600 font-semibold">VANDERBILT UNIVERSITY</div>
          <div className="text-gray-600 font-semibold">UNIVERSITY OF MINNESOTA</div>
          <div className="text-gray-600 font-semibold">THE UNIVERSITY OF TEXAS AT AUSTIN</div> */}
          <div className="text-gray-600 font-semibold">
            <Image src={landlab} width={300} alt="Landlab" className="" />
          </div>
          <div className="text-gray-600 font-semibold">
            <Image src={vanderbilt} width={300} alt="Vanderbilt University" className="" />
          </div>
          <div className="text-gray-600 font-semibold">
            <Image src={digitalLab} width={300} alt="Digital Lab" className="" />
          </div>
          <div className="text-gray-600 font-semibold">
            <Image src={minnesota} width={300} alt="University of Minnesota" className="" />
          </div>
          <div className="text-gray-600 font-semibold">
            <Image src={texas} width={300} alt="The University of Texas at Austin" className="" />
          </div>
          <div className="text-gray-600 font-semibold">
            <Image src={sesameworkshop} width={300} alt="Joan Ganz Cooney Center at Sesame Workshop" className="" />
          </div>
        </div>
      </section>
    </div>
  );
}