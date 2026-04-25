import styles from './resturant-dashboard.module.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ResturantDashboardPage() {
    return (
        <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
                <CardTitle className={styles.cardTitle}>Resturant Dashboard</CardTitle>
            </CardHeader>
            <CardContent className={styles.cardContent}>
                <p className={styles.infoText}>
                    Welcome to the Live With Quran admin dashboard. Use the sidebar to manage media,
                    admins, and your profile.
                </p>
            </CardContent>
        </Card>
    );
}