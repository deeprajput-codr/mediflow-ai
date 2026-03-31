import { Link } from "react-router-dom";
import { Clock, Users, BedDouble, Star, Ambulance, Award } from "lucide-react";
import type { Hospital } from "@/data/hospitals";
import CrowdBadge from "./CrowdBadge";

const HospitalCard = ({ hospital }: { hospital: Hospital }) => {
  return (
    <Link
      to={`/hospital/${hospital.id}`}
      className="block bg-card rounded-xl border border-border shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
    >


      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
              {hospital.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">{hospital.address}</p>
          </div>
          <CrowdBadge level={hospital.crowdLevel} />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">{hospital.waitingTime} min</strong> wait</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">{hospital.queueLength}</strong> in queue</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BedDouble className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">{hospital.availableBeds}</strong> beds free</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ambulance className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">{hospital.ambulanceCount}</strong> ambulances</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div></div>
          <span className="text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
            {hospital.type}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HospitalCard;
