"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Wallet,
  ShieldCheck,
  AlertCircle,
  ArrowDownCircle,
  Coins,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function WithdrawalRequest() {
  const [formData, setFormData] = useState({
    walletAddress: "",
    amount: "",
    password: "",
  });

  const memberInfo = {
    id: "HM3347546",
    balance: "1224.75 $",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.walletAddress || !formData.amount || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Withdrawal request submitted successfully!");
    setFormData({ walletAddress: "", amount: "", password: "" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Withdrawal Request"
        breadcrumbs={[
          { title: "Withdrawal Wallet", href: "#" },
          { title: "Request" },
        ]}
      />

      <div className="flex-1 p-6 flex items-start justify-center">
        <div className="w-full max-w-xl space-y-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-primary/5">
            <div className="p-6 bg-muted/30 border-b border-border flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-lg font-black uppercase tracking-tight text-foreground">
                  Submit Request
                </h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">
                  Withdraw your earnings to USDT (BEP 20)
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Read-only Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3 rounded-xl bg-muted/20 border border-border/50">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Your Member Id
                  </Label>
                  <p className="text-sm font-black text-foreground">
                    {memberInfo.id}
                  </p>
                </div>
                <div className="space-y-1.5 p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">
                    Wallet Balance
                  </Label>
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    <p className="text-sm font-black text-foreground">
                      {memberInfo.balance}
                    </p>
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="walletAddress"
                    className="text-[10px] font-black uppercase tracking-widest"
                  >
                    Wallet Address USDT (BEP 20)
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="walletAddress"
                      placeholder="Enter BEP-20 address"
                      className="pl-10 h-12 font-mono text-xs border-border focus:ring-primary/20"
                      value={formData.walletAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          walletAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="amount"
                    className="text-[10px] font-black uppercase tracking-widest"
                  >
                    Withdrawal Amount
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <ArrowDownCircle className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-10 h-12 font-bold border-border focus:ring-primary/20"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    *No Admin Charges will be applicable
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-[10px] font-black uppercase tracking-widest"
                  >
                    Transaction Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 border-border focus:ring-primary/20"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 font-black uppercase tracking-widest shadow-lg shadow-primary/20 text-sm"
              >
                Submit Withdrawal
              </Button>
            </form>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[11px] font-black uppercase text-amber-700">
                Important Note
              </h4>
              <p className="text-[10px] font-medium text-amber-600/80 leading-relaxed">
                Please ensure the wallet address is correct. Transfers to
                incorrect addresses cannot be reversed. Withdrawals are
                typically processed within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
