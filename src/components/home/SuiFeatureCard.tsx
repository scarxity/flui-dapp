interface SuiFeatureCardProps {
  cardClassName: string;
  iconWrapperClassName: string;
  icon: string;
  title: string;
  description: string;
}

export default function SuiFeatureCard({
  cardClassName,
  iconWrapperClassName,
  icon,
  title,
  description,
}: SuiFeatureCardProps) {
  return (
    <div className={cardClassName}>
      <div className={"flex items-start gap-4"}>
        <div className={iconWrapperClassName}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
          <p className="text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
