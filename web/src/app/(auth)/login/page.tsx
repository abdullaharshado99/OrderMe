'use client';
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './login.module.css';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await login(email, password);
            const token = localStorage.getItem('accessToken');
            const decoded = JSON.parse(atob(token!.split('.')[1]));
            toast({ title: 'Login successful', description: 'Welcome back!', variant: 'success' });
            if (decoded.role === 'SUPER_ADMIN') router.push('/admin/dashboard');
            else if (decoded.role === 'RESTAURANT_OWNER') router.push('/restaurant/dashboard');
            else if (decoded.role === 'CHEF') router.push('/chef/kitchen')
            else router.push('/menu');
        } catch (err) {
            console.error(err);
            // Friendly error messages
            const msg = (err as any)?.response?.data?.message || (err as any)?.message || 'Login failed. Check your credentials.';
            toast({ title: 'Login failed', description: msg, variant: 'destructive' });
        }
        finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.bgLogo} aria-hidden>
                <Image
                    src="/logo-only.png"
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 520px, 720px"
                    className={styles.bgLogoImg}
                />
            </div>

            <header className={styles.header}>
                <div className={styles.logoWrap} aria-hidden>
                    <Image
                        src="/logo-only.png"
                        alt=""
                        width={64}
                        height={64}
                        priority
                        className={styles.logo}
                    />
                </div>
                <p className={styles.appTitle}>Order Me</p>
                <h1 className={styles.title}>Welcome</h1>
                <p className={styles.subtitle}>Sign in to continue your kitchen....</p>
            </header>

            <form className={styles.card} onSubmit={handleSubmit}>
                <div className={styles.fieldGroup}>
                    <label htmlFor="email" className={styles.label}>
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label htmlFor="password" className={styles.label}>
                        Password
                    </label>
                    <div className={styles.passwordContainer}>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className={`${styles.input} ${styles.passwordInput}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.toggleButton}
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <EyeOff size={20} aria-hidden />
                            ) : (
                                <Eye size={20} aria-hidden />
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={submitting}
                    onClick={handleSubmit}
                >
                    {submitting ? (
                        <>
                            <Loader2 className={styles.loadingIcon} aria-hidden />
                            Logging in...
                        </>
                    ) : (
                        'Login'
                    )}
                </button>
            </form>

            <p className={styles.footerLink}>
                <span className={styles.footerLinkText}>
                    Order Me <span className={styles.footerLinkBold}>Admin</span>
                </span>
            </p>
        </div>
    );
}