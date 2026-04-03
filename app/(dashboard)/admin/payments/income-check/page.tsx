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
import { api } from "@/lib/axios";

export default function IncomeCheckPage() {
  const [memberId, setMemberId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState<any | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const formatCurrency = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "N/A";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return `$${num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const walletDetails = walletData?.data ?? walletData;
  const resolvedMember: any | undefined = walletDetails
    ? walletDetails.member ??
      walletDetails.memberDetails ??
      walletDetails.memberInfo ??
      walletDetails.user ??
      undefined
    : undefined;

  const memberIdFromPayload =
    walletDetails?.memberId ||
    (typeof resolvedMember === "string"
      ? resolvedMember
      : resolvedMember?.memberId ||
        resolvedMember?.member_id ||
        resolvedMember?.member?.memberId) ||
    memberId;

  const packageSource = walletDetails?.package ??
    (resolvedMember && typeof resolvedMember === "object"
      ? resolvedMember.package ??
        resolvedMember.packageName ??
        resolvedMember.packageDetails ??
        resolvedMember.package_info
      : null);

  const packageName =
    typeof packageSource === "string"
      ? packageSource
      : packageSource?.name ??
        packageSource?.title ??
        packageSource?.packageName ??
        packageSource?.package ??
        null;

  const summaryItems = walletDetails
    ? [
        { label: "Credit Wallet", value: walletDetails?.depositBalance },
        { label: "Income Wallet", value: walletDetails?.incomeBalance },
        { label: "Total Balance", value: walletDetails?.totalBalance ?? walletDetails?.depositBalance },
        { label: "Member Id", value: memberIdFromPayload },
        { label: "Package", value: packageName },
        { label: "Updated", value: walletDetails?.updatedAt },
      ].filter((item) => item.value !== undefined && item.value !== null && item.value !== "")
    : [];

  const fetchWalletData = async (value: string, showToast: boolean) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setWalletData(null);
      setApiError(null);
      return;
    }

    setIsLoading(true);

    setApiError(null);

    try {
      const { data } = await api.get(`/wallet/${encodeURIComponent(trimmed)}`);
      setWalletData(data);
      if (showToast) {
        toast.success("Income data retrieved successfully");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : "Failed to fetch income data");
      setApiError(message);
      if (showToast) {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberId) {
      toast.error("Please enter a Member ID");
      return;
    }

    await fetchWalletData(memberId, true);
  };

  const resolvedUpdatedAt = walletDetails?.updatedAt
    ? new Date(walletDetails.updatedAt).toLocaleString("en-GB")
    : null;

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
                  Enter a member ID and click search to load wallet details.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-4">
            <form
              onSubmit={handleSubmit}
              className="rounded-md border border-[#dce8d3] bg-[#fafcf8] p-3"
            >
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
                <div className="grid grid-cols-1 gap-3">
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
                        onChange={(e) => setMemberId(e.target.value.toUpperCase())}
                        className="h-9 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-8 pr-3 text-[13px] shadow-sm focus:border-primary/40 focus:ring-1 focus:ring-primary/10"
                      />
                      <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#8a927e]" />
                    </div>
                  </div>

                  {/* <div className="min-w-0 space-y-1.5">
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
                  </div> */}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-9 w-2xs rounded-md bg-primary px-4 text-[10px] font-bold uppercase tracking-[0.05em] text-white hover:bg-primary/90 sm:w-auto xl:justify-self-end"
                >
                  {isLoading ? (
                    "Checking..."
                  ) : (
                    <>
                      Search
                      <ArrowRight className="ml-1.5 h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {apiError && (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
                {apiError}
              </div>
            )}

            {walletDetails && (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[#dce8d3] bg-white px-3 py-2 text-[11px] font-semibold text-[#5f6851]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.05em] text-primary">
                    Active
                  </span>
                  <span>Member:</span>
                  <span className="font-black text-[#374151]">{memberIdFromPayload}</span>
                  {packageName ? (
                    <span className="text-[#8a927e]">Package {packageName}</span>
                  ) : null}
                  {resolvedUpdatedAt ? (
                    <span className="ml-auto text-[#8a927e]">Updated {resolvedUpdatedAt}</span>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {summaryItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-[#dce8d3] bg-white p-3 shadow-sm"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#7a8270]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-base font-black text-[#374151]">
                        {typeof item.value === "number"
                          ? formatCurrency(item.value)
                          : typeof item.value === "string"
                            ? item.value
                            : formatCurrency(item.value)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* <div className="rounded-lg border border-[#dce8d3] bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#7a8270] mb-2">
                    Raw Response
                  </p>
                  <pre className="max-h-80 overflow-auto rounded-md bg-[#f6f8f4] p-3 text-xs text-[#374151]">
                    {JSON.stringify(walletData, null, 2)}
                  </pre>
                </div> */}
              </div>
            )}

            {!walletDetails && !apiError && memberId.trim().length > 0 && !isLoading && (
              <div className="mt-4 rounded-lg border border-[#dce8d3] bg-white p-4 text-sm font-semibold text-[#7a8270]">
                No income data yet. Click search to see results.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}