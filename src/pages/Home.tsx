import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Brain, Shield, ArrowRight, Activity, Users, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Users, value: "50K+", label: "Patients Helped" },
  { icon: Activity, value: "120+", label: "Hospitals Connected" },
  { icon: Clock, value: "35%", label: "Wait Time Reduced" },
  { icon: BedDouble, value: "Real-time", label: "Bed Tracking" },
];

const features = [
  {
    icon: MapPin,
    title: "Find Nearby Hospitals",
    description: "Locate hospitals around you with real-time crowd data and availability on an interactive map.",
  },
  {
    icon: Brain,
    title: "AI-Predicted Wait Times",
    description: "Our AI analyzes historical and live data to predict accurate waiting times before you arrive.",
  },
  {
    icon: Clock,
    title: "Smart Queue Management",
    description: "Real-time queue status updates help you choose the fastest hospital for your needs.",
  },
  {
    icon: Shield,
    title: "Emergency Response",
    description: "One-tap emergency mode finds the nearest available hospital with the shortest wait time.",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              AI-Powered Hospital Intelligence
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Smart Hospital Selection.{" "}
              <span className="text-gradient">Less Waiting.</span>{" "}
              Better Care.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              MediFlow AI helps you find the best hospital near you with real-time crowd data,
              AI-predicted waiting times, and smart recommendations — so you spend less time waiting
              and more time healing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link to="/map">
                <Button size="lg" className="gradient-hero text-primary-foreground border-0 gap-2 px-8 shadow-glow">
                  <MapPin className="w-5 h-5" />
                  View Hospitals
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  Hospital Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            How MediFlow AI Works
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Combining real-time data with AI predictions to optimize your hospital experience.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Ready to Find the Best Hospital?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Stop guessing. Let AI guide you to the right hospital with the shortest wait time.
          </p>
          <Link to="/map">
            <Button size="lg" className="bg-card text-primary hover:bg-card/90 gap-2 px-8">
              <MapPin className="w-5 h-5" />
              Explore Map Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 MediFlow AI. Smart Hospital Selection Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
