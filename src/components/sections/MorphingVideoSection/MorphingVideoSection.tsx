/**
 * @module src/components/sections/MorphingVideoSection/MorphingVideoSection.tsx
 * @description Ultra-performance video section without motion lags
 * @author Kort
 * @version 12.0.0 - Removed motion components to fix click lags
 * @usage Используется на главной странице как секция с видео "Наука, Производство, Результат"
 * @see HomePage.tsx - основное использование
 * @example
 * <MorphingVideoSection />
 */

import React, { useRef, useEffect } from 'react';
import { Icons } from '@/utils/icons';

interface VideoStoryData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  videoSrc: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const videoStories: VideoStoryData[] = [
  {
    id: 1,
    title: 'Наука',
    subtitle: 'Молекулярная иммунология',
    description: 'Transfer Factor — это низкомолекулярные пептиды, которые передают иммунологическую информацию от иммунокомпетентных клеток к наивным лимфоцитам. Эти молекулы содержат специфические антигенные детерминанты и способны активировать клеточно-опосредованный иммунный ответ.',
    videoSrc: '',
    color: '#3B82F6',
    icon: Icons.FlaskConical
  },
  {
    id: 2,
    title: 'Производство',
    subtitle: 'Биотехнологический процесс',
    description: 'Экстракция Transfer Factor осуществляется из молозива крупного рогатого скота и яичного желтка методом ультрафильтрации и хроматографической очистки. Процесс включает лиофилизацию для сохранения биологической активности иммуномодулирующих компонентов.',
    videoSrc: '/src/assets/videos/homepage/Production/Production-4Life.mp4',
    color: '#10B981',
    icon: Icons.Beaker
  },
  {
    id: 3,
    title: 'Результат',
    subtitle: 'Клиническая эффективность',
    description: 'Исследования демонстрируют статистически значимое повышение активности NK-клеток на 437% и увеличение пролиферации T-лимфоцитов на 283%. Продукция цитокинов IL-2 и IFN-γ возрастает в среднем в 2.5 раза при курсовом применении.',
    videoSrc: '',
    color: '#8B5CF6',
    icon: Icons.Globe
  }
];

const MorphingVideoSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 -z-10" />
      


      {/* Hero introduction - компактный */}
      <div className="relative z-20 py-12">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <Icons.Zap className="w-4 h-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Transfer Factor Technology</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Наука, которой
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                доверяют миллионы
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              4Life Research — ведущая биотехнологическая компания в области Transfer Factor технологий. 
              Более четверти века мы изучаем механизмы передачи иммунологической памяти на молекулярном уровне.
            </p>
          </div>
        </div>
      </div>

      {/* Video stories - без motion компонентов */}
      <div className="relative">
        {videoStories.map((story, index) => (
          <VideoStoryItem
            key={story.id}
            story={story}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

const VideoStoryItem: React.FC<{
  story: VideoStoryData;
  index: number;
}> = React.memo(({ story }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    // Оптимизация для мобильных
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Glassmorphism Text Block */}
          <div className="relative order-2 lg:order-1">
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl" />
            
            <div className="relative p-6 md:p-8 lg:p-10">
              <div className="flex items-center mb-6">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mr-5 backdrop-blur-sm border border-white/30"
                  style={{ backgroundColor: `${story.color}20` }}
                >
                  <story.icon className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-1">
                    {story.subtitle}
                  </h4>
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    {story.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-lg lg:text-xl text-gray-700 dark:text-gray-200 leading-relaxed mb-8">
                {story.description}
              </p>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-base text-gray-600 dark:text-gray-300 font-medium">Научно доказано</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Icons.Shield className="w-5 h-5 text-blue-500" />
                  <span className="text-base text-gray-600 dark:text-gray-300 font-medium">Запатентовано</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Block - смещен правее и увеличен */}
          <div className="relative order-1 lg:order-2 lg:ml-12 transform scale-125 lg:translate-x-8">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
              {/* Sci-fi background */}
              <div 
                className="absolute inset-0 bg-gradient-to-br opacity-80"
                style={{
                  background: `linear-gradient(135deg, ${story.color}40, ${story.color}20)`
                }}
              />
              
              {/* Video or placeholder */}
              {story.videoSrc ? (
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster=""
                  disablePictureInPicture
                  disableRemotePlayback
                  x-webkit-airplay="deny"
                  controlsList="nodownload nofullscreen noremoteplayback"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    filter: 'contrast(1.1) saturate(1.2)'
                  }}
                >
                  <source src={story.videoSrc} type="video/mp4; codecs=avc1.42E01E,mp4a.40.2" />
                  <source src={story.videoSrc.replace('.mp4', '.webm')} type="video/webm; codecs=vp9,vorbis" />
                </video>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm"
                      style={{ backgroundColor: `${story.color}30` }}
                    >
                      <story.icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-medium">{story.title}</p>
                  </div>
                </div>
              )}

              {/* Sci-fi borders */}
              <div className="absolute inset-0 rounded-3xl border-2 border-white/10" />
              <div 
                className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
                style={{ backgroundColor: story.color }}
              />

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-white/30" />
              <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-white/30" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-white/30" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-white/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MorphingVideoSection;