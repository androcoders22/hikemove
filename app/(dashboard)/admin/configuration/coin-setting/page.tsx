"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { CircleDollarSign, CreditCard, Save, X } from "lucide-react";
import { uploadImageAPI } from "@/lib/api/aws";
import { BASE_URL } from "@/lib/axios";
import { api } from "@/lib/axios";
import {
    getCoinPaymentSettingsAPI,
    updateCoinPaymentSettingsAPI,
} from "@/lib/api/configuration";

export default function CoinSettingPage() {
    const [formData, setFormData] = useState({
        coinName: "",
        coinSymbol: "",
        coinPrice: "",
        createdAt: "",
        updatedAt: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingQr, setIsUploadingQr] = useState(false);
    const [isPaymentSaving, setIsPaymentSaving] = useState(false);
    const [qrPreviewUrl, setQrPreviewUrl] = useState("");
    const [isResolvingQrUrl, setIsResolvingQrUrl] = useState(false);

    const [paymentData, setPaymentData] = useState({
        paymentQr: "",
        paymentAddress: "",
        createdAt: "",
        updatedAt: "",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const res = await getCoinPaymentSettingsAPI();
                const data = res.data?.data || {};

                setFormData({
                    coinName: data.coinSetting?.coinName || "",
                    coinSymbol: data.coinSetting?.coinSymbol || "",
                    coinPrice: data.coinSetting?.coinPrice || "",
                    createdAt: data.coinSetting?.createdAt || "",
                    updatedAt: data.coinSetting?.updatedAt || "",
                });

                setPaymentData({
                    paymentQr: data.paymentSetting?.paymentQr || "",
                    paymentAddress: String(data.paymentSetting?.paymentAddress ?? ""),
                    createdAt: data.paymentSetting?.createdAt || "",
                    updatedAt: data.paymentSetting?.updatedAt || "",
                });
            } catch (error: any) {
                if (error.response?.status !== 404) {
                    toast.error(error.response?.data?.message || "Failed to load settings");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    useEffect(() => {
        const resolveQrUrl = async () => {
            const value = paymentData.paymentQr;
            if (!value || !value.trim()) {
                setQrPreviewUrl("");
                return;
            }

            if (value.startsWith("http://") || value.startsWith("https://")) {
                setQrPreviewUrl(value);
                return;
            }

            setIsResolvingQrUrl(true);
            try {
                const res = await api.get(`/aws/${encodeURIComponent(value)}`);
                if (res.data?.status && res.data?.data) {
                    setQrPreviewUrl(res.data.data);
                } else {
                    setQrPreviewUrl(`${BASE_URL}/aws/${encodeURIComponent(value)}`);
                }
            } catch {
                setQrPreviewUrl(`${BASE_URL}/aws/${encodeURIComponent(value)}`);
            } finally {
                setIsResolvingQrUrl(false);
            }
        };

        resolveQrUrl();
    }, [paymentData.paymentQr]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handlePaymentSubmit = async () => {
        if (!ensurePaymentFields()) {
            return;
        }

        setIsPaymentSaving(true);
        try {
            await updateCoinPaymentSettingsAPI({
                coinSetting: {
                    coinName: formData.coinName,
                    coinSymbol: formData.coinSymbol,
                    coinPrice: formData.coinPrice,
                },
                paymentSetting: {
                    paymentQr: paymentData.paymentQr,
                    paymentAddress: paymentData.paymentAddress,
                },
            });
            toast.success("Payment settings updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update payment settings");
        } finally {
            setIsPaymentSaving(false);
        }
    };

    const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setPaymentData((prev) => ({ ...prev, [id]: value }));
    };

    const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingQr(true);
        try {
            const uploadRes = await uploadImageAPI(file);
            if (uploadRes?.status && uploadRes?.data) {
                setPaymentData((prev) => ({ ...prev, paymentQr: uploadRes.data }));
                toast.success("QR uploaded successfully");
            } else {
                toast.error("Failed to upload QR");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to upload QR");
        } finally {
            setIsUploadingQr(false);
            e.target.value = "";
        }
    };

    const formatDateTime = (value: string) => {
        if (!value) return "N/A";
        return new Date(value).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!ensurePaymentFields()) {
            return;
        }

        setIsLoading(true);

        try {
            await updateCoinPaymentSettingsAPI({
                coinSetting: {
                    coinName: formData.coinName,
                    coinSymbol: formData.coinSymbol,
                    coinPrice: formData.coinPrice,
                },
                paymentSetting: {
                    paymentQr: paymentData.paymentQr,
                    paymentAddress: paymentData.paymentAddress,
                },
            });
            toast.success("Settings updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update settings");
        } finally {
            setIsLoading(false);
        }
    };

    const ensurePaymentFields = () => {
        if (!paymentData.paymentQr?.trim()) {
            toast.error("Please upload a payment QR before saving.");
            return false;
        }

        if (!paymentData.paymentAddress?.toString().trim()) {
            toast.error("Enter a payment address before saving.");
            return false;
        }

        return true;
    };

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
            <PageHeader
                title="App Setting"
                breadcrumbs={[
                    { title: "Configuration", href: "#" },
                    { title: "App Setting" },
                ]}
            />

            <div className="flex-1 min-w-0 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <div className="w-full max-w-[980px] min-w-0 space-y-4">
                <Card className="w-full min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                                <CircleDollarSign className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                                <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                    Coin Setting
                                </CardTitle>
                                <p className="mt-0.5 text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                    Manage coin details and current values.
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-3 sm:p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="rounded-md border border-[#dce8d3] bg-[#fafcf8] p-3">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="coinName"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Coin Name
                                        </Label>
                                        <Input
                                            id="coinName"
                                            placeholder="Enter Coin Name"
                                            value={formData.coinName}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] font-medium shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="coinSymbol"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Coin Symbol
                                        </Label>
                                        <Input
                                            id="coinSymbol"
                                            placeholder="Enter Coin Symbol"
                                            value={formData.coinSymbol}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] font-medium shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="coinPrice"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Coin Price
                                        </Label>
                                        <Input
                                            id="coinPrice"
                                            placeholder="Enter Coin Price"
                                            value={formData.coinPrice}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] font-mono font-medium shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]">
                                            Updated At
                                        </Label>
                                        <div className="flex h-8 w-full min-w-0 items-center rounded-md border border-[#dce8d3] bg-[#f3f7ef] px-3 text-[13px] font-mono text-[#6f7664] shadow-sm">
                                            <span className="truncate">{formatDateTime(formData.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-2 border-t border-[#edf3e7] pt-3 sm:flex-row sm:items-center sm:justify-end">


                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-8 w-full rounded-md bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.04em] text-white shadow-sm hover:bg-primary/90 sm:w-auto"
                                >
                                    <Save className="mr-1.5 h-3.5 w-3.5" />
                                    {isLoading ? "Saving..." : "Submit"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="w-full min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                                <CreditCard className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                                <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                    Payment Setting
                                </CardTitle>
                                <p className="mt-0.5 text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                    Manage payment QR and wallet address values.
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-3 sm:p-4">
                        <div className="rounded-md border border-[#dce8d3] bg-[#fafcf8] p-3">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="min-w-0 space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]">
                                        Payment QR Upload
                                    </Label>

                                    <div className="flex flex-col gap-1 pt-1">
                                        <Input
                                            id="paymentQrUpload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleQrUpload}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-2 text-[12px] shadow-sm"
                                        />
                                        <p className="text-[11px] font-medium text-[#7a8270]">
                                            {isUploadingQr ? "Uploading QR..." : "Select an image file to upload QR to AWS."}
                                        </p>
                                    </div>

                                        {paymentData.paymentQr ? (
                                            <div className="mt-2 rounded-md border border-[#dce8d3] bg-white p-2">
                                                {isResolvingQrUrl ? (
                                                    <p className="text-[11px] font-medium text-[#7a8270]">Loading QR preview...</p>
                                                ) : qrPreviewUrl ? (
                                                    <img
                                                        src={qrPreviewUrl}
                                                        alt="Payment QR"
                                                        className="h-36 w-36 rounded object-contain"
                                                    />
                                                ) : (
                                                    <p className="text-[11px] font-medium text-[#7a8270]">Preview unavailable</p>
                                                )}
                                            </div>
                                        ) : null}
                                </div>

                                <div className="min-w-0 space-y-1.5">
                                    <Label
                                        htmlFor="paymentAddress"
                                        className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                    >
                                        Payment Address
                                    </Label>
                                    <Input
                                        id="paymentAddress"
                                        placeholder="Enter Payment Address"
                                        value={paymentData.paymentAddress}
                                        onChange={handlePaymentInputChange}
                                        className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] font-medium shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>



                                <div className="min-w-0 space-y-1.5">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]">
                                        Updated At
                                    </Label>
                                    <div className="flex h-8 w-full min-w-0 items-center rounded-md border border-[#dce8d3] bg-[#f3f7ef] px-3 text-[13px] font-mono text-[#6f7664] shadow-sm">
                                        <span className="truncate">{formatDateTime(paymentData.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-[#edf3e7] pt-3 mt-4">
                            <Button
                                type="button"
                                onClick={handlePaymentSubmit}
                                disabled={isPaymentSaving || isUploadingQr}
                                className="h-8 rounded-md bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.04em] text-white shadow-sm hover:bg-primary/90"
                            >
                                <Save className="mr-1.5 h-3.5 w-3.5" />
                                {isPaymentSaving ? "Saving..." : "Submit"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                </div>
            </div>
        </div>
    );
}