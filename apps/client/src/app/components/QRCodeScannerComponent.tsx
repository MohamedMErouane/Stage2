// components/QRCode.tsx

import React from 'react';
import QRCodeReact from 'qrcode.react';

interface QRCodeProps {
  value: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value }) => {
  return <QRCodeReact value={value} />;
};

export default QRCode;
