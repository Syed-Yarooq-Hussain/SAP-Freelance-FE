"use client";

import { Avatar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import Image from "next/image";
import { FC, useState } from "react";

interface ProfileAvatarProps {
  name?: string;
  imageUrl?: string;
  size?: number;
  sx?: SxProps<Theme>;
}

const PLACEHOLDERS = ["/default.png", "/image.png", "", undefined];

/** Single letter when there is no photo (first character of the name). */
const getInitials = (name?: string) => {
  const trimmed = name?.trim();
  if (!trimmed) return "?";
  return trimmed[0].toLocaleUpperCase();
};

const ProfileAvatar: FC<ProfileAvatarProps> = ({
  name = "",
  imageUrl,
  size = 80,
  sx,
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
        color: "inherit",
        fontSize: size * 0.35,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: 1,
        ...sx,
      }}
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
