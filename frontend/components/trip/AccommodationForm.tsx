import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccommodationSchema } from "@/schemas";
import { z } from "zod";
import { api } from "@/lib/api/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bed } from "lucide-react";

type FormValues = z.infer<typeof AccommodationSchema>;

export function AccommodationForm({ tripId, onSuccess }: { tripId: string, onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(AccommodationSchema),
    defaultValues: { guests: 1, nights: 1 }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      await api.post(`/v1/trips/${tripId}/accommodations`, data);
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
        <Bed className="w-4 h-4" /> Add Accommodation
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Accommodation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register("name")} placeholder="e.g. Hilton Paris" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Input type="date" {...register("checkInDate")} />
              {errors.checkInDate && <p className="text-sm text-red-500">{errors.checkInDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Input type="date" {...register("checkOutDate")} />
              {errors.checkOutDate && <p className="text-sm text-red-500">{errors.checkOutDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Nights</Label>
              <Input type="number" {...register("nights", { valueAsNumber: true })} />
              {errors.nights && <p className="text-sm text-red-500">{errors.nights.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Price per night</Label>
              <Input type="number" step="0.01" {...register("pricePerNight", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Address (Optional)</Label>
              <Input {...register("address")} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Notes</Label>
              <Textarea {...register("notes")} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Accommodation"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
