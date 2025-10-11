"use client";

import { useState } from "react";
import { createPayment } from "@/actions/create-payment";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Phone, CreditCard } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentType || !amount || !transactionId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await createPayment({
        type: paymentType as "monthly" | "exam" | "registration" | "event",
        amount,
        bkashTransactionId: transactionId,
      });

      if (res.ok) {
        toast.success(
          "Payment submitted successfully. We'll verify your transaction soon."
        );
        setPaymentType("");
        setAmount("");
        setTransactionId("");
      } else {
        if (res.fieldErrors?.bkashTransactionId) {
          toast.error(res.fieldErrors.bkashTransactionId);
        } else if (res.fieldErrors?.amount) {
          toast.error(res.fieldErrors.amount);
        } else if (res.fieldErrors?.type) {
          toast.error(res.fieldErrors.type);
        } else {
          toast.error(res.error);
        }
      }
    } catch (error: any) {
      console.error("Payment submission error:", error);
      toast.error(
        error?.message || "Failed to submit payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Make Payment
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete your payment using bKash mobile banking
        </p>
      </div>

      {/* bKash Logo and Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* bKash Logo */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <Image
                  src="/bkash.png"
                  alt="bKash Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Phone className="w-5 h-5 text-pink-600" />
                <span>Send Money to this number:</span>
              </div>

              <div className="text-2xl font-bold text-pink-600 bg-pink-50 dark:bg-pink-900/20 py-3 px-6 rounded-lg inline-block">
                01811761851
              </div>

              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                After sending money, copy and paste the transaction ID below
                along with your payment details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Details</span>
          </CardTitle>
          <CardDescription>
            Fill in your payment information and transaction ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Type */}
            <div className="space-y-2">
              <Label htmlFor="payment-type">Payment Type *</Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger id="payment-type">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly fee</SelectItem>
                  <SelectItem value="exam">Exam fee</SelectItem>
                  <SelectItem value="registration">Registration Fee</SelectItem>
                  <SelectItem value="event">Event/competition fee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (BDT) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
                required
              />
            </div>

            {/* Transaction ID */}
            <div className="space-y-2">
              <Label htmlFor="transaction-id">bKash Transaction ID *</Label>
              <Input
                id="transaction-id"
                placeholder="Enter the transaction ID from bKash"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You'll receive this ID after completing the bKash transaction
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Payment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payment Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-pink-600 min-w-[20px]">
                1.
              </span>
              <span>Open your bKash app and select "Send Money"</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-pink-600 min-w-[20px]">
                2.
              </span>
              <span>
                Enter the number: <strong>01301393129</strong>
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-pink-600 min-w-[20px]">
                3.
              </span>
              <span>Enter the payment amount</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-pink-600 min-w-[20px]">
                4.
              </span>
              <span>Complete the transaction with your bKash PIN</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-pink-600 min-w-[20px]">
                5.
              </span>
              <span>Copy the transaction ID from the confirmation message</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-pink-600 min-w-[20px]">
                6.
              </span>
              <span>
                Fill out this form with your payment details and transaction ID
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
