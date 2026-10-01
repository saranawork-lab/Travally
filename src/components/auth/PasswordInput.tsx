"use client";

import React, { useState } from "react";
import { Lock as LockIcon, Eye, EyeOff, Check, X } from "lucide-react";
import { evaluatePassword } from "@/lib/passwordValidation";

interface PasswordInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  showCriteria?: boolean;
  className?: string;
  autoComplete?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  label = "Password",
  placeholder = "••••••••••••",
  required = true,
  showCriteria = false,
  className = "",
  autoComplete = "current-password",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const criteria = evaluatePassword(value);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <LockIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full pl-10 pr-11 py-2.5 rounded-2xl border border-slate-200 dark:border-emerald-950/70 bg-white dark:bg-[#16201b] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition shadow-xs"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none"
          title={showPassword ? "Hide password" : "View password"}
          aria-label={showPassword ? "Hide password" : "View password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {showCriteria && (isFocused || value.length > 0) && (
        <div className="pt-2 pb-1 px-3 bg-slate-50 dark:bg-emerald-950/20 border border-slate-200/80 dark:border-emerald-900/40 rounded-xl space-y-1.5 transition-all text-[11px]">
          <div className="font-semibold text-slate-600 dark:text-slate-300 text-[10px] uppercase tracking-wider">
            Password Requirements:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1">
            <CriterionItem satisfied={criteria.minLength} label="At least 8 characters" />
            <CriterionItem satisfied={criteria.hasUppercase} label="1 uppercase letter (Cap)" />
            <CriterionItem satisfied={criteria.hasLowercase} label="1 lowercase letter (small)" />
            <CriterionItem satisfied={criteria.hasNumber} label="1 number (0-9)" />
            <CriterionItem
              satisfied={criteria.hasSpecialChar}
              label="1 special character (!@#$...)"
              className="sm:col-span-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const CriterionItem: React.FC<{
  satisfied: boolean;
  label: string;
  className?: string;
}> = ({ satisfied, label, className = "" }) => (
  <div
    className={`flex items-center gap-1.5 transition-colors ${
      satisfied
        ? "text-emerald-600 dark:text-emerald-400 font-medium"
        : "text-slate-400 dark:text-slate-500"
    } ${className}`}
  >
    {satisfied ? (
      <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
    ) : (
      <div className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
    )}
    <span>{label}</span>
  </div>
);
