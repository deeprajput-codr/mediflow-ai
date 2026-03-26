import { useState } from "react";
import { LayoutDashboard, Users, BedDouble, Ambulance, Clock, Save, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [patientCount, setPatientCount] = useState("45");
  const [queueLength, setQueueLength] = useState("8");
  const [availableBeds, setAvailableBeds] = useState("78");
  const [icuAvailable, setIcuAvailable] = useState("5");
  const [otAvailable, setOtAvailable] = useState("3");
  const [ambulanceCount, setAmbulanceCount] = useState("4");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setLoggedIn(true);
      toast.success("Logged in successfully!");
    }
  };

  const handleSave = () => {
    toast.success("Hospital data updated successfully!");
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-full max-w-md mx-4">
          <div className="bg-card rounded-xl border border-border shadow-elevated p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">Hospital Admin</h1>
              <p className="text-sm text-muted-foreground mt-1">Sign in to manage your hospital data</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full gradient-hero text-primary-foreground border-0 gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const fields = [
    { label: "Patient Count", icon: Users, value: patientCount, setter: setPatientCount },
    { label: "Queue Length", icon: Clock, value: queueLength, setter: setQueueLength },
    { label: "Available Beds", icon: BedDouble, value: availableBeds, setter: setAvailableBeds },
    { label: "ICU Available", icon: BedDouble, value: icuAvailable, setter: setIcuAvailable },
    { label: "OT Available", icon: BedDouble, value: otAvailable, setter: setOtAvailable },
    { label: "Ambulances", icon: Ambulance, value: ambulanceCount, setter: setAmbulanceCount },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Update real-time hospital data</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLoggedIn(false)}>
            Sign Out
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card p-6">
          <h2 className="font-display font-bold text-foreground mb-6">City General Hospital</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label}>
                  <Label className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-primary" />
                    {field.label}
                  </Label>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                  />
                </div>
              );
            })}
          </div>
          <Button onClick={handleSave} className="mt-6 gradient-hero text-primary-foreground border-0 gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
