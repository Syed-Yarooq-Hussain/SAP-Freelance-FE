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

interface SidebarSectionItem {
  label?: string;
  value?: string;
  subValue?: string;
  type?: "text" | "avatars" | "button";
  avatars?: string[];
  buttonText?: string;
  buttonColor?: keyof typeof colors;
  onButtonClick?: () => void;
}

interface SidebarSection {
  title: string;
  items: SidebarSectionItem[];
}

interface SidebarInfoProps {
  sections: SidebarSection[];
}

const Section: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => (
  <Card
    sx={{
      mb: 2,
      borderRadius: 2,
      boxShadow: 1,
      bgcolor: "#ffffff",
    }}
  >
    <CardContent>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "text.primary" }}
      >
        {title}
      </Typography>
      <Divider sx={{ mb: 1 }} />
      {children}
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
                      "&:hover": {
                        bgcolor: buttonBg,
                        opacity: 0.9,
                      },
                    }}
                    onClick={item.onButtonClick}
                  >
                    {item.buttonText}
                  </Button>
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
                  <>
                    {item.label && (
                      <Typography variant="body2" color="text.secondary">
                        {item.label}
                      </Typography>
                    )}
                    {item.value && (
                      <Typography variant="subtitle2" fontWeight="bold">
                        {item.value}
                      </Typography>
                    )}
                    {item.subValue && (
                      <Typography variant="body2" color="text.secondary">
                        {item.subValue}
                      </Typography>
                    )}
                  </>
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
