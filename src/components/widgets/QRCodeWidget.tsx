import React, { useState, useEffect } from 'react';
import { WidgetWrapper } from '../WidgetWrapper';
import { QrCode, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { WidgetProps } from '../../types/widget';

interface QRCodeData {
    text: string;
}

const QRCodeWidgetComponent: React.FC<WidgetProps> = ({ id, data, onDataChange }) => {
    const [text, setText] = useState((data as QRCodeData)?.text || '');
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        if (text.trim()) {
            // Using QR Server API (free, no API key required)
            const encodedText = encodeURIComponent(text);
            setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`);
        } else {
            setQrCodeUrl('');
        }
    }, [text]);

    const handleTextChange = (value: string) => {
        setText(value);
        onDataChange?.({ text: value });
    };

    const handleDownload = () => {
        if (qrCodeUrl) {
            const link = document.createElement('a');
            link.href = qrCodeUrl;
            link.download = 'qrcode.png';
            link.click();
        }
    };

    return (
        <WidgetWrapper id={id} title="QR Code Generator" icon={<QrCode className="h-4 w-4" />}>
            <div className="flex flex-col h-full p-3 space-y-4">
                {/* Input */}
                <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                        Enter text or URL
                    </label>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={text}
                            onChange={(e) => handleTextChange(e.target.value)}
                            placeholder="https://example.com"
                            className="flex-1"
                        />
                        {text && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleTextChange('')}
                                onMouseDown={(e) => e.stopPropagation()}
                                title="Clear"
                            >
                                ✕
                            </Button>
                        )}
                    </div>
                </div>

                {/* QR Code display */}
                <div className="flex-1 flex items-center justify-center">
                    {qrCodeUrl ? (
                        <div className="space-y-3">
                            <div className="p-4 bg-white rounded-lg">
                                <img
                                    src={qrCodeUrl}
                                    alt="QR Code"
                                    className="w-48 h-48"
                                />
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleDownload}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download QR Code
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <QrCode className="h-16 w-16 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Enter text to generate QR code</p>
                        </div>
                    )}
                </div>
            </div>
        </WidgetWrapper>
    );
};

export const QRCodeWidget = React.memo(QRCodeWidgetComponent);
