"use client";

import { colors } from "@/utils/styles/colors";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { FC, ReactNode } from "react";

export interface SidebarSectionItem {
  label?: string;
  value?: string;
  subValue?: string;
  type?: "text" | "avatars" | "button";
  avatars?: string[];
  buttonText?: string;
  buttonColor?: keyof typeof colors;
  onButtonClick?: () => void;
}

export interface SidebarSectionInfo {
  title: string;
  items: SidebarSectionItem[];
}

interface SidebarInfoProps {
  sections: SidebarSectionInfo[];
}

const Section: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => (
  <Card
    sx={{
      mb: 2,
      boxShadow: 1,
      bgcolor: "#ffffff",
    }}
  >
    <CardContent
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        cursor: "pointer",
        bgcolor: "grey.100",
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          position: "relative",
          cursor: "pointer",
          transition: "all 0.3s ease",
          color: "#041C7A",

          "&:hover": {
            color: "#2563eb",
            transform: "translateY(-1px)"
          },

          "&::after": {
            content: '""',
            position: "absolute",
            left: 0,
            bottom: -4,
            width: "100%",
            height: "2px",
            background:
              "linear-gradient(90deg, #2563eb, #22d3ee)",
            transform: "scaleX(0)",
            transformOrigin: "right",
            transition: "transform 0.35s ease"
          },

          "&:hover::after": {
            transform: "scaleX(1)",
            transformOrigin: "left"
          }
        }}
      >
        {title}
      </Typography>

      <Divider sx={{ mb: 1, position: "relative", zIndex: 2 }} />

     <Box sx={{ position: "relative", zIndex: 2 }}>{children}</Box>
    </CardContent>

  </Card>
);

const SidebarInfo: FC<SidebarInfoProps> = ({ sections }) => {
  return (
    <Box display="flex" flexDirection="column">
      {sections.map((section, idx) => (
        <Section key={idx} title={section.title}>
          {section.items.map((item, index) => {
            const buttonBg =
              item.buttonColor && colors[item.buttonColor]
                ? colors[item.buttonColor]
                : colors.GREY;

            return (
              <Box key={index} mb={item.type !== "avatars" ? 2 : 1}>
                {item.type === "button" && (
                  <>
                    {item.label && (
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{ mb: 0.5 }}
                      >
                        {item.label}
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      fullWidth
                      size="small"
                      sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        borderRadius: 1,
                        bgcolor: buttonBg,
                        color: "#ffffff",
                        "&:hover": { bgcolor: buttonBg, opacity: 0.9 },
                      }}
                      onClick={item.onButtonClick}
                    >
                      {item.buttonText}
                    </Button>
                  </>
                )}

                {item.type === "avatars" && item.avatars && (
                  <Stack direction="row" spacing={1}>
                    {item.avatars.map((src, i) => (
                      <Avatar
                        key={i}
                        src={src}
                        sx={{ width: 28, height: 28 }}
                      />
                    ))}
                  </Stack>
                )}

                {item.type === "text" && (
                 <Box
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.4s cubic-bezier(.25,.8,.25,1)",
                    bgcolor: "grey.100",

                    "&:before": {
                      content: '""',
                      position: "absolute",
                      width: "120%",
                      height: "120%",
                      left: "-100%",
                      top: "-10%",
                      background:
                        "linear-gradient(120deg, #96BEFF, #EDFBFF)",
                      transition: "all 0.5s ease",
                      transform: "skewX(-20deg)",
                    },

                    "&:hover": {
                      transform: "translateY(-3px) scale(1.03)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                      color: "white",
                    },

                    "&:hover:before": {
                      left: "0%",
                    },
                  }}
                >
                    {item.label && (
                      <Typography variant="body2" color="#0F03FF"
                       sx={{ position: "relative",  zIndex: 2 ,
                     }}>
                        {item.label}
                      </Typography>
                    )}
                    {item.value && (
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{ position: "relative",   zIndex: 2 }}>
                        {item.value}
                      </Typography>
                    )}
                    {item.subValue && (
                      <Typography variant="body2" color="#0F03FF" sx={{ position: "relative", zIndex: 2 }}>
                        {item.subValue}
                      </Typography>
                    )}
                  </Box>
                )}

                {index < section.items.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            );
          })}
        </Section>
      ))}
    </Box>
  );
};

export default SidebarInfo;
