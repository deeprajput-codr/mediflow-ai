import { useState } from "react";
import { LayoutDashboard, Users, BedDouble, Ambulance, Clock, Save, LogIn, Building2, Phone, MapPin, FileText, UserPlus, Mail, Lock, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [hospitalImage, setHospitalImage] = useState<File | null>(null);

  const [patientCount, setPatientCount] = useState("45");
  const [queueLength, setQueueLength] = useState("8");
  const [availableBeds, setAvailableBeds] = useState("78");
  const [icuAvailable, setIcuAvailable] = useState("5");
  const [otAvailable, setOtAvailable] = useState("3");
  const [ambulanceCount, setAmbulanceCount] = useState("4");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (email && password && hospitalName && registrationNumber && phone && address && hospitalImage) {
        setLoggedIn(true);
        toast.success("Hospital registered successfully!");
      } else {
        toast.error("Please fill in all fields.");
      }
    } else {
      if (email && password) {
        setLoggedIn(true);
        toast.success("Logged in successfully!");
      } else {
        toast.error("Please enter email and password.");
      }
    }
  };

  const handleSave = () => {
    toast.success("Hospital data updated successfully!");
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen pt-16 pb-16 flex items-center justify-center">
        <div className="w-full max-w-md mx-4 mt-8">
          <div className="bg-card rounded-xl border border-border shadow-elevated p-8 transition-all duration-300">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {isRegistering ? "Register Hospital" : "Hospital Admin"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isRegistering 
                  ? "Create an account for your hospital"
                  : "Sign in to manage your hospital data"
                }
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="hospitalName"
                        type="text"
                        placeholder="City General Hospital"
                        className="pl-9"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration/License Number</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="registrationNumber"
                        type="text"
                        placeholder="REG-1234567"
                        className="pl-9"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="pl-9"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        type="text"
                        placeholder="123 Healthcare Ave, City"
                        className="pl-9"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospitalImage">Hospital Image</Label>
                    <div className="relative">
                      <ImagePlus className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="hospitalImage"
                        type="file"
                        accept="image/*"
                        className="pl-9 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setHospitalImage(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@hospital.com"
                    className={isRegistering ? "pl-9" : ""}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={isRegistering ? "pl-9" : ""}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-hero text-primary-foreground border-0 gap-2 mt-6">
                {isRegistering ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Register Hospital
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                {isRegistering ? "Already have an account?" : "Hospital not registered yet?"}
              </p>
              <Button 
                variant="link" 
                className="text-primary p-0 h-auto mt-1 font-medium"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? "Sign in instead" : "Register your hospital"}
              </Button>
            </div>
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
