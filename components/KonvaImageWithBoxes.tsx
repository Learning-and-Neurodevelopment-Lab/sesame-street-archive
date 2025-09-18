import React, { Key, useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Rect } from "react-konva";
import type Konva from "konva";
import { Spring, animated } from "@react-spring/konva";
import useImage from "use-image";

function KonvaImageWithBoxes({ imageUrl, boxes }) {
  const [image] = useImage(imageUrl);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imgDims, setImgDims] = useState({ width: 0, height: 0 });
  const imageRef = useRef<Konva.Image>(null);

  // Set container size to be square (responsive)
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        setContainerSize({ width: size, height: size });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (image && image.width && image.height) {
      setImgDims({ width: image.width, height: image.height });
    }
  }, [image]);

  const { stageWidth, stageHeight, scale, offsetX, offsetY } = useMemo(() => {
    const cW = containerSize.width || 240;
    const cH = containerSize.height || 240;
    const iW = imgDims.width || 1;
    const iH = imgDims.height || 1;
    const scale = Math.min(cW / iW, cH / iH);
    const stageWidth = iW * scale;
    const stageHeight = iH * scale;
    const offsetX = (cW - stageWidth) / 2;
    const offsetY = (cH - stageHeight) / 2;
    return { stageWidth, stageHeight, scale, offsetX, offsetY };
  }, [containerSize, imgDims]);

  const AnimatedKonvaImage = animated(KonvaImage);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: 240,
        maxHeight: 240,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#e5e7eb",
      }}
    >
      <Stage
        width={containerSize.width}
        height={containerSize.height}
        style={{ background: "transparent" }}
      >
        <Layer>
          <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} delay={500}>
            {({ opacity }) => (
              // @ts-expect-error ignore
              <AnimatedKonvaImage
                image={image}
                x={offsetX}
                y={offsetY}
                width={stageWidth}
                height={stageHeight}
                opacity={opacity}
                ref={imageRef}
              />
            )}
          </Spring>
          {boxes &&
            boxes.map(
              (box: {
                id: Key;
                x: number;
                y: number;
                width: number;
                height: number;
                annotation?: { category?: string };
              }) => {
                let stroke = "#fff";
                const cat =
                  box.annotation?.category?.toLowerCase?.() ||
                  box.annotation?.category;
                switch (cat) {
                  case "face":
                    stroke = "#3b82f6";
                    break;
                  case "place":
                    stroke = "#22c55e";
                    break;
                  case "number":
                    stroke = "#a855f7";
                    break;
                  case "word":
                    stroke = "#a42a04";
                    break;
                  default:
                    stroke = "#e5e7eb";
                }
                return (
                  <Rect
                    key={box.id}
                    x={box.x * scale + offsetX}
                    y={box.y * scale + offsetY}
                    width={box.width * scale}
                    height={box.height * scale}
                    stroke={stroke}
                    strokeWidth={4}
                    dash={[6, 4]}
                    cornerRadius={4}
                    opacity={0.7}
                    shadowEnabled={true}
                    shadowColor="black"
                    shadowBlur={8}
                    shadowOffset={{ x: 2, y: 2 }}
                    shadowOpacity={0.6}
                  />
                );
              }
            )}
        </Layer>
      </Stage>
    </div>
  );
}

export default KonvaImageWithBoxes;