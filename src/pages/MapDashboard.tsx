import { useState, useEffect } from "react";
import { Search, Filter, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HospitalMap from "@/components/HospitalMap";
import HospitalCard from "@/components/HospitalCard";
import { Hospital } from "@/data/hospitals";
import { supabase } from "@/lib/supabase";

const filters = ["All", "General", "Emergency", "Specialty"];

const MapDashboard = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dbHospitals, setDbHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      const { data, error } = await supabase.from("hospitals").select("*");
      if (data) {
        const mapped: Hospital[] = data.map((dbH) => {
          const rt = dbH.realtime_data || {};
          return {
            id: dbH.id,
            name: dbH.hospital_name,
            address: dbH.address,
            phone: dbH.phone,
            lat: 28.6139, // placeholder for map api
            lng: 77.2090, // placeholder for map api
            type: rt.hospitalType || "General",
            rating: 4.5,
            isRegistered: true,
            crowdLevel: rt.queueLength > 20 ? "High" : rt.queueLength > 10 ? "Medium" : "Low",
            waitingTime: rt.queueLength ? Number(rt.queueLength) * 3 : 15,
            patientCount: Number(rt.patientCount) || 0,
            availableBeds: Number(rt.availableBeds) || 0,
            totalBeds: rt.totalBeds ? Number(rt.totalBeds) : (Number(rt.availableBeds || 0) + 10),
            icuAvailable: Number(rt.icuAvailable) || 0,
            otAvailable: Number(rt.otAvailable) || 0,
            ambulanceCount: Number(rt.ambulanceCount) || 0,
            queueLength: Number(rt.queueLength) || 0,
          };
        });
        setDbHospitals(mapped);
      }
    };
    fetchHospitals();
  }, []);

  const filtered = dbHospitals.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || h.type === typeFilter;
    return matchSearch && matchType;
  });

  const recommended = filtered.find((h) => h.aiRecommended);

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Hospital Finder</h1>
            <p className="text-sm text-muted-foreground">Find the best hospital near you with AI-powered recommendations</p>
          </div>
          <Button className="gradient-accent text-accent-foreground border-0 gap-2 self-start">
            <Zap className="w-4 h-4" />
            Find Fastest Hospital
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search hospitals by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <Button
                key={f}
                size="sm"
                variant={typeFilter === f ? "default" : "outline"}
                onClick={() => setTypeFilter(f)}
                className={typeFilter === f ? "gradient-hero text-primary-foreground border-0" : ""}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {/* Map + List layout */}
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 h-[500px] rounded-xl overflow-hidden border border-border shadow-card">
            <HospitalMap selectedFilter={typeFilter} />
          </div>
          <div className="lg:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {recommended && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-accent mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> AI RECOMMENDATION
                </p>
                <HospitalCard hospital={recommended} />
              </div>
            )}
            {filtered.filter((h) => !h.aiRecommended).map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;
