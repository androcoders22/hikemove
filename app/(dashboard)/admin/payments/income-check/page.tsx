"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Search,
  Calendar as CalendarIcon,
  WalletCards,
  ArrowRight,
} from "lucide-react";
import { Label } from "@/components/ui/label";

export default function IncomeCheckPage() {
  const [memberId, setMemberId] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberId) {
      toast.error("Please enter a Member ID");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Income data retrieved successfully");
    } catch (error) {
      toast.error("Failed to fetch income data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
      <PageHeader
        title="Income Check"
        breadcrumbs={[
          { title: "Payments", href: "#" },
          { title: "Income Check" },
        ]}
      />

      <div className="flex-1 min-w-0 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
        <Card className="min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
          <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                <WalletCards className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                  Income Check
                </CardTitle>
                <p className="mt-0.5 text-[11px] font-medium text-[#7a8270] sm:text-xs">
                  Search income details by member ID and date.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-4">
            <form
              onSubmit={handleSubmit}
              className="rounded-md border border-[#dce8d3] bg-[#fafcf8] p-3"
            >
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_180px_auto] xl:items-end">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="min-w-0 space-y-1.5">
                    <Label
                      htmlFor="memberId"
                      className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#5f6851]"
                    >
                      Member Id
                    </Label>

                    <div className="relative min-w-0">
                      <Input
                        id="memberId"
                        placeholder="Enter Member ID"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-8 pr-3 text-[13px] shadow-sm focus:border-primary/40 focus:ring-1 focus:ring-primary/10"
                      />
                      <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#8a927e]" />
                    </div>
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <Label
                      htmlFor="date"
                      className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#5f6851]"
                    >
                      Date
                    </Label>

                    <div className="relative min-w-0">
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-8 pr-3 text-[13px] shadow-sm focus:border-primary/40 focus:ring-1 focus:ring-primary/10"
                      />
                      <CalendarIcon className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#8a927e]" />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-8 w-full rounded-md bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-white hover:bg-primary/90 sm:w-auto xl:justify-self-end"
                >
                  {isLoading ? (
                    "Checking..."
                  ) : (
                    <>
                      Submit
                      <ArrowRight className="ml-1.5 h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}