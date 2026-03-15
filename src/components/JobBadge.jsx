import { useTranslation } from 'react-i18next';
import { Tag } from 'lucide-react';

export default function JobBadge({ jobNumber }) {
  const { t } = useTranslation();
  return (
    <div className="job-badge">
      <Tag className="w-4 h-4 text-muted" />
      <span>
        {t('job_label')} {jobNumber}
      </span>
    </div>
  );
}
