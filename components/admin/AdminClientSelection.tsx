"use client";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

export type AdminProjectClient = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  activeProjects: number;
  completedProjects: number;
};

type AdminClientSelectionProps = {
  clients: AdminProjectClient[];
  selectedClientId: string | null;
  isLoading?: boolean;
  isSaving?: boolean;
  error?: string | null;
  onSelect: (client: AdminProjectClient) => void;
  onContinue: () => void;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "CL";

export default function AdminClientSelection({
  clients,
  selectedClientId,
  isLoading = false,
  isSaving = false,
  error,
  onSelect,
  onContinue,
}: AdminClientSelectionProps) {
  const [search, setSearch] = useState("");

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;

    return clients.filter((client) =>
      [client.name, client.email, client.phone, client.location, client.id]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [clients, search]);

  const selectedClient = clients.find(
    (client) => client.id === selectedClientId
  );

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2.5,
        overflow: "hidden",
        border: "1px solid #E2E8F0",
        borderRadius: "18px",
        bgcolor: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 750, color: "#0F172A" }}>
            Select the client you are representing
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "#64748B" }}>
            The project, shortlisted consultants, and billing will be linked to
            this client.
          </Typography>
        </Box>

        <TextField
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email or ID"
          sx={{ width: { xs: "100%", md: 330 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#F8FAFC" }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Chip
            size="small"
            label="Active clients only"
            sx={{ bgcolor: "#DCFCE7", color: "#166534" }}
          />
          {!isLoading ? (
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              {filteredClients.length} client
              {filteredClients.length === 1 ? "" : "s"} found
            </Typography>
          ) : null}
        </Stack>

        {error ? <Alert severity="error">{error}</Alert> : null}

        {isLoading ? (
          <Box sx={{ minHeight: 260, display: "grid", placeItems: "center" }}>
            <Stack alignItems="center" spacing={1.5}>
              <CircularProgress size={30} />
              <Typography variant="body2" color="text.secondary">
                Loading clients...
              </Typography>
            </Stack>
          </Box>
        ) : filteredClients.length === 0 ? (
          <Box
            sx={{
              minHeight: 240,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <Box>
              <BusinessRoundedIcon sx={{ fontSize: 42, color: "#CBD5E1" }} />
              <Typography sx={{ mt: 1, fontWeight: 700, color: "#334155" }}>
                No matching active client
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try a different search or activate the client first.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {filteredClients.map((client) => {
              const selected = client.id === selectedClientId;

              return (
                <Box
                  component="button"
                  type="button"
                  key={client.id}
                  aria-pressed={selected}
                  disabled={isSaving}
                  onClick={() => onSelect(client)}
                  sx={{
                    appearance: "none",
                    width: "100%",
                    p: 2,
                    textAlign: "left",
                    font: "inherit",
                    cursor: "pointer",
                    borderRadius: "14px",
                    border: selected
                      ? "2px solid #005C8A"
                      : "1px solid #E2E8F0",
                    bgcolor: selected ? "#EFF8FF" : "#FFFFFF",
                    boxShadow: selected
                      ? "0 8px 24px rgba(0, 92, 138, 0.12)"
                      : "0 2px 8px rgba(15, 23, 42, 0.04)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderColor: "#005C8A",
                      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.09)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: selected ? "#005C8A" : "#E2E8F0",
                        color: selected ? "#FFFFFF" : "#334155",
                        fontSize: 14,
                        fontWeight: 800,
                      }}
                    >
                      {getInitials(client.name)}
                    </Avatar>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 750,
                              color: "#0F172A",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {client.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                            Client ID: {client.id}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            flexShrink: 0,
                            borderRadius: "50%",
                            border: selected
                              ? "6px solid #005C8A"
                              : "2px solid #CBD5E1",
                            bgcolor: "#FFFFFF",
                          }}
                        />
                      </Stack>

                      <Stack spacing={0.75} sx={{ mt: 1.5 }}>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <MailOutlineRoundedIcon
                            sx={{ fontSize: 16, color: "#94A3B8" }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#475569",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {client.email}
                          </Typography>
                        </Stack>
                        {client.location ? (
                          <Typography variant="caption" sx={{ color: "#64748B" }}>
                            {client.location}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      mt: 2,
                      pt: 1.5,
                      borderTop: "1px solid #E2E8F0",
                      display: "flex",
                      gap: 2.5,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#0F172A" }}>
                        {client.activeProjects}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        Active
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#0F172A" }}>
                        {client.completedProjects}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        Completed
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Typography variant="body2" sx={{ color: "#64748B" }}>
          {selectedClient
            ? `Selected: ${selectedClient.name}`
            : "Select one client to continue"}
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon />}
          disabled={!selectedClientId || isSaving}
          onClick={onContinue}
          sx={{ minWidth: 190, bgcolor: "#005C8A" }}
        >
          {isSaving ? "Saving client..." : "Continue to shortlist"}
        </Button>
      </Box>
    </Paper>
  );
}
