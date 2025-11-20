"use client";

import { Avatar } from "@mui/material";
import Image from "next/image";
import { FC, useState } from "react";

interface ProfileAvatarProps {
  name?: string;
  imageUrl?: string;
  size?: number;
}

const PLACEHOLDERS = ["/default.png", "/image.png", "", undefined];

const getInitials = (name: string) => {
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const ProfileAvatar: FC<ProfileAvatarProps> = ({
  name = "",
  imageUrl,
  size = 80,
}) => {
  const [imageError, setImageError] = useState(false);

  const initials = getInitials(name);
  const isPlaceholder = !imageUrl || PLACEHOLDERS.includes(imageUrl);
  const shouldShowInitial = isPlaceholder || imageError;

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: shouldShowInitial ? "rgba(0,0,0,0.12)" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 600,
        overflow: "hidden",
      }}
      aria-label={initials}
    >
      {shouldShowInitial ? (
        initials
      ) : (
        <Image
          src={imageUrl!}
          alt={name || "Profile image"}
          width={size}
          height={size}
          style={{ objectFit: "cover", borderRadius: "50%" }}
          onError={() => setImageError(true)}
        />
      )}
    </Avatar>
  );
};

export default ProfileAvatar;
