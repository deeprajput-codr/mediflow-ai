import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Phone, Image, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const RegisterHospital = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    area: "",
    address: "",
    phone: "",
    imageUrl: "",
    totalBeds: "",
    type: "General",
    description: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.area || !form.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Hospital registered successfully! Our team will review and activate your listing.");
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Register Your Hospital</h1>
          <p className="text-muted-foreground mt-2">
            Join MediFlow AI to help patients find your hospital and reduce wait times.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8 space-y-5">
          {/* Hospital Name */}
          <div>
            <Label htmlFor="name" className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-primary" />
              Hospital Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. City General Hospital"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          {/* Area */}
          <div>
            <Label htmlFor="area" className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              Area / Locality <span className="text-destructive">*</span>
            </Label>
            <Input
              id="area"
              placeholder="e.g. Downtown, Sector 12"
              value={form.area}
              onChange={(e) => handleChange("area", e.target.value)}
            />
          </div>

          {/* Full Address */}
          <div>
            <Label htmlFor="address" className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              Full Address
            </Label>
            <Textarea
              id="address"
              placeholder="Complete address with pin code"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="min-h-[70px]"
            />
          </div>

          {/* Contact Number */}
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-primary" />
              Contact Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          {/* Hospital Image URL */}
          <div>
            <Label htmlFor="imageUrl" className="flex items-center gap-2 mb-2">
              <Image className="w-4 h-4 text-primary" />
              Hospital Image URL
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/hospital-photo.jpg"
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
            />
          </div>

          {/* Total Beds */}
          <div>
            <Label htmlFor="totalBeds" className="flex items-center gap-2 mb-2">
              Total Beds
            </Label>
            <Input
              id="totalBeds"
              type="number"
              placeholder="e.g. 150"
              value={form.totalBeds}
              onChange={(e) => handleChange("totalBeds", e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <Label htmlFor="type" className="flex items-center gap-2 mb-2">
              Hospital Type
            </Label>
            <select
              id="type"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="General">General</option>
              <option value="Emergency">Emergency</option>
              <option value="Specialty">Specialty</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="flex items-center gap-2 mb-2">
              Brief Description
            </Label>
            <Textarea
              id="description"
              placeholder="Tell us about your hospital's specialties, facilities, etc."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full gradient-hero text-primary-foreground border-0 gap-2 mt-2">
            <Send className="w-4 h-4" />
            Register Hospital
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterHospital;
