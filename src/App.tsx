import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box, createTheme, CssBaseline, ThemeProvider, Typography, useMediaQuery } from "@mui/material";
import { Menu } from "@tauri-apps/api/menu";
import { open } from '@tauri-apps/plugin-dialog';
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import NoSelectedCollection from './components/collection/NoSelectedCollection';
import LoadingBackdrop from './components/loading/LoadingBackdrop';
import { Collection } from "./types/Collection";
import { parseCollection } from "./utils/utils";

function App() {
  const [activeCollection, setActiveCollection] = useState<Collection|null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Set theme according to user preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          background: {
            default: prefersDarkMode ? '#303030' : '#f0f0f0',
          }
        },
      }),
    [prefersDarkMode],
  );

  async function onOpenCollection() {
    const collectionPath = await open({
      multiple: false,
      directory: false
    });
    if (!collectionPath) {
      return;
    }
    setLoading(true);
    try {
      setActiveCollection(await parseCollection(collectionPath));
      await new Promise((res) => setTimeout(res, 5000));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // Set system bar menu
  useEffect(() => {
    const setAppMenu = async () => {
      const menu = await Menu.new({
        items: [
          {
            id: 'app-menu',
            text: 'RestBox',
            items: [
              { id: 'quit', text: 'Quit RestBox', accelerator: "CmdOrCtrl+Q", action: () => console.log('About clicked') }
            ]
          },
          {
            id: 'collection',
            text: 'Collection',
            items: [
              { id: 'new-collection', text: 'New collection...', accelerator: "CmdOrCtrl+N", action: () => console.log('New collection') },
              { id: 'open-collection', text: 'Open collection...', accelerator: "CmdOrCtrl+O", action: onOpenCollection }
            ]
          }
        ],
      });
      
      menu.setAsAppMenu();
    }

    setAppMenu();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Box component="div" sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
          <Box component="div" sx={{ p: 1, flexGrow: 1 }}>
            {activeCollection === null && <NoSelectedCollection onOpen={onOpenCollection} />}
          </Box>
          <Box component="div" sx={{ backgroundColor: "primary.dark", p: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>RestBox</Typography>
          </Box>
          <LoadingBackdrop open={loading} />
        </Box>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
