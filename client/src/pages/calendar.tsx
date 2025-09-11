import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PeriodCalendar from "../components/period-calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatDate } from "../lib/date-utils";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CalendarPlus } from "lucide-react";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPeriod = useMutation({
    mutationFn: async (data: { startDate: string; endDate?: string }) => {
      const response = await apiRequest("POST", "/api/periods", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/periods"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cycles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
      setIsDialogOpen(false);
      setPeriodStart("");
      setPeriodEnd("");
      toast({
        title: "Period added",
        description: "Period has been successfully added to your calendar.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add period. Please try again.",
      });
    },
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setPeriodStart(formatDate(date));
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!periodStart) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a start date.",
      });
      return;
    }

    const data: { startDate: string; endDate?: string } = {
      startDate: periodStart,
    };

    if (periodEnd) {
      data.endDate = periodEnd;
    }

    createPeriod.mutate(data);
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Track your cycle and view predictions</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-period">
              <CalendarPlus className="w-4 h-4 mr-2" />
              Add Period
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Period</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="period-start">Start Date</Label>
                <Input
                  id="period-start"
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  data-testid="input-period-start"
                  required
                />
              </div>
              <div>
                <Label htmlFor="period-end">End Date (Optional)</Label>
                <Input
                  id="period-end"
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  data-testid="input-period-end"
                  min={periodStart}
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createPeriod.isPending}
                  data-testid="button-save-period"
                >
                  {createPeriod.isPending ? "Adding..." : "Add Period"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar */}
      <PeriodCalendar
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate || undefined}
      />

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to use</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Click on any date to mark the start of your period</li>
            <li>• Pink days indicate your period dates</li>
            <li>• Purple days show your fertile window</li>
            <li>• Teal days are predicted period dates based on your history</li>
            <li>• Small dots indicate days when you logged symptoms</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
