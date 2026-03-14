"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Upload,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getFundRequestsMeAPI,
  createFundRequestAPI,
} from "@/lib/api/fund-request";
import { api, BASE_URL } from "@/lib/axios";
import { uploadImageAPI } from "@/lib/api/aws";
import { getCoinPaymentSettingsAPI } from "@/lib/api/configuration";

const fundRequestSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  transactionHash: z.string().min(1, "Transaction hash is required"),
  screenshot: z.any().optional(),
});

type FundRequestFormValues = z.infer<typeof fundRequestSchema>;

interface DepositRow {
  _id: string;
  createdAt: string;
  remark?: string;
  activity?: string;
  transactionHash: string;
  amount: number;
  screenshot?: string;
  status: string;
}

export default function DepositActivity() {
  const [deposits, setDeposits] = useState<DepositRow[]>([]);
  const [paymentAddress, setPaymentAddress] = useState("");
  const [paymentQrUrl, setPaymentQrUrl] = useState<string | null>(null);
  const [isPaymentInfoLoading, setIsPaymentInfoLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddFundOpen, setIsAddFundOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FundRequestFormValues>({
    resolver: zodResolver(fundRequestSchema),
    defaultValues: {
      amount: "",
      transactionHash: "",
      screenshot: null,
    },
  });

  const watchScreenshot = watch("screenshot");

  const fetchDeposits = async () => {
    try {
      setIsLoading(true);
      const response = await getFundRequestsMeAPI();

      if (response.data.status && response.data.data) {
        setDeposits(response.data.data);
      } else if (response.data) {
        setDeposits(response.data);
      }
    } catch (error) {
      toast.error("Failed to load deposit history");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resolveAwsImageUrl = async (value?: string | null) => {
    if (!value || !value.trim()) return null;
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    try {
      const res = await api.get(`/aws/${encodeURIComponent(value)}`);
      if (res.data?.status && res.data?.data) {
        return res.data.data;
      }
    } catch {
      // fallback to direct URL format when presigned resolution is unavailable
    }

    return `${BASE_URL}/aws/${encodeURIComponent(value)}`;
  };

  const fetchAppSetting = async () => {
    try {
      setIsPaymentInfoLoading(true);
      const response = await getCoinPaymentSettingsAPI();
      const paymentSetting = response.data?.data?.paymentSetting;

      setPaymentAddress(String(paymentSetting?.paymentAddress ?? ""));
      const resolvedQr = await resolveAwsImageUrl(paymentSetting?.paymentQr || "");
      setPaymentQrUrl(resolvedQr);
    } catch (error) {
      console.error("Failed to load app settings:", error);
      setPaymentAddress("");
      setPaymentQrUrl(null);
    } finally {
      setIsPaymentInfoLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
    fetchAppSetting();
  }, []);

  const buildScreenshotUrl = (value?: string | null) => {
    if (!value || !value.trim()) return null;
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    // Encode the entire key as one segment to correctly handle slashes/folders in the router
    return `${BASE_URL}/aws/${encodeURIComponent(value)}`;
  };

  const onSubmit = async (data: FundRequestFormValues) => {
    try {
      setIsSubmitting(true);

      let screenshotKey = "";
      if (data.screenshot) {
        const uploadRes = await uploadImageAPI(data.screenshot);
        if (uploadRes.status && uploadRes.data) {
          screenshotKey = uploadRes.data;
        } else {
          toast.error("Image upload failed, submitting without image");
        }
      }

      const payload = {
        amount: Number(data.amount),
        transactionHash: data.transactionHash,
        screenshot: screenshotKey,
        status: "pending",
      };

      await createFundRequestAPI(payload);

      toast.success("Fund request submitted for verification!");
      setIsAddFundOpen(false);
      reset();
      fetchDeposits();
    } catch (error) {
      toast.error("Failed to submit fund request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Deposit Activity"
        breadcrumbs={[
          { title: "App", href: "#" },
          { title: "Deposit Activity" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
              Transaction History
            </h2>
            <p className="text-xs text-muted-foreground">
              Manage your fund requests and deposit history
            </p>
          </div>

          <Dialog open={isAddFundOpen} onOpenChange={setIsAddFundOpen}>
            <DialogTrigger asChild>
              <Button className="font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" />
                ADD FUND
              </Button>
            </DialogTrigger>

            <DialogContent className="!max-w-[1100px] w-full p-0 overflow-hidden rounded-2xl border border-[#dcf0c5] bg-[#fdfefc] shadow-xl">
              <div className="relative border-b border-[#dcf0c5] bg-[#f4faef] px-6 py-4">
                <DialogHeader className="space-y-1 pr-12">
                  <DialogTitle className="text-lg font-black uppercase tracking-tight text-[#42523d]">
                    ADD FUND
                  </DialogTitle>
                  <DialogDescription className="text-[10px] font-bold text-[#8ba27d] uppercase tracking-wider opacity-100">
                    Transfer USDT (BEP 20) to the address below
                  </DialogDescription>
                </DialogHeader>

                <button
                  type="button"
                  onClick={() => setIsAddFundOpen(false)}
                  className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dcf0c5] bg-white text-[#56684f] transition hover:bg-[#eef8e7]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* LEFT QR SECTION */}
                    <div className="w-full lg:w-[420px] lg:flex-shrink-0 border border-[#dcf0c5] rounded-xl p-8 flex flex-col items-center justify-center bg-white min-h-[360px]">
                      {isPaymentInfoLoading ? (
                        <div className="flex flex-col items-center justify-center gap-3 min-h-[224px]">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <p className="text-[10px] font-black text-[#56684f] uppercase tracking-widest">
                            Loading payment info...
                          </p>
                        </div>
                      ) : paymentQrUrl ? (
                        <img
                          src={paymentQrUrl}
                          alt="QR Code"
                          className="w-56 h-56 object-contain"
                        />
                      ) : (
                        <div className="w-56 h-56 border border-dashed border-[#dcf0c5] rounded-lg flex items-center justify-center text-[#8ba27d] text-xs font-bold uppercase tracking-widest text-center px-4">
                          QR Not Available
                        </div>
                      )}

                      <p className="mt-5 text-sm font-medium text-black text-center break-all max-w-[320px]">
                        {paymentAddress || "Payment address not available"}
                      </p>
                    </div>

                    {/* RIGHT FORM SECTION */}
                    <div className="flex-1 space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="amount"
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            errors.amount ? "text-red-500" : "text-[#56684f]"
                          }`}
                        >
                          Enter Amount
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          {...register("amount")}
                          className={`h-12 bg-white border-[#dcf0c5] text-[#42523d] font-semibold focus-visible:ring-[#62b01a]/30 ${
                            errors.amount ? "border-red-500" : ""
                          }`}
                        />
                        {errors.amount && (
                          <p className="text-xs text-red-500">
                            {errors.amount.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="transactionHash"
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            errors.transactionHash
                              ? "text-red-500"
                              : "text-[#56684f]"
                          }`}
                        >
                          Transaction Hash
                        </Label>
                        <Input
                          id="transactionHash"
                          placeholder="6777997a5421f...."
                          {...register("transactionHash")}
                          className={`h-12 bg-white border-[#dcf0c5] text-[#42523d] font-mono text-sm focus-visible:ring-[#62b01a]/30 ${
                            errors.transactionHash ? "border-red-500" : ""
                          }`}
                        />
                        {errors.transactionHash && (
                          <p className="text-xs text-red-500">
                            {errors.transactionHash.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#56684f]">
                          Transaction Screenshot
                        </Label>

                        <div className="relative min-h-[170px] rounded-xl border-2 border-dashed border-[#dcf0c5] bg-[#fafdf8] p-4 text-center cursor-pointer hover:bg-[#f4faef] transition-colors flex items-center justify-center">
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={(e) =>
                              setValue("screenshot", e.target.files?.[0] || null)
                            }
                          />

                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-5 w-5 text-[#62b01a]" />
                            <span className="text-[10px] font-black text-[#56684f] uppercase tracking-widest text-center">
                              {watchScreenshot
                                ? watchScreenshot.name
                                : "Click to upload screenshot"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-sm font-black uppercase tracking-widest bg-[#62b01a] hover:bg-[#539714] text-white shadow-lg shadow-[#62b01a]/20 rounded-lg"
                  >
                    {isSubmitting ? "Submitting..." : "Verify & Submit"}
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Sr. No.
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Date
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Remark
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Activity
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Txn Hash
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Amount
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">
                    Screenshot
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : deposits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No matching records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  deposits.map((row, index) => (
                    <TableRow
                      key={row._id || index}
                      className="border-border hover:bg-muted/20 transition-colors group"
                    >
                      <TableCell className="text-xs font-bold text-muted-foreground">
                        {index + 1}
                      </TableCell>

                      <TableCell className="text-xs font-bold text-foreground">
                        <div className="flex flex-col">
                          <span>
                            {row.createdAt
                              ? format(new Date(row.createdAt), "dd/MM/yyyy")
                              : "-"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {row.createdAt
                              ? format(new Date(row.createdAt), "HH:mm")
                              : "-"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs font-medium text-slate-500 italic">
                        "{row.remark || "Fund Request"}"
                      </TableCell>

                      <TableCell>
                        <span className="text-[10px] font-black uppercase tracking-tight bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {row.activity || "Add Fund"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                          <span className="truncate max-w-[80px]">
                            {row.transactionHash || "-"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm font-black text-foreground">
                        {row.amount} USDT
                      </TableCell>

                      <TableCell className="text-center">
                        {buildScreenshotUrl(row.screenshot) ? (
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-lg border-border"
                              type="button"
                              onClick={() => {
                                const key = row.screenshot;
                                if (!key) return;
                                
                                const directUrl = buildScreenshotUrl(key);
                                setPreviewUrl(directUrl);
                                setPreviewError(false);
                                setIsPreviewOpen(true);
                                setIsPreviewLoading(true);
                                
                                // The /aws endpoint returns a JSON containing a presigned S3 URL!
                                api.get(`/aws/${encodeURIComponent(key)}`)
                                  .then((res) => {
                                    if (res.data?.status && res.data?.data) {
                                      // res.data.data is the presigned S3 URL
                                      setPreviewUrl(res.data.data);
                                      setPreviewError(false);
                                    } else {
                                      setPreviewError(true);
                                    }
                                    setIsPreviewLoading(false);
                                  })
                                  .catch((err) => {
                                    console.error("Failed to fetch S3 URL:", err);
                                    setPreviewError(true);
                                    setIsPreviewLoading(false);
                                  });
                              }}
                            >
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        ) : (
                          <span className="text-xs font-semibold text-muted-foreground">
                            NA
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm ${
                            row.status?.toLowerCase() === "approved" ||
                            row.status?.toLowerCase() === "verified"
                              ? "bg-emerald-50 text-emerald-600"
                              : row.status?.toLowerCase() === "pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {(row.status?.toLowerCase() === "approved" ||
                            row.status?.toLowerCase() === "verified") && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}

                          {row.status?.toLowerCase() === "pending" && (
                            <Clock className="h-3 w-3 animate-pulse" />
                          )}

                          {(row.status?.toLowerCase() === "rejected" ||
                            row.status?.toLowerCase() === "declined") && (
                            <XCircle className="h-3 w-3" />
                          )}

                          {row.status || "Unknown"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="!max-w-[900px] w-full">
          <DialogHeader>
            <DialogTitle className="text-sm font-black uppercase tracking-widest">
              Screenshot Preview
            </DialogTitle>
            <DialogDescription className="sr-only">
              Viewing the transaction proof screenshot for this fund request.
            </DialogDescription>
          </DialogHeader>
          {isPreviewLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Fetching secure image...
              </p>
            </div>
          ) : previewUrl && !previewError ? (
            <div className="flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Transaction screenshot"
                className="max-h-[70vh] w-auto max-w-full rounded-lg border border-border"
                onError={() => {
                  console.error("Image tag failed to load:", previewUrl);
                  setPreviewError(true);
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[350px] gap-4 p-8">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                  Image could not be loaded
                </h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase max-w-[280px] leading-relaxed opacity-60">
                   The security token matched, but the file was not found or the format is invalid.
                </p>
              </div>
              
              <div className="flex flex-col gap-2 w-full max-w-[320px]">
                 <Button 
                   variant="outline" 
                   className="text-[10px] font-black uppercase h-10 border-border"
                   onClick={() => window.open(previewUrl || "", '_blank')}
                 >
                   Open Raw Link
                 </Button>
                 
                 <div className="rounded-lg bg-muted/50 p-3 border border-border">
                   <p className="text-[9px] font-mono text-muted-foreground break-all text-center">
                     {previewUrl}
                   </p>
                 </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}