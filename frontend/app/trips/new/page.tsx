"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { Trip } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  destination: z.string().min(1, "Destination is required"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
  travelers: z.number().min(1),
  budget: z.number().optional(),
  currency: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateTripPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { travelers: 1, currency: "USD" }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      setError("");
      
      const res = await api.post<{ trip: Trip }>("/v1/trips", {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      });
      
      router.push(`/trips/${res.trip.id}`);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to create trip.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-12">
      <h1 className="text-3xl font-bold mb-8">Plan a New Trip</h1>
      
      {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg">{error}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="title">Trip Name</Label>
            <Input id="title" placeholder="e.g. Summer in Europe" {...register("title")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" placeholder="e.g. Paris, France" {...register("destination")} />
            {errors.destination && <p className="text-sm text-red-500">{errors.destination.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" {...register("startDate")} />
            {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="date" {...register("endDate")} />
            {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelers">Number of Travelers</Label>
            <Input id="travelers" type="number" min="1" {...register("travelers", { valueAsNumber: true })} />
            {errors.travelers && <p className="text-sm text-red-500">{errors.travelers.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Total Budget</Label>
            <Input id="budget" type="number" min="0" placeholder="0" {...register("budget", { valueAsNumber: true })} />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea id="description" placeholder="A brief description of the trip..." {...register("description")} />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Trip..." : "Create Trip"}
        </Button>
      </form>
    </div>
  );
}
