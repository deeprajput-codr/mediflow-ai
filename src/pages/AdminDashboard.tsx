import { useState, useEffect } from "react";
import { LayoutDashboard, Users, BedDouble, Ambulance, Clock, Save, LogIn, Building2, Phone, MapPin, FileText, UserPlus, Mail, Lock, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const processImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.7));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const AdminDashboard = () => {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("hospitalLoggedIn") === "true");
  const [hospitalEmail, setHospitalEmail] = useState(() => localStorage.getItem("hospitalEmail") || "");
  const [userHospitalName, setUserHospitalName] = useState(() => localStorage.getItem("hospitalName") || "Your Hospital");
  const [editMode, setEditMode] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [hospitalImage, setHospitalImage] = useState<File | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [patientCount, setPatientCount] = useState("45");
  const [queueLength, setQueueLength] = useState("8");
  const [availableBeds, setAvailableBeds] = useState("78");
  const [icuAvailable, setIcuAvailable] = useState("5");
  const [otAvailable, setOtAvailable] = useState("3");
  const [ambulanceCount, setAmbulanceCount] = useState("4");
  
  const [totalBeds, setTotalBeds] = useState("100");
  const [hospitalType, setHospitalType] = useState("General");
  const [emergencyActive, setEmergencyActive] = useState(true);
  const [description, setDescription] = useState("");
  const [speciality, setSpeciality] = useState("");

  useEffect(() => {
    if (loggedIn && hospitalEmail) {
      const fetchHospitalData = async () => {
        const { data, error } = await supabase
          .from('hospitals')
          .select('hospital_name, registration_number, phone, address, realtime_data')
          .eq('email', hospitalEmail)
          .single();
          
        if (data) {
          if (data.hospital_name) {
            setUserHospitalName(data.hospital_name);
            setHospitalName(data.hospital_name);
          }
          if (data.registration_number) setRegistrationNumber(data.registration_number);
          if (data.phone) setPhone(data.phone);
          if (data.address) setAddress(data.address);
          
          if (data.realtime_data) {
            const rt = data.realtime_data;
            if (rt.patientCount) setPatientCount(rt.patientCount);
            if (rt.queueLength) setQueueLength(rt.queueLength);
            if (rt.availableBeds) setAvailableBeds(rt.availableBeds);
            if (rt.icuAvailable) setIcuAvailable(rt.icuAvailable);
            if (rt.otAvailable) setOtAvailable(rt.otAvailable);
            if (rt.ambulanceCount) setAmbulanceCount(rt.ambulanceCount);
            if (rt.totalBeds) setTotalBeds(rt.totalBeds);
            if (rt.hospitalType) setHospitalType(rt.hospitalType);
            if (rt.speciality) setSpeciality(rt.speciality);
            if (rt.lat) setLat(rt.lat);
            if (rt.lng) setLng(rt.lng);
            if (rt.emergencyActive !== undefined) setEmergencyActive(rt.emergencyActive);
          }
        }
      };
      fetchHospitalData();
    }
  }, [loggedIn, hospitalEmail]);

  const handleAuthSuccess = (emailVal: string, nameVal: string) => {
    setLoggedIn(true);
    setHospitalEmail(emailVal);
    setUserHospitalName(nameVal);
    localStorage.setItem("hospitalLoggedIn", "true");
    localStorage.setItem("hospitalEmail", emailVal);
    localStorage.setItem("hospitalName", nameVal);
    window.dispatchEvent(new Event("hospitalAuthChange"));
  };

  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    toast.info("Fetching your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLng(longitude);
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
            toast.success("Location retrieved successfully!");
          } else {
            toast.error("Failed to parse location data.");
          }
        } catch (error) {
          toast.error("Error fetching location details.");
        }
      },
      (error) => {
        toast.error("Location access denied or unavailable.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (email && password && hospitalName && registrationNumber && phone && address) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          toast.error("Please enter a valid email address.");
          return;
        }
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters long.");
          return;
        }
        if (!/^\+?[\d\s-]{10,}$/.test(phone)) {
          toast.error("Please enter a valid phone number.");
          return;
        }
        try {
          let imageUrl = null;
          if (hospitalImage) {
            try { imageUrl = await processImage(hospitalImage); } 
            catch(e) { console.error("Image processing error", e); }
          }
          
          let finalLat = lat;
          let finalLng = lng;
          if (!finalLat || !finalLng) {
            try {
              toast.info("Pinpointing address on map...");
              const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, {
                headers: { 'Accept-Language': 'en' }
              });
              if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                  finalLat = parseFloat(data[0].lat);
                  finalLng = parseFloat(data[0].lon);
                  toast.success("Address successfully plotted!");
                } else {
                  toast.warning("Could not definitively isolate address coordinates. Using fallback.");
                }
              } else {
                console.warn("Geocoding rate limit/error", res.status);
              }
            } catch(e) { console.error("Geocoding fallback error", e); }
          }

          const salt = bcrypt.genSaltSync(10);
          const password_hash = bcrypt.hashSync(password, salt);

          const { data, error } = await supabase
            .from('hospitals')
            .insert([{
              hospital_name: hospitalName,
              registration_number: registrationNumber,
              phone,
              address,
              email,
              password_hash,
              realtime_data: {
                description,
                hospitalType,
                speciality,
                patientCount,
                queueLength,
                availableBeds,
                icuAvailable,
                otAvailable,
                ambulanceCount,
                totalBeds,
                emergencyActive,
                imageUrl,
                lat: finalLat,
                lng: finalLng
              }
            }]);

          if (error) throw error;

          handleAuthSuccess(email, hospitalName);
          toast.success("Welcome! Your hospital is now registered and logged in.");
        } catch (err: any) {
          toast.error(err.message || "Registration failed. Does this email/license already exist?");
        }
      } else {
        toast.error("Please fill in all general fields.");
      }
    } else {
      if (email && password) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          toast.error("Please enter a valid email address.");
          return;
        }
        try {
          const { data, error } = await supabase
            .from('hospitals')
            .select('password_hash, hospital_name')
            .eq('email', email)
            .single();
            
          if (error || !data) {
            toast.error("Invalid email or password.");
            return;
          }

          const isValid = bcrypt.compareSync(password, data.password_hash);
          if (isValid) {
            handleAuthSuccess(email, data.hospital_name);
            toast.success(`Welcome back, ${data.hospital_name}!`);
          } else {
            toast.error("Invalid email or password.");
          }
        } catch (err: any) {
          toast.error("Login failed. Please try again.");
        }
      } else {
        toast.error("Please enter email and password.");
      }
    }
  };

  const handleSave = async () => {
    try {
      if (!hospitalEmail) throw new Error("No hospital email identified.");
      
      const { data: existingData } = await supabase.from('hospitals').select('realtime_data').eq('email', hospitalEmail).single();
      const existingRt = existingData?.realtime_data || {};

      const { error } = await supabase
        .from('hospitals')
        .update({
          realtime_data: {
            ...existingRt,
            patientCount,
            queueLength,
            availableBeds,
            icuAvailable,
            otAvailable,
            ambulanceCount,
            totalBeds,
            hospitalType,
            emergencyActive
          }
        })
        .eq('email', hospitalEmail);
        
      if (error) throw error;
      toast.success("Live metrics updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update hospital data.");
    }
  };

  const handleProfileSave = async () => {
    try {
      if (!hospitalEmail) throw new Error("No hospital email identified.");
      
      let newImageUrl = undefined;
      if (hospitalImage) {
        try { newImageUrl = await processImage(hospitalImage); }
        catch(e) { console.error("Image processing error", e); }
      }

      // First fetch existing data to prevent overwriting existing image if none is uploaded
      const { data: existingData } = await supabase.from('hospitals').select('address, realtime_data').eq('email', hospitalEmail).single();
      const existingRt = existingData?.realtime_data || {};
      const existingAddress = existingData?.address || "";
      
      let finalLat = lat || existingRt.lat;
      let finalLng = lng || existingRt.lng;

      if (!lat && !lng && address !== existingAddress) {
        try {
          toast.info("Updating map coordinates...");
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, {
             headers: { 'Accept-Language': 'en' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              finalLat = parseFloat(data[0].lat);
              finalLng = parseFloat(data[0].lon);
              toast.success("Map location updated!");
            } else {
              toast.warning("Could not definitively isolate new address coordinates.");
            }
          }
        } catch(e) { console.error("Geocoding fallback error", e); }
      }

      const { error } = await supabase
        .from('hospitals')
        .update({
          hospital_name: hospitalName,
          registration_number: registrationNumber,
          phone,
          address,
          realtime_data: {
            ...existingRt,
            patientCount,
            queueLength,
            availableBeds,
            icuAvailable,
            otAvailable,
            ambulanceCount,
            totalBeds,
            hospitalType,
            speciality,
            emergencyActive,
            ...(newImageUrl ? { imageUrl: newImageUrl } : {}),
            lat: finalLat,
            lng: finalLng
          }
        })
        .eq('email', hospitalEmail);
        
      if (error) throw error;
      setUserHospitalName(hospitalName);
      localStorage.setItem("hospitalName", hospitalName);
      window.dispatchEvent(new Event("hospitalAuthChange"));
      setEditMode(false);
      toast.success("Hospital profile info updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    }
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
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="address" className="mb-0">Full Address</Label>
                      <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary" onClick={handleLiveLocation}>
                        <MapPin className="w-3 h-3 mr-1" /> Get Live Location
                      </Button>
                    </div>
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
                    <Label htmlFor="type_spec">Hospital Type & Speciality</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={hospitalType} 
                        onChange={e => setHospitalType(e.target.value)}
                      >
                        <option value="General">General</option>
                        <option value="Specialty">Specialty</option>
                        <option value="Superspecialist">Superspecialist</option>
                        <option value="Multispecialist">Multispecialist</option>
                      </select>
                      <Input
                        placeholder="e.g. Cardiology"
                        value={speciality}
                        onChange={(e) => setSpeciality(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="description"
                        type="text"
                        placeholder="Brief overview of the hospital"
                        className="pl-9"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                    className="pl-9"
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
                    className="pl-9"
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
            <h1 className="font-display text-2xl font-bold text-foreground">{userHospitalName}</h1>
            <p className="text-sm text-muted-foreground">Manage your hospital profile and live data</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant={editMode ? "default" : "secondary"} size="sm" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancel Edit" : "Update Info"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setLoggedIn(false);
              setHospitalEmail("");
              localStorage.removeItem("hospitalLoggedIn");
              localStorage.removeItem("hospitalEmail");
              localStorage.removeItem("hospitalName");
              window.dispatchEvent(new Event("hospitalAuthChange"));
            }}>
              Sign Out
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-card p-6">
          <h2 className="font-display font-bold text-foreground mb-6">
            {editMode ? "Edit Profile Information" : "Update Live Metrics"}
          </h2>
          
          {editMode ? (
            <div className="grid sm:grid-cols-2 gap-5 mb-2">
              <div>
                <Label className="mb-2 block">Hospital Name</Label>
                <Input value={hospitalName} onChange={e => setHospitalName(e.target.value)} />
              </div>
              <div>
                <Label className="mb-2 block">Registration Number</Label>
                <Input value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} />
              </div>
              <div>
                <Label className="mb-2 block">Phone</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <Label className="mb-2 block">Address</Label>
                <Input value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
              <div className="space-y-2">
                <Label className="mb-2 block">Hospital & Speciality Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={hospitalType} 
                    onChange={e => setHospitalType(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Specialty">Specialty</option>
                    <option value="Superspecialist">Superspecialist</option>
                    <option value="Multispecialist">Multispecialist</option>
                  </select>
                  <Input
                    placeholder="e.g. Cardiology"
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label className="mb-2 block">Total Beds capacity</Label>
                <Input type="number" value={totalBeds} onChange={e => setTotalBeds(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label className="mb-2 block">Hospital Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setHospitalImage(e.target.files[0]);
                    }
                  }}
                />
              </div>
              <div className="sm:col-span-2 mt-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={emergencyActive} 
                    onChange={e => setEmergencyActive(e.target.checked)}
                    className="w-4 h-4 rounded border-input"
                  />
                  Emergency Services Currently Active
                </Label>
              </div>
                <Button onClick={handleProfileSave} className="mt-4 gradient-hero text-primary-foreground border-0 gap-2">
                  <Save className="w-4 h-4" />
                  Save Profile Info
                </Button>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
