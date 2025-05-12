import { Box, Button, Typography } from "@mui/material";

interface NoSelectedCollectionProps {
  onOpen: () => void;
}

export default function NoSelectedCollection({ onOpen }: NoSelectedCollectionProps) {
  return <Box sx={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
  }}>
    <Typography>No collection selected.</Typography>
    <Button onClick={onOpen}>Open</Button>
  </Box>
}