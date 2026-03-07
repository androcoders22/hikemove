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
                    `Please fill in ${field
                        .replace(/([A-Z])/g, " $1")
                        .toLowerCase()}`
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
        <div className="flex-1 w-full bg-background/30">
            <PageHeader
                title="Manual Registration"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "Manual Registration" },
                ]}
            />

            <div className="flex p-6 md:p-10 ">
                <Card className="max-w-4xl mx-auto border-none shadow-sm rounded-xl overflow-hidden bg-white pt-0">
                    <CardHeader className="border-b bg-gray-50/10 px-8 py-6 ">
                        <CardTitle className="text-xl font-black text-foreground">
                            Manual Registration
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-x-12 gap-y-2">
                                <Label htmlFor="referralId" className="text-sm font-bold text-foreground/80">
                                    Referral Id<span className="text-rose-500 ml-0.5">*</span>
                                </Label>
                                <Input
                                    id="referralId"
                                    placeholder="Enter Referral Id"
                                    value={formData.referralId}
                                    onChange={handleInputChange}
                                    className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 transition-all rounded-md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-x-12 gap-y-2">
                                <Label htmlFor="referralName" className="text-sm font-bold text-foreground/80">
                                    Referral Name
                                </Label>
                                <Input
                                    id="referralName"
                                    placeholder="Enter Referral Name"
                                    value={isCheckingReferral ? "Searching..." : formData.referralName}
                                    readOnly
                                    className="h-11 bg-slate-50 border-border text-slate-400 font-medium rounded-md placeholder:text-slate-300"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-x-12 gap-y-2">
                                <Label htmlFor="memberId" className="text-sm font-bold text-foreground/80">
                                    Member id<span className="text-rose-500 ml-0.5">*</span>
                                </Label>
                                <Input
                                    id="memberId"
                                    placeholder="Enter your memberid"
                                    value={formData.memberId}
                                    onChange={handleInputChange}
                                    className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 transition-all rounded-md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-x-12 gap-y-2">
                                <Label htmlFor="fullName" className="text-sm font-bold text-foreground/80">
                                    Full Name<span className="text-rose-500 ml-0.5">*</span>
                                </Label>
                                <Input
                                    id="fullName"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 transition-all rounded-md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-x-12 gap-y-2">
                                <Label htmlFor="phone" className="text-sm font-bold text-foreground/80">
                                    Mobile Number<span className="text-rose-500 ml-0.5">*</span>
                                </Label>
                                <Input
                                    id="phone"
                                    placeholder="Enter your mobile number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 transition-all rounded-md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-x-12 gap-y-2">
                                <Label htmlFor="email" className="text-sm font-bold text-foreground/80">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email id"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 transition-all rounded-md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-x-12 gap-y-2">
                                <Label htmlFor="country" className="text-sm font-bold text-foreground/80">
                                    Country
                                </Label>
                                <Select value={formData.country} onValueChange={(v) => handleSelectChange("country", v)}>
                                    <SelectTrigger className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 rounded-md">
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

                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-x-12 gap-y-2">
                                <Label htmlFor="password" className="text-sm font-bold text-foreground/80">
                                    Login Password<span className="text-rose-500 ml-0.5">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    placeholder="Enter Login Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 transition-all rounded-md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-x-12 gap-y-2">
                                <Label htmlFor="transactionPassword" className="text-sm font-bold text-foreground/80">
                                    Transaction Password<span className="text-rose-500 ml-0.5">*</span>
                                </Label>
                                <Input
                                    id="transactionPassword"
                                    placeholder="Enter Txn Password"
                                    value={formData.transactionPassword}
                                    onChange={handleInputChange}
                                    className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 transition-all rounded-md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-x-12 gap-y-2">
                                <Label htmlFor="package" className="text-sm font-bold text-foreground/80">
                                    Select Package<span className="text-rose-500 ml-0.5">*</span>
                                </Label>
                                <Select value={formData.package} onValueChange={(v) => handleSelectChange("package", v)}>
                                    <SelectTrigger className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 rounded-md">
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

                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-x-12 gap-y-2">
                                <Label htmlFor="joiningDate" className="text-sm font-bold text-foreground/80">
                                    Joining Date<span className="text-rose-500 ml-0.5">*</span>
                                </Label>
                                <Input
                                    id="joiningDate"
                                    type="date"
                                    value={formData.joiningDate}
                                    onChange={handleInputChange}
                                    className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 transition-all rounded-md cursor-pointer text-slate-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-x-12 gap-y-2">
                                <Label htmlFor="activationDate" className="text-sm font-bold text-foreground/80">
                                    Activation Date<span className="text-rose-500 ml-0.5">*</span>
                                </Label>
                                <Input
                                    id="activationDate"
                                    type="date"
                                    value={formData.activationDate}
                                    onChange={handleInputChange}
                                    className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 transition-all rounded-md cursor-pointer text-slate-600"
                                />
                            </div>

                            <div className="flex justify-end pt-8 border-t border-slate-100">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-11 px-10 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs rounded-lg shadow-sm transition-all focus:ring-4 focus:ring-primary/20"
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