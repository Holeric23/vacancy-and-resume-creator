import { useState } from 'react';
import styles from './collapsible-section.module.css';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.section}>
      <div className={styles.header} onClick={() => setIsOpen(p => !p)}>
        <div className={styles.titleWrapper}>
          <span className={`${styles.iconArrow} ${isOpen ? styles.iconArrowRotated : ''}`}>▶</span>
          <span>{title}</span>
        </div>
      </div>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
}