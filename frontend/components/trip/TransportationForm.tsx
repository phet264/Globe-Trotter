import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransportationSchema } from "@/schemas";
import { z } from "zod";
import { api } from "@/lib/api/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlaneTakeoff } from "lucide-react";

type FormValues = z.infer<typeof TransportationSchema>;

export function TransportationForm({ tripId, onSuccess }: { tripId: string, onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(TransportationSchema),
    defaultValues: { type: "Flight" }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      await api.post(`/v1/trips/${tripId}/transportations`, data);
      reset();
      setOpen(false);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="gap-2" />}>
        <PlaneTakeoff className="w-4 h-4" /> Add Transport
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transportation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <select {...register("type")} className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="Flight">Flight</option>
                <option value="Train">Train</option>
                <option value="Bus">Bus</option>
                <option value="Car">Car</option>
                <option value="Ferry">Ferry</option>
              </select>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Cost</Label>
              <Input type="number" step="0.01" {...register("cost", { valueAsNumber: true })} />
              {errors.cost && <p className="text-sm text-red-500">{errors.cost.message}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label>From</Label>
              <Input {...register("departureLocation")} placeholder="Origin" />
              {errors.departureLocation && <p className="text-sm text-red-500">{errors.departureLocation.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Dep. Date</Label>
              <Input type="date" {...register("departureDate")} />
            </div>
            <div className="space-y-2">
              <Label>Dep. Time</Label>
              <Input type="time" {...register("departureTime")} />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>To</Label>
              <Input {...register("arrivalLocation")} placeholder="Destination" />
              {errors.arrivalLocation && <p className="text-sm text-red-500">{errors.arrivalLocation.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Arr. Date</Label>
              <Input type="date" {...register("arrivalDate")} />
            </div>
            <div className="space-y-2">
              <Label>Arr. Time</Label>
              <Input type="time" {...register("arrivalTime")} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Transport"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
