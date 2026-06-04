const StatCard = ({ title, value, icon, description }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <p className="text-3xl font-semibold mt-2">{value}</p>
        </div>
        {icon ? <div className="text-3xl">{icon}</div> : null}
      </div>
      {description ? <p className="mt-3 text-sm text-slate-600">{description}</p> : null}
    </div>
  );
};

export default StatCard;
