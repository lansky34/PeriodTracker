import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSymptomSchema } from "@shared/schema";
import type { InsertSymptom } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "../lib/date-utils";

interface SymptomFormProps {
  onSubmit: (data: InsertSymptom) => void;
  isLoading?: boolean;
  initialDate?: string;
}

export default function SymptomForm({ onSubmit, isLoading = false, initialDate }: SymptomFormProps) {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [selectedPain, setSelectedPain] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [additionalSymptoms, setAdditionalSymptoms] = useState<string[]>([]);

  const form = useForm<InsertSymptom>({
    resolver: zodResolver(insertSymptomSchema),
    defaultValues: {
      date: initialDate || formatDate(new Date()),
      flowIntensity: null,
      painLevel: null,
      mood: null,
      additionalSymptoms: [],
      notes: "",
    },
  });

  const flowOptions = [
    { value: "none", label: "None", icon: "fas fa-circle-o" },
    { value: "light", label: "Light", icon: "fas fa-circle" },
    { value: "medium", label: "Medium", icon: "fas fa-circle" },
    { value: "heavy", label: "Heavy", icon: "fas fa-circle" },
  ];

  const painOptions = [
    { value: "none", label: "None", emoji: "😊" },
    { value: "mild", label: "Mild", emoji: "😐" },
    { value: "moderate", label: "Moderate", emoji: "😣" },
    { value: "severe", label: "Severe", emoji: "😫" },
  ];

  const moodOptions = [
    { value: "happy", label: "Happy", emoji: "😄" },
    { value: "neutral", label: "Neutral", emoji: "😐" },
    { value: "sad", label: "Sad", emoji: "😢" },
    { value: "irritated", label: "Irritated", emoji: "😤" },
    { value: "anxious", label: "Anxious", emoji: "😰" },
    { value: "energetic", label: "Energetic", emoji: "⚡" },
  ];

  const symptomOptions = [
    "Headache", "Bloating", "Back pain", 
    "Breast tenderness", "Cravings", "Nausea"
  ];

  const handleFlowSelect = (value: string) => {
    setSelectedFlow(value);
    form.setValue("flowIntensity", value as any);
  };

  const handlePainSelect = (value: string) => {
    setSelectedPain(value);
    form.setValue("painLevel", value as any);
  };

  const handleMoodSelect = (value: string) => {
    setSelectedMood(value);
    form.setValue("mood", value as any);
  };

  const handleSymptomToggle = (symptom: string, checked: boolean) => {
    const updated = checked
      ? [...additionalSymptoms, symptom]
      : additionalSymptoms.filter(s => s !== symptom);
    
    setAdditionalSymptoms(updated);
    form.setValue("additionalSymptoms", updated);
  };

  const handleSubmit = (data: InsertSymptom) => {
    onSubmit({
      ...data,
      flowIntensity: selectedFlow as any,
      painLevel: selectedPain as any,
      mood: selectedMood as any,
      additionalSymptoms,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Today's Symptoms</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Date Selection */}
          <div>
            <Label htmlFor="symptom-date">Date</Label>
            <Input
              id="symptom-date"
              type="date"
              data-testid="input-symptom-date"
              {...form.register("date")}
            />
          </div>

          {/* Flow Intensity */}
          <div>
            <Label className="block text-sm font-medium mb-3">Flow Intensity</Label>
            <div className="flex space-x-2">
              {flowOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={selectedFlow === option.value ? "default" : "outline"}
                  className="flex-1 flex flex-col items-center p-3 h-auto"
                  onClick={() => handleFlowSelect(option.value)}
                  data-testid={`button-flow-${option.value}`}
                >
                  <i className={`${option.icon} text-xl mb-1`}></i>
                  <div className="text-xs">{option.label}</div>
                </Button>
              ))}
            </div>
          </div>

          {/* Pain Level */}
          <div>
            <Label className="block text-sm font-medium mb-3">Pain Level</Label>
            <div className="flex space-x-2">
              {painOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={selectedPain === option.value ? "default" : "outline"}
                  className="flex-1 flex flex-col items-center p-3 h-auto"
                  onClick={() => handlePainSelect(option.value)}
                  data-testid={`button-pain-${option.value}`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs">{option.label}</div>
                </Button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <Label className="block text-sm font-medium mb-3">Mood</Label>
            <div className="grid grid-cols-3 gap-2">
              {moodOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={selectedMood === option.value ? "default" : "outline"}
                  className="flex flex-col items-center p-3 h-auto"
                  onClick={() => handleMoodSelect(option.value)}
                  data-testid={`button-mood-${option.value}`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs">{option.label}</div>
                </Button>
              ))}
            </div>
          </div>

          {/* Additional Symptoms */}
          <div>
            <Label className="block text-sm font-medium mb-3">Additional Symptoms</Label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {symptomOptions.map((symptom) => (
                <label key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    checked={additionalSymptoms.includes(symptom)}
                    onCheckedChange={(checked) => handleSymptomToggle(symptom, checked as boolean)}
                    data-testid={`checkbox-symptom-${symptom.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <span>{symptom}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              rows={3}
              data-testid="textarea-notes"
              {...form.register("notes")}
            />
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            data-testid="button-save-symptoms"
          >
            {isLoading ? "Saving..." : "Save Symptoms"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
