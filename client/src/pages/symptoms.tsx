import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SymptomForm from "../components/symptom-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertSymptom } from "@shared/schema";
import { Edit, Trash2 } from "lucide-react";

export default function SymptomsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: symptoms = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/symptoms"],
  });

  const createSymptom = useMutation({
    mutationFn: async (data: InsertSymptom) => {
      const response = await apiRequest("POST", "/api/symptoms", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/symptoms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
      toast({
        title: "Symptoms saved",
        description: "Your symptoms have been logged successfully.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save symptoms. Please try again.",
      });
    },
  });

  const deleteSymptom = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/symptoms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/symptoms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
      toast({
        title: "Symptom deleted",
        description: "The symptom entry has been removed.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete symptom. Please try again.",
      });
    },
  });

  const handleSymptomSubmit = (data: InsertSymptom) => {
    createSymptom.mutate(data);
  };

  const handleDeleteSymptom = (id: string) => {
    if (window.confirm("Are you sure you want to delete this symptom entry?")) {
      deleteSymptom.mutate(id);
    }
  };

  const formatSymptomSummary = (symptom: any) => {
    const parts = [];
    
    if (symptom.flowIntensity && symptom.flowIntensity !== "none") {
      parts.push(`Flow: ${symptom.flowIntensity}`);
    }
    if (symptom.painLevel && symptom.painLevel !== "none") {
      parts.push(`Pain: ${symptom.painLevel}`);
    }
    if (symptom.mood) {
      parts.push(`Mood: ${symptom.mood}`);
    }
    
    return parts.join(" • ");
  };

  const getBorderColor = (symptom: any) => {
    if (symptom.flowIntensity && symptom.flowIntensity !== "none") {
      return "border-l-primary";
    }
    if (symptom.painLevel && symptom.painLevel !== "none") {
      return "border-l-destructive";
    }
    return "border-l-accent";
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Symptoms</h1>
        <p className="text-muted-foreground">Track your daily symptoms and patterns</p>
      </div>

      {/* Symptom Logging Form */}
      <SymptomForm
        onSubmit={handleSymptomSubmit}
        isLoading={createSymptom.isPending}
      />

      {/* Recent Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-l-4 border-muted pl-4">
                  <div className="h-5 bg-muted rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
                </div>
              ))}
            </div>
          ) : symptoms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <i className="fas fa-notes-medical text-4xl mb-4 opacity-50"></i>
              <p className="text-lg font-medium">No symptoms logged yet</p>
              <p className="text-sm">Start tracking your symptoms to see patterns and insights</p>
            </div>
          ) : (
            <div className="space-y-4">
              {symptoms.map((symptom: any) => (
                <div
                  key={symptom.id}
                  className={`border-l-4 pl-4 ${getBorderColor(symptom)}`}
                  data-testid={`symptom-entry-${symptom.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium" data-testid={`symptom-date-${symptom.id}`}>
                      {new Date(symptom.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSymptom(symptom.id)}
                        disabled={deleteSymptom.isPending}
                        data-testid={`button-delete-symptom-${symptom.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-1" data-testid={`symptom-summary-${symptom.id}`}>
                    {formatSymptomSummary(symptom)}
                  </div>
                  
                  {symptom.additionalSymptoms && symptom.additionalSymptoms.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {symptom.additionalSymptoms.map((s: string) => (
                        <Badge key={s} variant="outline" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {symptom.notes && (
                    <div className="text-sm text-muted-foreground mt-2 italic" data-testid={`symptom-notes-${symptom.id}`}>
                      "{symptom.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
