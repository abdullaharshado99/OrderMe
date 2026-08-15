import Image from 'next/image';
import styles from './logo.module.css';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'white';
}

export function Logo({ size = 'md', showText = true, variant = 'default' }: LogoProps) {
  const sizes = {
    sm: { logo: 32, text: 14 },
    md: { logo: 40, text: 18 },
    lg: { logo: 64, text: 28 },
  };

  const dimension = sizes[size];

  return (
    <div className={`${styles.container} ${styles[`size-${size}`]} ${styles[`variant-${variant}`]}`}>
      <div className={styles.logoWrapper}>
        <svg
          viewBox="0 0 64 64"
          width={dimension.logo}
          height={dimension.logo}
          className={styles.logoIcon}
        >
          {/* Circle outline */}
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3" />

          {/* Smiley face - mouth */}
          <path
            d="M 20 32 Q 32 40 44 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Eyes */}
          <circle cx="24" cy="26" r="2.5" fill="currentColor" />
          <circle cx="40" cy="26" r="2.5" fill="currentColor" />

          <g transform="translate(48, 10)">
            <path
              d="M 0 8 Q -2 4 -1 0 Q 1 4 3 0 Q 4 4 2 8 Z"
              fill="currentColor"
            />
          </g>

          <g transform="translate(56, 8)">
            <path
              d="M 0 9 Q -2.5 4 -1.5 0 Q 1 4 3.5 0 Q 4.5 4 2.5 9 Z"
              fill="currentColor"
            />
          </g>
        </svg>
      </div>

      {showText && (
        <div className={styles.textWrapper}>
          <span className={styles.brandName}>Order</span>
          <span className={styles.brandNameAccent}>Me</span>
        </div>
      )}
    </div>
  );
}