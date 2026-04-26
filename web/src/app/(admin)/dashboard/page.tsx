// import styles from './dashboard.module.css';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// export default function DashboardPage() {
//     return (
//         <Card className={styles.card}>
//             <CardHeader className={styles.cardHeader}>
//                 <CardTitle className={styles.cardTitle}>Admin Dashboard</CardTitle>
//             </CardHeader>
//             <CardContent className={styles.cardContent}>
//                 <p className={styles.infoText}>
//                     Welcome to the Live With Quran admin dashboard. Use the sidebar to manage media,
//                     admins, and your profile.
//                 </p>
//             </CardContent>
//         </Card>
//     );
// }

'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function Dashboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get('/users')
            .then(res => setUsers(res.data))
            .catch(err => console.log(err));
    }, []);

    return <div>Dashboard: {users.length} users</div>;
}