import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface CampaignCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
  description?: string;
  link?: string;
  descriptionLink?: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ title, icon: Icon, value, description, link, descriptionLink }) => {
  const content = (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>     
       
        {description && !descriptionLink && <p className="text-xs text-muted-foreground">{description}</p>}
        {descriptionLink && (
          <Link href={descriptionLink}>
            <span className="text-xs text-silver-500 hover:underline">{description}</span>
          </Link>
        )}
      </CardContent>
    </>
  );

  return (
    <Card>
      {link ? (
        <Link href={link} className="hover:text-blue">
          {content}
        </Link>
      ) : (
        content
      )}
    </Card>
  );
};

export default CampaignCard;