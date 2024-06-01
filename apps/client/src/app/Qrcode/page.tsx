"use client"
import { useSession } from 'next-auth/react';
import QRCodeScannerComponent from "../components/QRCodeScannerComponent";

const QRCODE = (username:string) => {
  const { data: session } = useSession();


  // Extract username from session if available
  const profileUrl = `http://localhost:3000/profile/${username}`;
  return (
    <div>
      {/* Pass the username to QRCodeScannerComponent */}
      <QRCodeScannerComponent value={profileUrl} />
    </div>
  );
};

export default QRCODE;
