"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { UserCog, Search, Save } from "lucide-react";
import { checkMemberIdAPI } from "@/lib/api/member";
import { getMemberStatus } from "@/lib/utils/member-status";

const toTitleCase = (key: string) => {
    return key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const hiddenFields = new Set([
    "path",
    "id",
    "_id",
    "expirationdate",
    "expiration_date",
    "updatedat",
    "updated_at",
    "__v",
    "v",
]);

const shouldRenderField = (key: string) => {
    const normalizedKey = key.toLowerCase();
    return !hiddenFields.has(normalizedKey);
};

const getDisplayValue = (key: string, value: unknown, fullData: Record<string, unknown>) => {
    const normalizedKey = key.toLowerCase();

    // Prefer member-facing sponsor id over internal DB ids.
    if (normalizedKey === "sponsorid" || normalizedKey === "sponsor") {
        const sponsorObject = fullData.sponsor as { memberId?: string } | undefined;
        const sponsorMemberId =
            (typeof fullData.sponsorMemberId === "string" && fullData.sponsorMemberId) ||
            sponsorObject?.memberId ||
            (typeof value === "object" && value !== null && "memberId" in (value as Record<string, unknown>)
                ? String((value as Record<string, unknown>).memberId || "")
                : "");

        return sponsorMemberId || "N/A";
    }

    if (normalizedKey === "status") {
        return getMemberStatus(fullData as any);
    }

    return formatValue(value);
};

const getDisplayLabel = (key: string) => {
    const normalizedKey = key.toLowerCase();
    if (normalizedKey === "sponsorid" || normalizedKey === "sponsor") {
        return "Sponsor Member ID";
    }
    return toTitleCase(key);
};

const formatValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") return "N/A";

    if (typeof value === "object") {
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    }

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    return String(value);
};

export default function ChangeProfilePage() {
    const [memberId, setMemberId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [memberData, setMemberData] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!memberId) {
            toast.error("Please enter a Member ID");
            return;
        }

        setIsLoading(true);
        setMemberData(null);

        try {
            const res = await checkMemberIdAPI(memberId);
            if (res.data?.status && res.data.data) {
                setMemberData(res.data.data);
                toast.success("Member profile retrieved");
            } else {
                toast.error(res.data?.message || "Member not found");
            }
        } catch (error: any) {
            console.error("Check member error:", error);
            // Error toast usually handled by interceptor
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Member Profile Details"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "Member Profile Details" },
                ]}
            />

            <div className="flex-1 min-w-0 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <Card className="min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                                <UserCog className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                                <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                    Member Profile Details
                                </CardTitle>
                                <p className="mt-0.5 text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                    Search a member profile by ID.
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-3 sm:p-4">
                        <form onSubmit={handleSubmit} className="max-w-4xl space-y-4">
                            <div className="rounded-md border border-[#dce8d3] bg-[#fafcf8] p-3">
                                <div className="grid grid-cols-1 gap-3 xl:grid-cols-[160px_minmax(0,1fr)_auto] xl:items-center">
                                    <Label
                                        htmlFor="memberId"
                                        className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#5f6851] whitespace-nowrap"
                                    >
                                        Your Member Id
                                    </Label>

                                    <div className="relative group min-w-0">
                                        <Input
                                            id="memberId"
                                            placeholder="Enter Member ID"
                                            value={memberId}
                                            onChange={(e) => setMemberId(e.target.value)}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-9 pr-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e] transition-colors group-focus-within:text-primary" />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-8 w-full rounded-md bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-white shadow-sm transition-all hover:bg-primary/90 sm:w-auto"
                                    >
                                        <Save className="mr-1.5 h-3.5 w-3.5" />
                                        {isLoading ? "Wait..." : "Submit"}
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {memberData && (
                            <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="max-w-5xl space-y-4">
                                    <div className="rounded-md border border-[#dce8d3] bg-[#fafcf8] p-3">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {Object.entries(memberData)
                                                .filter(([key]) => shouldRenderField(key))
                                                .map(([key, value]) => (
                                                <div key={key} className="space-y-1.5">
                                                    <Label className="text-[11px] font-bold uppercase tracking-wider text-[#5f6851]">
                                                        {getDisplayLabel(key)}
                                                    </Label>

                                                    {typeof getDisplayValue(key, value, memberData as Record<string, unknown>) === "string" && typeof value !== "object" ? (
                                                        <div className="flex min-h-9 w-full items-center rounded-md border border-[#dce8d3] bg-white px-3 text-[13px] text-[#4d553d] shadow-sm break-all">
                                                            {getDisplayValue(key, value, memberData as Record<string, unknown>)}
                                                        </div>
                                                    ) : typeof value === "object" && value !== null ? (
                                                        <pre className="max-h-36 overflow-auto rounded-md border border-[#dce8d3] bg-white p-2 text-[12px] text-[#5f6851] shadow-sm whitespace-pre-wrap wrap-break-word">
                                                            {typeof getDisplayValue(key, value, memberData as Record<string, unknown>) === "string"
                                                                ? getDisplayValue(key, value, memberData as Record<string, unknown>)
                                                                : formatValue(value)}
                                                        </pre>
                                                    ) : (
                                                        <div className="flex min-h-9 w-full items-center rounded-md border border-[#dce8d3] bg-white px-3 text-[13px] text-[#4d553d] shadow-sm break-all">
                                                            {getDisplayValue(key, value, memberData as Record<string, unknown>)}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}