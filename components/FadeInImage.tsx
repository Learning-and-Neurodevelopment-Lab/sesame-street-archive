import React, { useEffect, useRef, useState } from "react";

function FadeInImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = imgRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <img
      ref={imgRef}
      {...props}
      style={{
        ...props.style,
        opacity: visible ? 1 : 0,
        transition: "opacity 300ms",
        transitionDelay: "300ms",
      }}
      alt={props.alt}
    />
  );
}

export default FadeInImage;