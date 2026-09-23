import React from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { ShieldCheck, HeartHandshake, MapPin, Compass, ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 text-xs border-t border-slate-800 pb-20 md:pb-8 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-4 md:col-span-1">
            <Logo size={28} textClassName="text-lg font-bold tracking-tight text-white" />
            <p className="text-slate-300 text-xs leading-relaxed">
              Travally is a free social travel companion and discovery platform connecting people through shared everyday activities, cultural passions, and upcoming journeys.
            </p>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Activity-First Mutual Discovery</span>
            </div>
          </div>

          {/* Col 2: Companion Mode Categories */}
          <div>
            <h3 className="text-white font-bold mb-3 text-xs tracking-wider uppercase">
              Companion Activities
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/movies" className="text-slate-300 hover:text-teal-400 transition flex items-center justify-between">
                  <span>Movies & Cinema</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/categories/food-cafes" className="text-slate-300 hover:text-teal-400 transition flex items-center justify-between">
                  <span>Food & Cafes</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/categories/walking" className="text-slate-300 hover:text-teal-400 transition flex items-center justify-between">
                  <span>Walking & Trails</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/categories/studying" className="text-slate-300 hover:text-teal-400 transition flex items-center justify-between">
                  <span>Study & Co-Working</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/categories/city-exploration" className="text-slate-300 hover:text-teal-400 transition flex items-center justify-between">
                  <span>City Exploration</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Travel Mode Destinations */}
          <div>
            <h3 className="text-white font-bold mb-3 text-xs tracking-wider uppercase">
              Featured Travel Hubs
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/destinations/tokyo" className="text-slate-300 hover:text-amber-400 transition flex items-center justify-between">
                  <span>Tokyo & Kyoto, Japan</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/destinations/barcelona" className="text-slate-300 hover:text-amber-400 transition flex items-center justify-between">
                  <span>Barcelona, Spain</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/destinations/interlaken" className="text-slate-300 hover:text-amber-400 transition flex items-center justify-between">
                  <span>Interlaken, Switzerland</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/destinations/san-francisco" className="text-slate-300 hover:text-amber-400 transition flex items-center justify-between">
                  <span>San Francisco, USA</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Safety & Rules */}
          <div>
            <h3 className="text-white font-bold mb-3 text-xs tracking-wider uppercase">
              Trust & Safety
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/safety#guidelines" className="text-slate-300 hover:text-white transition">
                  Community Standards
                </Link>
              </li>
              <li>
                <Link href="/safety#in-person-tips" className="text-slate-300 hover:text-white transition">
                  Public Meeting Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/safety#travel-precautions" className="text-slate-300 hover:text-white transition">
                  Travel Precautions & Planning
                </Link>
              </li>
              <li>
                <Link href="/safety#reporting" className="text-slate-300 hover:text-white transition">
                  Reporting & Blocking Conduct
                </Link>
              </li>
              <li>
                <Link href="/safety#terms" className="text-slate-300 hover:text-white transition">
                  Terms of Use & Disclaimers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Safety Notice */}
        <div className="pt-6 border-t border-slate-800 text-xs leading-relaxed text-slate-300 space-y-2">
          <p>
            <strong className="text-white font-bold">Safety & Real-World Meeting Notice:</strong> Travally is a communication and discovery tool designed to facilitate introductions based on mutual activity and travel interests. Users are solely responsible for their personal safety, vetting, decisions, and real-world interactions. Always meet in populated public venues, inform trusted friends or family of your itinerary, and trust your instincts. Travally does not operate a paid companion service, guarantee user verification beyond documented badge checks, or book tickets or travel reservations on behalf of users.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-2 text-slate-300">
            <span>© {new Date().getFullYear()} Travally. All rights reserved. Free social travel companion network.</span>
            <div className="flex gap-4">
              <Link href="/safety#terms" className="hover:text-white">Terms of Service</Link>
              <Link href="/safety#privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/safety" className="hover:text-white">Safety Center</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
