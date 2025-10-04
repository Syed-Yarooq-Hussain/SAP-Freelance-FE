"use client";

import { Avatar } from "@mui/material";
import Image from "next/image";
import { FC } from "react";

interface ProfileAvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
}

const ProfileAvatar: FC<ProfileAvatarProps> = ({ name, imageUrl, size = 80 }) => {
  const getInitial = (text: string) => (text ? text.charAt(0).toUpperCase() : "?");

  if (imageUrl) {
    return (
      <Avatar
        sx={{ width: size, height: size }}
      >
        <Image
          src={imageUrl}
          alt={name}
          width={size}
          height={size}
          style={{ objectFit: "cover", borderRadius: "50%" }}
        />
      </Avatar>
    );
  }

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: "primary.main",
        fontSize: size / 2.5,
      }}
    >
      {getInitial(name)}
    </Avatar>
  );
};

export default ProfileAvatar;
