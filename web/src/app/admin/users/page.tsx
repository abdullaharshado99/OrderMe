// 'use client';
// import { useState } from 'react';
// import api from '@/lib/axios';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// export default function UsersPage() {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//         name: '',
//         role: 'RESTAURANT_OWNER',
//         restaurantId: '',
//     });
//     const [message, setMessage] = useState('');

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         try {
//             const payload = {
//                 ...formData,
//                 restaurantId: formData.restaurantId ? parseInt(formData.restaurantId) : null,
//             };
//             await api.post('/auth/register', payload);
//             setMessage('User created successfully!');
//             setFormData({ email: '', password: '', name: '', role: 'RESTAURANT_OWNER', restaurantId: '' });
//         } catch (err: any) {
//             setMessage(err.response?.data?.message || 'Failed to create user');
//         }
//     };

//     return (
//         <div className="p-6 max-w-2xl mx-auto">
//             <h1 className="text-2xl font-bold mb-6">Register New User</h1>
//             <Card>
//                 <CardHeader><CardTitle>User Details</CardTitle></CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded" required />
//                         <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-2 border rounded" required />
//                         <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" required />
//                         <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-2 border rounded">
//                             <option value="RESTAURANT_OWNER">Restaurant Owner</option>
//                             <option value="CHEF">Chef</option>
//                         </select>
//                         <input type="number" placeholder="Restaurant ID (for owner/chef)" value={formData.restaurantId} onChange={e => setFormData({ ...formData, restaurantId: e.target.value })} className="w-full p-2 border rounded" />
//                         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register User</button>
//                     </form>
//                     {message && <p className="mt-4 text-green-600">{message}</p>}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsersPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [formData, setFormData] = useState({
        email: '', password: '', name: '', phone: '', role: 'RESTAURANT_OWNER', restaurantId: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/restaurants').then(res => setRestaurants(res.data)).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const payload = { ...formData, restaurantId: parseInt(formData.restaurantId) };
            await api.post('/auth/register', payload);
            setMessage('Restaurant Owner created successfully!');
            setFormData({ email: '', password: '', name: '', phone: '', role: 'RESTAURANT_OWNER', restaurantId: '' });
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to create user');
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Register Restaurant Owner</h1>
            <Card>
                <CardHeader><CardTitle>Owner Details</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded" required />
                        <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-2 border rounded" required />
                        <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border rounded" />
                        <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" required />
                        <select value={formData.restaurantId} onChange={e => setFormData({ ...formData, restaurantId: e.target.value })} className="w-full p-2 border rounded" required>
                            <option value="">Select Restaurant</option>
                            {restaurants.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register Owner</button>
                    </form>
                    {message && <p className="mt-4 text-green-600">{message}</p>}
                </CardContent>
            </Card>
        </div>
    );
}