export default function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      className={`rounded-lg ${color} p-6 shadow-md transition-transform hover:scale-105`}
    >
      <div className="mb-4 text-5xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-indigo-700">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
