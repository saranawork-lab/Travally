import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  HeartHandshake,
  Compass,
  MapPin,
  Flag,
  UserX,
  FileText,
  PhoneCall,
} from "lucide-react";

export const metadata = {
  title: "Safety Center & Community Guidelines — Travally",
  description: "Safety guidelines, in-person meeting recommendations, travel precautions, and terms of use for the Travally platform.",
};

export default function SafetyCenterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24 text-slate-900 dark:text-slate-100">
      {/* Hero */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 border border-teal-200 dark:border-teal-800">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Travally Safety Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          Your safety, peace of mind, and mutual trust are the foundation of Travally. Review our guidelines for safe meetings, travel vetting, and community expectations.
        </p>
      </div>

      {/* 1. Community Guidelines */}
      <section id="guidelines" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-teal-600">
          <HeartHandshake className="w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Core Community Standards
          </h2>
        </div>
        <div className="space-y-3 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
          <p>
            <strong>Activity-First Discovery:</strong> Travally is built for genuine social connections centered on shared experiences—movies, cafes, outdoor trails, cultural exploration, and travel. Respect people’s connection preferences.
          </p>
          <p>
            <strong>Zero Commercial Solicitation:</strong> Travally is 100% free. Paid companion bookings, commercial escort services, ticket scalping, or marketing solicitations are strictly prohibited and result in immediate account termination.
          </p>
          <p>
            <strong>Organizer Authority & Mutual Consent:</strong> Organizers have the right to set participant limits and accept or decline requests. Respect decisions without harassment or persistent messaging.
          </p>
        </div>
      </section>

      {/* 2. In-Person Meeting Safety */}
      <section id="in-person-tips" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-teal-600">
          <MapPin className="w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. In-Person Companion Safety Checklist
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white">Meet Only in Public Venues</span>
            <p className="text-slate-500 leading-relaxed">
              Always arrange to meet at well-lit, populated public locations—such as theater marquees, bustling cafes, or museum lobbies. Avoid secluded or private spaces for first encounters.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white">Notify a Friend or Family Member</span>
            <p className="text-slate-500 leading-relaxed">
              Before heading out, tell someone you trust where you are going, whom you are meeting, and when you expect to return.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white">Control Your Own Transportation</span>
            <p className="text-slate-500 leading-relaxed">
              Arrive and depart under your own arrangements (personal vehicle, transit, or ride-share). Do not accept rides in private vehicles from someone you just met.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white">Trust Your Intuition</span>
            <p className="text-slate-500 leading-relaxed">
              If an interaction feels uncomfortable, you are completely free to excuse yourself and leave. Your comfort and safety take precedence over politeness.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Travel Precautions */}
      <section id="travel-precautions" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-amber-600">
          <Compass className="w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Travel Mode Companion Precautions
          </h2>
        </div>
        <div className="space-y-3 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
          <p>
            <strong>Video Call Before Booking:</strong> We strongly advise scheduling a video call with prospective travel companions prior to non-refundable flight or lodging commitments to ensure alignment on budget, expectations, and personal boundaries.
          </p>
          <p>
            <strong>Maintain Financial Independence:</strong> Travally does not handle hotel or flight payments. Always book your own accommodations and transit directly with certified providers so your itinerary remains in your control.
          </p>
          <p>
            <strong>Emergency Information & Insurance:</strong> Ensure you have comprehensive travel insurance and have saved contact details for local emergency services and your country&apos;s embassy.
          </p>
        </div>
      </section>

      {/* 4. Reporting & Blocking */}
      <section id="reporting" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-rose-600">
          <Flag className="w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            4. Reporting Misconduct & Instant Blocking
          </h2>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
          If any user behaves inappropriately, sends harassing messages, or violates community guidelines:
        </p>
        <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-200 space-y-1">
          <li><strong>Report Immediately:</strong> Click the flag icon on any activity card, trip, chat, or user profile to route an alert to our moderation team.</li>
          <li><strong>Instant Block:</strong> Blocking a user immediately prevents them from messaging you or seeing your future activities.</li>
        </ul>
      </section>

      {/* 5. Terms of Use & Disclaimers */}
      <section id="terms" className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 text-teal-400">
          <FileText className="w-5 h-5" />
          <h2 className="text-lg font-bold">
            5. Legal Disclaimers & Terms of Use
          </h2>
        </div>
        <div className="text-xs text-slate-200 space-y-3 leading-relaxed">
          <p>
            <strong>Self-Responsibility & Assumption of Risk:</strong> Travally serves solely as a discovery and communication tool to facilitate introductions based on mutual interest. Users voluntarily choose to communicate and meet. Travally does not conduct criminal background checks, screen every real-world encounter, or guarantee user truthfulness. You assume all responsibility for your decisions and actions.
          </p>
          <p>
            <strong>No platform warranty:</strong> We disclaim any liability for injuries, damages, disputes, financial loss, or personal conflicts arising out of offline interactions or travel arrangements between users.
          </p>
          <p>
            <strong>No External Bookings:</strong> Travally does not sell tickets, book hotels, reserve cinema seats, or provide transport services. Any such arrangements are strictly the responsibility of individual participants.
          </p>
        </div>
      </section>
    </div>
  );
}
