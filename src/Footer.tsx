import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import "./Footer.css";

export default function Footer() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    getVersion().then(setVersion);
  }, []);

  return (
    <div className="footer-container">
      RestBox v{version}
    </div>
  );
}
