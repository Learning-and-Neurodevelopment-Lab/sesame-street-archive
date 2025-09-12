import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import vanderbilt from '@/assets/vanderbilt.png';
import minnesota from '@/assets/minnesota.png';
import texas from '@/assets/texas.png';
import landlab from '@/assets/landlab.png';
import digitalLab from '@/assets/digital-lab-hz.png';
import sesameworkshop from '@/assets/sesame-workshop-cooney-center.png';
import one from '@/assets/annotated-examples/1.png';
import two from '@/assets/annotated-examples/2.png';
import three from '@/assets/annotated-examples/3.png'
import four from '@/assets/annotated-examples/4.png';
import five from '@/assets/annotated-examples/5.png';
import six from '@/assets/annotated-examples/6.png';
import seven from '@/assets/annotated-examples/7.png';
import eight from '@/assets/annotated-examples/8.png';

import { researchArticles } from '@/lib/research-data';

import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  const calloutItems = [
    {
      title: t('labeledStills.one.title'),
      description: t('labeledStills.one.description'),
      id: t('labeledStills.one.id'),
      image: one,
    },
    {
      title: t('labeledStills.two.title'),
      description: t('labeledStills.two.description'),
      id: t('labeledStills.two.id'),
      image: two,
    },
    {
      title: t('labeledStills.three.title'),
      description: t('labeledStills.three.description'),
      id: t('labeledStills.three.id'),
      image: three,
    },
    {
      title: t('labeledStills.four.title'),
      description: t('labeledStills.four.description'),
      id: t('labeledStills.four.id'),
      image: four,
    },
    {
      title: t('labeledStills.five.title'),
      description: t('labeledStills.five.description'),
      id: t('labeledStills.five.id'),
      image: five,
    },
    {
      title: t('labeledStills.six.title'),
      description: t('labeledStills.six.description'),
      id: t('labeledStills.six.id'),
      image: six,
    },
    {
      title: t('labeledStills.seven.title'),
      description: t('labeledStills.seven.description'),
      id: t('labeledStills.seven.id'),
      image: seven,
    },
    {
      title: t('labeledStills.eight.title'),
      description: t('labeledStills.eight.description'),
      id: t('labeledStills.eight.id'),
      image: eight,
    },
  ];

  const contributors = [
    {
      alt: t('contributors.landlab.alt'),
      image: landlab,
      link:  t('contributors.landlab.link')
    },
    {
      alt: t('contributors.vanderbilt.alt'),
      image: vanderbilt,
      link:  t('contributors.vanderbilt.link')
    },
    {
      alt: t('contributors.digitallab.alt'),
      image: digitalLab,
      link:  t('contributors.digitallab.link')
    },
    {
      alt: t('contributors.minnesota.alt'),
      image: minnesota,
      link: t('contributors.minnesota.link')
    },
    {
      alt: t('contributors.texas.alt'),
      image: texas,
      link: t('contributors.texas.link')
    },
    {
      alt: t('contributors.sesameworkshop.alt'),
      image: sesameworkshop,
      link:  t('contributors.sesameworkshop.link')
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px-64px)] flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="relative flex flex-col w-full py-16 px-4">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              <div>{t('heroTitle')}</div>
            </h1>
            <p className="text-lg text-gray-700 mb-8 font-bold"> 
              {t.rich('heroSubTitle', {
                em: (chunks) => <em>{chunks}</em>
              })}
            </p>
            <Button asChild size="lg" className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-4">
              <Link href={t('heroCtaPath')}>{t('heroCta')}</Link>
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
            {t.rich('data.episodes', { 
              title: (chunks) => <div className="text-4xl font-bold text-gray-800">{chunks}</div>,
              description: (chunks) => <div className="text-gray-600">{chunks}</div>,
              episodes: '4500+'
            })}
          </div>
          <div>
            {t.rich('data.labs', {
              title: (chunks) => <div className="text-4xl font-bold text-gray-800">{chunks}</div>,
              description: (chunks) => <div className="text-gray-600">{chunks}</div>,
              labs: '5'
            })}
          </div>
          <div>
            {t.rich('data.labeledImages', {
              title: (chunks) => <div className="text-4xl font-bold text-gray-800">{chunks}</div>,
              description: (chunks) => <div className="text-gray-600">{chunks}</div>,
              labeledImages: '4000+'
            })}
          </div>
        </div>
      </section>

      {/* Secondary Featured Stories */}
      <section className="w-full py-16 px-4 bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t('researchTitle')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('researchDescription')}
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
              <Link href={t('researchCtaPath')}>{t('researchCta')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="w-full py-16 px-4 patterned">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-12">
            {t('stillsTitle')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {calloutItems.map((item) => (
              <div key={item.id} className="aspect-square bg-gray-200 border border-gray-300 flex justify-center">
                <Image src={item.image} alt={item.title} className="object-cover" />
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-icon lucide-brain"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('deepMRIStudies.title')}</h3>
            <p className="text-gray-600 text-sm">
              {t('deepMRIStudies.description')}
            </p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap-icon lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('multiLabCollaboration.title')}</h3>
            <p className="text-gray-600 text-sm">
              {t('multiLabCollaboration.description')}
            </p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-column-icon lucide-chart-column"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('aiAndMachineLearning.title')}</h3>
            <p className="text-gray-600 text-sm">
              {t('aiAndMachineLearning.description')}
            </p>
          </div>
        </div>
      </section>

      {/* University Logos */}
      <section className="w-full py-12 border-t bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16 px-4">
          {contributors.map((entity) => (
            <div key={entity.image.src} className="text-gray-600 font-semibold">
              <a href={entity.link} target="_blank">
                <Image src={entity.image} width={300} alt={entity.alt} />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}