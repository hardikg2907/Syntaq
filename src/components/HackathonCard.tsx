import Image from "next/image";

export interface HackathonCardProps {
  id: number;
  name: string;
  startDate: Date;
  photo: string | null;
}

const HackathonCard = ({ id, name, startDate, photo }: HackathonCardProps) => {
  return (
    <div className="group h-60 w-[250px] rounded-xl transition-shadow duration-100 hover:shadow-md hover:shadow-slate-900 dark:bg-gray-900/40">
      <Image
        src={photo || ""}
        alt={name}
        width={200}
        height={150}
        className="h-40 w-full rounded-t-xl border object-contain"
      />
      <div className="p-3">
        <h1 className="text-xl font-semibold transition-colors duration-100 group-hover:text-blue-400">
          {name}
        </h1>
        <p>{startDate.toDateString()}</p>
      </div>
    </div>
  );
};

export default HackathonCard;
