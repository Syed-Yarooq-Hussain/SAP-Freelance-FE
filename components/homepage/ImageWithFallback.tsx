"use client";

import Image, { ImageProps } from "next/image";
import React, { useState } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8v...";

interface ImageWithFallbackProps extends Omit<ImageProps, "src" | "width" | "height"> {
  src: string;
  width?: number;
  height?: number;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  style,
  width = 80,
  height = 80,
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  return (
    <Image
      src={didError ? ERROR_IMG_SRC : src}
      alt={alt ?? "Image"}
      className={className}
      style={style}
      width={width}
      height={height}
      onError={() => setDidError(true)}
      {...rest}
    />
  );
}
