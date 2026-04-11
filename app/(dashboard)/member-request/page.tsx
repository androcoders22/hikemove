"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/components/ui/use-toast";
import {
  createWithdrawalAPI,
  getMemberRequestsAPI,
} from "@/lib/api/withdrawal";
import { getWalletAPI } from "@/lib/api/wallet";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, CalendarClock, CheckCircle2, XCircle, Hourglass, UserCircle2 } from "lucide-react";

const formSchema = z.object({
  amount: z.string().min(1, { message: "Amount is required." }),
  walletAddress: z.string().min(1, { message: "Wallet address is required." }),
});

export default function MemberRequestPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [incomeBalance, setIncomeBalance] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      walletAddress: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const amountValue = Number(values.amount || 0);
      if (amountValue > incomeBalance) {
        toast({
          title: "Balance not available",
          description: "Requested amount exceeds your income balance.",
          variant: "destructive",
        });
        return;
      }
      await createWithdrawalAPI(values);
      toast({
        title: "Success",
        description: "Your request has been submitted.",
      });
      fetchRequests(currentPage);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function fetchRequests(page: number = 1) {
    setIsLoadingRequests(true);
    try {
      const res = await getMemberRequestsAPI(page, limit);
      const d = res.data;
      if (d?.status && d?.data) {
        let dataArray = [];
        let totalP = 1;

        const meta = d.metaData;
        if (meta?.totalPages) {
          totalP = Number(meta.totalPages);
        }

        if (Array.isArray(d.data)) {
          dataArray = d.data;
          if (!meta) totalP = d.totalPages || (d.total ? Math.ceil(d.total / limit) : 1);
        } else if (typeof d.data === "object") {
          dataArray = d.data.docs || d.data.list || d.data.records || d.data.data || [];
          if (!meta) totalP = d.data.totalPages || d.data.pages || d.totalPages || (d.data.total ? Math.ceil(d.data.total / limit) : 1);
        }
        setRequests(dataArray);
        setTotalPages(totalP);
        setCurrentPage(page);
      } else {
        setRequests([]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingRequests(false);
    }
  }

  async function fetchWallet() {
    try {
      const res = await getWalletAPI();
      if (res.data?.status && res.data?.data) {
        setIncomeBalance(Number(res.data.data.incomeBalance || 0));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load income balance",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    fetchRequests();
    fetchWallet();
  }, []);

  // const resolveMemberId = (request: any) => {
  //   const member = request?.member;
  //   if (member && typeof member === "object") {
  //     return (
  //       member.memberId ||
  //       member.member_id ||
  //       member.id ||
  //       member._id ||
  //       request?.memberId ||  
  //       request?.member_id ||
  //       "N/A"
  //     );
  //   }

  //   return member || request?.memberId || request?.member_id || "N/A";
  // };

  // const resolveMemberName = (request: any) => {
  //   const member = request?.member;
  //   if (member && typeof member === "object") {
  //     return (
  //       member.fullName ||
  //       member.name ||
  //       member.memberName ||
  //       member.username ||
  //       "N/A"
  //     );
  //   }

  //   return request?.memberName || request?.member_full_name || "N/A";
  // };

  return (
    <div>
      <PageHeader title="Withdrawal Request" />
      <div className="p-4 sm:p-8 grid gap-8">
        {/* <Card>
          <CardHeader>
            <CardTitle>Income Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Available</p>
                  <p className="text-2xl font-black">
                    {incomeBalance.toLocaleString()} $
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>New Withdrawal Request</CardTitle>
              <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                Income Balance
                <span className="text-[11px] font-black text-emerald-900">$ {incomeBalance.toLocaleString()}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              placeholder="Enter amount"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wallet Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              placeholder="Enter wallet address"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit">Submit Request</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previous Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      <span>Amount</span>
                    </div>
                  </TableHead>
                  {/* <TableHead>
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="h-5 w-5" />
                      <span>Member Id</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="h-5 w-5" />
                      <span>Member Name</span>
                    </div>
                  </TableHead> */}
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      <span>Wallet Address</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Hourglass className="h-5 w-5" />
                      <span>Status</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-5 w-5" />
                      <span>Date</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request: any, index: number) => (
                  <TableRow key={request._id ?? index}>
                    <TableCell>${request.amount.toFixed(2)}</TableCell>
                    {/* <TableCell>{resolveMemberId(request)}</TableCell>
                    <TableCell>{resolveMemberName(request)}</TableCell> */}
                    <TableCell>{request.walletAddress}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "approved"
                            ? "default"
                            : request.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                        className="capitalize"
                      >
                        {request.status === "approved" && (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        )}
                        {request.status === "rejected" && (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 0 && (
              <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest order-2 sm:order-1">
                  Page {currentPage} of {totalPages}
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-1.5 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1 || isLoadingRequests}
                    onClick={() => fetchRequests(1)}
                    className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                  >
                    First
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1 || isLoadingRequests}
                    onClick={() => fetchRequests(currentPage - 1)}
                    className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                  >
                    Prev
                  </Button>

                  <div className="flex items-center gap-1 mx-1">
                    {(() => {
                      const pages = [];
                      if (totalPages > 0) {
                        pages.push(currentPage);
                        if (currentPage < totalPages) {
                          pages.push(currentPage + 1);
                          if (currentPage + 1 < totalPages) {
                            pages.push("...");
                          }
                        }
                      }

                      return pages.map((page, idx) => (
                        <React.Fragment key={idx}>
                          {page === "..." ? (
                            <span className="w-8 h-8 flex items-center justify-center text-muted-foreground">...</span>
                          ) : (
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="icon"
                              disabled={isLoadingRequests}
                              onClick={() => fetchRequests(page as number)}
                              className={`h-8 w-8 text-[11px] font-bold transition-all ${
                                currentPage === page 
                                 ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-primary" 
                                 : "hover:bg-primary/5"
                              }`}
                            >
                              {page}
                            </Button>
                          )}
                        </React.Fragment>
                      ));
                    })()}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages || isLoadingRequests}
                    onClick={() => fetchRequests(currentPage + 1)}
                    className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                  >
                    Next
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages || isLoadingRequests}
                    onClick={() => fetchRequests(totalPages)}
                    className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                  >
                    Last
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}