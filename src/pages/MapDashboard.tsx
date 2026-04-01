import { useState, useEffect } from "react";
import { Search, Filter, Zap, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HospitalMap from "@/components/HospitalMap";
import HospitalCard from "@/components/HospitalCard";
import { Hospital } from "@/data/hospitals";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";

const filters = ["All", "General", "Specialty", "Superspecialist", "Multispecialist"];

const MapDashboard = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dbHospitals, setDbHospitals] = useState<Hospital[]>([]);
  const [osmHospitals, setOsmHospitals] = useState<Hospital[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

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
            lat: rt.lat || 28.6139, // placeholder for map api fallback
            lng: rt.lng || 77.2090, // placeholder for map api fallback
            type: rt.hospitalType || "General",
            speciality: rt.speciality || "",
            imageUrl: rt.imageUrl || "",
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

    // Set up Realtime Subscription!
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hospitals' },
        (payload) => {
          console.log("Realtime hospital update received!", payload);
          fetchHospitals(); // Instantly refresh UI without reloading page!
        }
      )
      .subscribe();

    // Fetch user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Fetch unregistered hospitals around user from OpenStreetMap Overpass (approx 10km radius)
        try {
          const query = `
            [out:json];
            node(around:10000,${latitude},${longitude})[amenity=hospital];
            out;
          `;
          let data = null;
          const endpoints = [
            'https://overpass-api.de/api/interpreter',
            'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
          ];
          
          for (const ep of endpoints) {
            try {
              const res = await fetch(`${ep}?data=${encodeURIComponent(query)}`);
              if (res.ok) {
                data = await res.json();
                break;
              }
            } catch (err) {
              console.warn(`OSM endpoint ${ep} failed, trying next...`);
            }
          }
          
          if (data && data.elements) {
            const mappedOsm: Hospital[] = data.elements.map((el: any) => ({
              id: `osm_${el.id}`,
              name: el.tags?.name || "Unknown Hospital",
              address: "OpenStreetMap Data",
              phone: el.tags?.phone || "N/A",
              lat: el.lat,
              lng: el.lon,
              type: "General",
              speciality: "",
              imageUrl: "",
              rating: 0,
              isRegistered: false,
              crowdLevel: "Low",
              waitingTime: 0,
              patientCount: 0,
              availableBeds: 0,
              totalBeds: 0,
              icuAvailable: 0,
              otAvailable: 0,
              ambulanceCount: 0,
              queueLength: 0,
              emergencyActive: false
            }));
            
            setOsmHospitals(mappedOsm);
          }
        } catch (error) {
          console.error("Failed to fetch OSM hospitals", error);
        }
      }, (err) => {
        console.warn("Geolocation denied or error:", err);
      });
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Map old registered hospitals to the user's location gracefully if they were registered without 'Get Live Location'
  const geolocatedDbHospitals = dbHospitals.map(h => {
    if (h.lat === 28.6139 && h.lng === 77.2090 && userLocation) {
      return {
        ...h,
        lat: userLocation.lat + (Math.random() * 0.02 - 0.01),
        lng: userLocation.lng + (Math.random() * 0.02 - 0.01)
      };
    }
    return h;
  });

  const combinedData = [...geolocatedDbHospitals, ...osmHospitals];

  const filtered = combinedData.filter((h) => {
    const searchTerm = search.toLowerCase();
    const matchSearch = h.name.toLowerCase().includes(searchTerm) ||
      h.address.toLowerCase().includes(searchTerm) ||
      (h.speciality && h.speciality.toLowerCase().includes(searchTerm));
    const matchType = typeFilter === "All" || h.type === typeFilter;
    return matchSearch && matchType;
  });

  // Calculate dynamic AI Score for every facility matching the filter
  const getAiScore = (h: Hospital): number => {
    let score = 0;
    
    // 1. Verification Bonus (Reliability)
    if (h.isRegistered) score += 50;

    // 2. Proximity Bonus (Distance)
    if (userLocation && h.lat && h.lng) {
      // Euclidean distance proxy
      const dist = Math.sqrt(Math.pow(userLocation.lat - h.lat, 2) + Math.pow(userLocation.lng - h.lng, 2));
      const maxDistPoints = 100;
      const decayFactor = 500; // Severe penalty for being mathematically far away
      score += Math.max(0, maxDistPoints - (dist * decayFactor));
    }

    // 3. Crowd Level Optimization
    if (h.crowdLevel === "Low") score += 40;
    else if (h.crowdLevel === "Medium") score += 10;
    else score -= 30; // Severe penalty for crowded ER

    // 4. Resource Availability
    score += Math.min(30, Number(h.availableBeds) || 0);
    score += Math.min(20, (Number(h.ambulanceCount) || 0) * 2);
    
    // 5. Emergency Functionality
    if (h.emergencyActive) score += 20;
    
    // 6. Immediate Availability
    score -= Math.min(40, Number(h.waitingTime) || 0);

    return score;
  };

  // Rank every facility dynamically in runtime
  const scoredFiltered = filtered.map(h => ({ ...h, aiScore: getAiScore(h) }));
  scoredFiltered.sort((a, b) => b.aiScore - a.aiScore);

  const recommended = scoredFiltered.length > 0 ? scoredFiltered[0] : null;
  if (recommended) recommended.aiRecommended = true;

  // Render the remaining without duplicating the recommended one
  const restList = scoredFiltered.filter(h => h.id !== recommended?.id);

  const handleAiAnalysis = async () => {
    if (combinedData.length === 0) {
      toast.error("No hospitals detected nearby. Please wait for the map to load or register a facility.");
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
    if (!apiKey) {
      toast.error("AI API Key missing! Please add it to your .env file.");
      return;
    }

    try {
      setIsAiLoading(true);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Gather top 4 local hospitals to provide explicit context to Gemini
      const topHospitals = restList.slice(0, 3).concat(recommended ? [recommended] : []);
      const contextData = topHospitals.map(h => ({
        name: h.name,
        wait_time_minutes: h.waitingTime || 0,
        available_beds: h.availableBeds || 0,
        active_ambulances: h.ambulanceCount || 0,
        crowd_level: h.crowdLevel,
        is_database_verified: h.isRegistered
      }));

      const prompt = `You are an elite medical routing AI called 'MediFlow AI'. The user needs to find the absolute fastest hospital nearby to them.
Here is a live JSON grid of the closest hospitals right now:
${JSON.stringify(contextData, null, 2)}

Analyze this data matrix. In 2 short, highly professional sentences, explicitly name the exact hospital they should go to and justify why using their exact bed counts or wait times. Sound confident, analytical, and extremely capable (e.g. "I have analyzed the localized grid..."). Do NOT use markdown. Do NOT use bullet points.`;

      const result = await model.generateContent(prompt);
      setAiAnalysis(result.response.text());
      toast.success("AI Prediction Complete!");
    } catch (e) {
      console.error(e);
      toast.error("AI Prediction failed to connect. Check your internet or API key status.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Hospital Finder</h1>
            <p className="text-sm text-muted-foreground">Find the best hospital near you with AI-powered recommendations</p>
          </div>
          <Button 
            className="gradient-accent text-accent-foreground border-0 gap-2 self-start hover:shadow-lg transition-all"
            disabled={isAiLoading}
            onClick={() => {
              handleAiAnalysis();
              const el = document.getElementById('ai-recommendation-card');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('ring-4', 'ring-accent', 'rounded-xl', 'transition-all', 'duration-500');
                setTimeout(() => el.classList.remove('ring-4', 'ring-accent'), 1500);
              }
            }}
          >
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
          <div className="lg:col-span-3 h-[500px] rounded-xl overflow-hidden border border-border shadow-card relative z-0">
            <HospitalMap selectedFilter={typeFilter} hospitalsData={filtered} userLocation={userLocation} />
          </div>
          <div className="lg:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {/* Dynamic AI Insights Widget */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 relative overflow-hidden shadow-sm">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary animate-pulse" />
               <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                 <Brain className="w-4 h-4" /> Live AI Prediction
               </h3>
               <div className="text-xs text-muted-foreground leading-relaxed">
                 {isAiLoading ? (
                   <span className="flex items-center gap-2 text-primary font-medium">
                     <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></span>
                     AI is analyzing the spatial grid vectors...
                   </span>
                 ) : aiAnalysis ? (
                   <span className="font-medium text-foreground">{aiAnalysis}</span>
                 ) : combinedData.length > 0 ? (
                   <p>
                     Monitoring <b>{combinedData.length}</b> localized medical nodes. 
                     {restList.some(h => h.crowdLevel === "High" && h.isRegistered) ? " ⚠️ High congestion patterns detected. " : " Traffic flow is optimal. "}
                     Click <b>"Find Fastest Hospital"</b> to engage AI routing prediction.
                   </p>
                 ) : "Awaiting spatial grid data..."}
               </div>
            </div>

            {recommended && (
              <div id="ai-recommendation-card" className="mb-4">
                <p className="text-xs font-bold text-accent mb-2 flex items-center gap-1 uppercase tracking-wider">
                  <Zap className="w-4 h-4" /> Top AI Recommendation
                </p>
                <div className="relative">
                  <HospitalCard hospital={recommended} />
                </div>
              </div>
            )}
            {restList.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;
