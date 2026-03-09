"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { checkMemberIdAPI } from "@/lib/api/member-topup";
import { memberSignup } from "@/lib/api/member";

export default function ManualRegistrationPage() {
    const [formData, setFormData] = useState({
        referralId: "",
        referralName: "",
        memberId: "",
        fullName: "",
        phone: "",
        email: "",
        country: "United States",
        password: "",
        transactionPassword: "",
        package: "",
        joiningDate: "",
        activationDate: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingReferral, setIsCheckingReferral] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (id: string, value: string) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    useEffect(() => {
        if (formData.referralId && formData.referralId.length >= 4) {
            const timer = setTimeout(async () => {
                setIsCheckingReferral(true);
                try {
                    const res = await checkMemberIdAPI(formData.referralId);
                    if (res.data?.status && res.data?.data) {
                        setFormData((prev) => ({
                            ...prev,
                            referralName: res.data.data.fullName || "User Found",
                        }));
                    } else {
                        setFormData((prev) => ({
                            ...prev,
                            referralName: "Invalid Referral ID",
                        }));
                    }
                } catch (error) {
                    setFormData((prev) => ({
                        ...prev,
                        referralName: "Not Found",
                    }));
                } finally {
                    setIsCheckingReferral(false);
                }
            }, 800);

            return () => clearTimeout(timer);
        } else {
            setFormData((prev) => ({ ...prev, referralName: "" }));
        }
    }, [formData.referralId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const requiredFields = [
            "referralId",
            "memberId",
            "fullName",
            "phone",
            "password",
            "transactionPassword",
            "package",
            "joiningDate",
            "activationDate",
        ];

        for (const field of requiredFields) {
            if (!formData[field as keyof typeof formData]) {
                toast.error(
                    `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
                );
                return;
            }
        }

        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                sponsorId: formData.referralId,
            };

            const res = await memberSignup(payload);

            if (res.status) {
                toast.success("Member registered successfully!");
            } else {
                toast.error(res.message || "Registration failed");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Manual Registration"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "Manual Registration" },
                ]}
            />

            <div className="flex-1 min-w-0 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <Card className="mx-auto w-full max-w-5xl min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="min-w-0">
                            <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                Manual Registration
                            </CardTitle>
                            <p className="mt-0.5 text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                Create a new member account with referral and package details.
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="p-3 sm:p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="rounded-md border border-[#dce8d3] bg-[#fafcf8] p-3">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="referralId"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Referral Id<span className="ml-0.5 text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="referralId"
                                            placeholder="Enter Referral Id"
                                            value={formData.referralId}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="referralName"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Referral Name
                                        </Label>
                                        <Input
                                            id="referralName"
                                            placeholder="Referral Name"
                                            value={isCheckingReferral ? "Searching..." : formData.referralName}
                                            readOnly
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-[#f8fafc] px-3 text-[13px] text-slate-500 shadow-sm placeholder:text-slate-300"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="memberId"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Member Id<span className="ml-0.5 text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="memberId"
                                            placeholder="Enter member id"
                                            value={formData.memberId}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="fullName"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Full Name<span className="ml-0.5 text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="fullName"
                                            placeholder="Enter full name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="phone"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Mobile Number<span className="ml-0.5 text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            placeholder="Enter mobile number"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="email"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="country"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Country
                                        </Label>
                                        <Select
                                            value={formData.country}
                                            onValueChange={(v) => handleSelectChange("country", v)}
                                        >
                                            <SelectTrigger className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white text-[11px] shadow-sm focus:ring-2 focus:ring-primary/10">
                                                <SelectValue placeholder="Select Country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="United States">United States</SelectItem>
                                                <SelectItem value="India">India</SelectItem>
                                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                                <SelectItem value="Canada">Canada</SelectItem>
                                                <SelectItem value="Australia">Australia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="package"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Select Package<span className="ml-0.5 text-rose-500">*</span>
                                        </Label>
                                        <Select
                                            value={formData.package}
                                            onValueChange={(v) => handleSelectChange("package", v)}
                                        >
                                            <SelectTrigger className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white text-[11px] shadow-sm focus:ring-2 focus:ring-primary/10">
                                                <SelectValue placeholder="Select Package" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Basic">Basic</SelectItem>
                                                <SelectItem value="Bronze">Bronze</SelectItem>
                                                <SelectItem value="Silver">Silver</SelectItem>
                                                <SelectItem value="Gold">Gold</SelectItem>
                                                <SelectItem value="Diamond">Diamond</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="password"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Login Password<span className="ml-0.5 text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter login password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="transactionPassword"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Transaction Password<span className="ml-0.5 text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="transactionPassword"
                                            type="password"
                                            placeholder="Enter transaction password"
                                            value={formData.transactionPassword}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="joiningDate"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Joining Date<span className="ml-0.5 text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="joiningDate"
                                            type="date"
                                            value={formData.joiningDate}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] text-slate-600 shadow-sm transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="activationDate"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Activation Date<span className="ml-0.5 text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="activationDate"
                                            type="date"
                                            value={formData.activationDate}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] text-slate-600 shadow-sm transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end border-t border-[#edf3e7] pt-3">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-8 rounded-md bg-primary px-4 text-[10px] font-bold uppercase tracking-[0.05em] text-white shadow-sm transition-all hover:bg-primary/90"
                                >
                                    {isLoading ? "Please wait..." : "Registration"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}