'use client';

const imagenes = [
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
  '/images/7.jpg',
  '/images/8.jpg',
  '/images/9.jpg',
  '/images/10.jpg',
];

export default function MiniCarousel() {
  return (
    <div className="mini-carousel mt-4">
      <div className="mini-carousel-track">
        {[...imagenes, ...imagenes].map((src, i) => (
          <img key={i} src={src} className="mini-carousel-img" />
        ))}
      </div>
    </div>
  );
}
