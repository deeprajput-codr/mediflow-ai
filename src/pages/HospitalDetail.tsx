import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Users, BedDouble, Ambulance, Star, Phone, MapPin, Brain, Award, Siren, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hospitals } from "@/data/hospitals";
import CrowdBadge from "@/components/CrowdBadge";
import { Progress } from "@/components/ui/progress";

const HospitalDetail = () => {
  const { id } = useParams();
  const hospital = hospitals.find((h) => h.id === id);

  if (!hospital) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Hospital Not Found</h2>
          <Link to="/map">
            <Button variant="outline">Back to Map</Button>
          </Link>
        </div>
      </div>
    );
  }

  const bedOccupancy = ((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 100;

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Link to="/map" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </Link>

        {/* Header */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden mb-6">
          {hospital.aiRecommended && (
            <div className="gradient-accent px-6 py-2 flex items-center gap-2 text-accent-foreground text-sm font-semibold">
              <Award className="w-4 h-4" />
              Best Choice Right Now — AI Recommended
            </div>
          )}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{hospital.name}</h1>
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" /> {hospital.address}
                </p>
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <Phone className="w-4 h-4" /> {hospital.phone}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CrowdBadge level={hospital.crowdLevel} size="lg" />
                <div className="flex items-center gap-1 text-sm bg-warning/10 text-warning px-3 py-1.5 rounded-full font-medium">
                  <Star className="w-4 h-4 fill-warning" /> {hospital.rating}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Prediction */}
        <div className="bg-card rounded-xl border border-border shadow-card p-6 mb-6">
          <h2 className="font-display font-bold text-foreground flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-primary" />
            AI Prediction
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="font-display text-3xl font-bold text-foreground">{hospital.waitingTime}</div>
              <div className="text-sm text-muted-foreground">min estimated wait</div>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <Users className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="font-display text-3xl font-bold text-foreground">{hospital.queueLength}</div>
              <div className="text-sm text-muted-foreground">patients in queue</div>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <Activity className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="font-display text-3xl font-bold text-foreground">{hospital.patientCount}</div>
              <div className="text-sm text-muted-foreground">current patients</div>
            </div>
          </div>
        </div>

        {/* Live Data */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-display font-bold text-foreground mb-4">Bed Availability</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">General Beds</span>
                  <span className="font-medium text-foreground">{hospital.availableBeds}/{hospital.totalBeds}</span>
                </div>
                <Progress value={bedOccupancy} className="h-2" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ICU Available</span>
                <span className="font-bold text-foreground">{hospital.icuAvailable}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">OT Available</span>
                <span className="font-bold text-foreground">{hospital.otAvailable}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-card p-6">
            <h3 className="font-display font-bold text-foreground mb-4">Emergency Services</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Ambulance className="w-4 h-4 text-primary" /> Ambulances
                </span>
                <span className="font-bold text-foreground">{hospital.ambulanceCount} available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Siren className="w-4 h-4 text-danger" /> Emergency
                </span>
                <span className="font-bold text-success">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hospital Type</span>
                <span className="text-sm font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
                  {hospital.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetail;
