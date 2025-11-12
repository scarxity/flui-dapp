interface UseCaseCardProps {
  cardClassName: string;
  iconWrapperClassName: string;
  icon: string;
  title: string;
  description: string;
}

export default function UseCaseCard({
  cardClassName,
  iconWrapperClassName,
  icon,
  title,
  description,
}: UseCaseCardProps) {
  return (
    <div className={cardClassName}>
      <div className={iconWrapperClassName}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
