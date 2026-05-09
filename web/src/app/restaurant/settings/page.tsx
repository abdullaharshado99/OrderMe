'use client';
import { useState, type FormEvent } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
    const { user } = useAuth();
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!logoFile) return;

        const restaurantId = user?.restaurantId;
        if (restaurantId == null) {
            alert('You must be signed in with a restaurant to upload a logo.');
            return;
        }

        const formData = new FormData();
        formData.append('logo', logoFile);

        setUploading(true);
        try {
            await api.post(`/restaurants/upload-logo/${restaurantId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Logo uploaded! Refresh page to see.');
            window.location.reload();
        } catch {
            alert('Upload failed');
        }
        setUploading(false);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'var(--font-quicksand)' }}>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-[var(--raspberry)]">
                Restaurant Settings
            </h1>

            <Card className="bg-white border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-[var(--brilliant-rose)]">
                        Update Logo
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleUpload} className="space-y-4">

                        {/* File Input */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700"
                        />

                        {/* Upload Button */}
                        <button
                            type="submit"
                            disabled={uploading}
                            className="bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white px-4 py-2 rounded transition disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Upload Logo'}
                        </button>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}