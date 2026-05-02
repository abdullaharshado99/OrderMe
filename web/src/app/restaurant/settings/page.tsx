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
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Restaurant Settings</h1>
            <Card>
                <CardHeader><CardTitle>Update Logo</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleUpload}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                            className="mb-4"
                        />
                        <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded">
                            {uploading ? 'Uploading...' : 'Upload Logo'}
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}