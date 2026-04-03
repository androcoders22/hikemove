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
import { useEffect, useState } from "react";
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
      fetchRequests();
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  async function fetchRequests() {
    try {
      const res = await getMemberRequestsAPI();
      setRequests(res.data.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}