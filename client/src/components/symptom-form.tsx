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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { formatDate } from "../lib/date-utils";

interface SymptomFormProps {
  onSubmit: (data: InsertSymptom) => void;
  isLoading?: boolean;
  initialDate?: string;
}

export default function SymptomForm({ onSubmit, isLoading = false, initialDate }: SymptomFormProps) {
  // State for all symptom categories
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [selectedPain, setSelectedPain] = useState<string | null>(null);
  const [selectedCramping, setSelectedCramping] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [selectedSleep, setSelectedSleep] = useState<string | null>(null);
  const [selectedSkin, setSelectedSkin] = useState<string | null>(null);
  const [selectedAppetite, setSelectedAppetite] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [sleepHours, setSleepHours] = useState<number[]>([8]);
  
  // Array states for multi-select options
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>([]);
  const [digestiveSymptoms, setDigestiveSymptoms] = useState<string[]>([]);
  const [foodCravings, setFoodCravings] = useState<string[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<string[]>([]);
  const [additionalSymptoms, setAdditionalSymptoms] = useState<string[]>([]);

  const form = useForm<InsertSymptom>({
    resolver: zodResolver(insertSymptomSchema),
    defaultValues: {
      date: initialDate || formatDate(new Date()),
      flowIntensity: null,
      painLevel: null,
      crampingLevel: null,
      mood: null,
      energyLevel: null,
      physicalSymptoms: [],
      sleepQuality: null,
      sleepHours: 8,
      digestiveSymptoms: [],
      skinCondition: null,
      foodCravings: [],
      appetiteLevel: null,
      exerciseLevel: null,
      exerciseType: [],
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
    { value: "content", label: "Content", emoji: "😊" },
    { value: "neutral", label: "Neutral", emoji: "😐" },
    { value: "sad", label: "Sad", emoji: "😢" },
    { value: "irritated", label: "Irritated", emoji: "😤" },
    { value: "anxious", label: "Anxious", emoji: "😰" },
    { value: "depressed", label: "Depressed", emoji: "😞" },
    { value: "energetic", label: "Energetic", emoji: "⚡" },
    { value: "stressed", label: "Stressed", emoji: "😫" },
  ];

  const energyOptions = [
    { value: "very_low", label: "Very Low", emoji: "😴" },
    { value: "low", label: "Low", emoji: "😪" },
    { value: "normal", label: "Normal", emoji: "😌" },
    { value: "high", label: "High", emoji: "😊" },
    { value: "very_high", label: "Very High", emoji: "⚡" },
  ];

  const sleepOptions = [
    { value: "very_poor", label: "Very Poor", emoji: "😵" },
    { value: "poor", label: "Poor", emoji: "😴" },
    { value: "fair", label: "Fair", emoji: "😐" },
    { value: "good", label: "Good", emoji: "😊" },
    { value: "excellent", label: "Excellent", emoji: "😁" },
  ];

  const skinOptions = [
    { value: "clear", label: "Clear", emoji: "✨" },
    { value: "mild_acne", label: "Mild Acne", emoji: "😕" },
    { value: "moderate_acne", label: "Moderate Acne", emoji: "😣" },
    { value: "severe_acne", label: "Severe Acne", emoji: "😖" },
    { value: "dry", label: "Dry", emoji: "🏜️" },
    { value: "oily", label: "Oily", emoji: "💧" },
  ];

  const appetiteOptions = [
    { value: "very_low", label: "Very Low", emoji: "😑" },
    { value: "low", label: "Low", emoji: "😐" },
    { value: "normal", label: "Normal", emoji: "🙂" },
    { value: "high", label: "High", emoji: "😋" },
    { value: "very_high", label: "Very High", emoji: "🤤" },
  ];

  const exerciseOptions = [
    { value: "none", label: "None", emoji: "🛋️" },
    { value: "light", label: "Light", emoji: "🚶" },
    { value: "moderate", label: "Moderate", emoji: "🏃" },
    { value: "intense", label: "Intense", emoji: "🏋️" },
  ];

  const physicalSymptomOptions = [
    "Headache", "Back pain", "Joint pain", "Breast tenderness", 
    "Bloating", "Hot flashes", "Dizziness", "Fatigue",
    "Water retention", "Muscle aches", "Tender breasts"
  ];

  const digestiveSymptomOptions = [
    "Nausea", "Vomiting", "Constipation", "Diarrhea", 
    "Stomach cramps", "Gas", "Heartburn", "Loss of appetite"
  ];

  const cravingOptions = [
    "Sweet foods", "Salty snacks", "Chocolate", "Carbohydrates", 
    "Spicy food", "Dairy", "Meat", "Fruits", "Vegetables"
  ];

  const exerciseTypeOptions = [
    "Walking", "Running", "Yoga", "Weightlifting", "Swimming", 
    "Cycling", "Dancing", "Pilates", "Sports", "Stretching"
  ];

  const symptomOptions = [
    "Mood swings", "Difficulty concentrating", "Memory issues",
    "Increased sensitivity", "Social withdrawal", "Restlessness"
  ];

  // Handler functions for all categories
  const handleFlowSelect = (value: string) => {
    setSelectedFlow(value);
    form.setValue("flowIntensity", value as any);
  };

  const handlePainSelect = (value: string) => {
    setSelectedPain(value);
    form.setValue("painLevel", value as any);
  };

  const handleCrampingSelect = (value: string) => {
    setSelectedCramping(value);
    form.setValue("crampingLevel", value as any);
  };

  const handleMoodSelect = (value: string) => {
    setSelectedMood(value);
    form.setValue("mood", value as any);
  };

  const handleEnergySelect = (value: string) => {
    setSelectedEnergy(value);
    form.setValue("energyLevel", value as any);
  };

  const handleSleepSelect = (value: string) => {
    setSelectedSleep(value);
    form.setValue("sleepQuality", value as any);
  };

  const handleSkinSelect = (value: string) => {
    setSelectedSkin(value);
    form.setValue("skinCondition", value as any);
  };

  const handleAppetiteSelect = (value: string) => {
    setSelectedAppetite(value);
    form.setValue("appetiteLevel", value as any);
  };

  const handleExerciseSelect = (value: string) => {
    setSelectedExercise(value);
    form.setValue("exerciseLevel", value as any);
  };

  const handleSleepHoursChange = (value: number[]) => {
    setSleepHours(value);
    form.setValue("sleepHours", Math.round(value[0]));
  };

  // Multi-select handlers
  const handlePhysicalSymptomToggle = (symptom: string, checked: boolean) => {
    const updated = checked
      ? [...physicalSymptoms, symptom]
      : physicalSymptoms.filter(s => s !== symptom);
    
    setPhysicalSymptoms(updated);
    form.setValue("physicalSymptoms", updated);
  };

  const handleDigestiveSymptomToggle = (symptom: string, checked: boolean) => {
    const updated = checked
      ? [...digestiveSymptoms, symptom]
      : digestiveSymptoms.filter(s => s !== symptom);
    
    setDigestiveSymptoms(updated);
    form.setValue("digestiveSymptoms", updated);
  };

  const handleCravingToggle = (craving: string, checked: boolean) => {
    const updated = checked
      ? [...foodCravings, craving]
      : foodCravings.filter(c => c !== craving);
    
    setFoodCravings(updated);
    form.setValue("foodCravings", updated);
  };

  const handleExerciseTypeToggle = (type: string, checked: boolean) => {
    const updated = checked
      ? [...exerciseTypes, type]
      : exerciseTypes.filter(t => t !== type);
    
    setExerciseTypes(updated);
    form.setValue("exerciseType", updated);
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
      crampingLevel: selectedCramping as any,
      mood: selectedMood as any,
      energyLevel: selectedEnergy as any,
      physicalSymptoms,
      sleepQuality: selectedSleep as any,
      sleepHours: sleepHours[0],
      digestiveSymptoms,
      skinCondition: selectedSkin as any,
      foodCravings,
      appetiteLevel: selectedAppetite as any,
      exerciseLevel: selectedExercise as any,
      exerciseType: exerciseTypes,
      additionalSymptoms,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprehensive Symptom Tracking</CardTitle>
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

          <Tabs defaultValue="flow-pain" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="flow-pain">Flow & Pain</TabsTrigger>
              <TabsTrigger value="emotional">Emotional</TabsTrigger>
              <TabsTrigger value="physical">Physical</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            </TabsList>

            {/* Flow & Pain Tab */}
            <TabsContent value="flow-pain" className="space-y-6">
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
                <Label className="block text-sm font-medium mb-3">General Pain Level</Label>
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

              {/* Cramping Level */}
              <div>
                <Label className="block text-sm font-medium mb-3">Cramping Level</Label>
                <div className="flex space-x-2">
                  {painOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selectedCramping === option.value ? "default" : "outline"}
                      className="flex-1 flex flex-col items-center p-3 h-auto"
                      onClick={() => handleCrampingSelect(option.value)}
                      data-testid={`button-cramping-${option.value}`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs">{option.label}</div>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Emotional Tab */}
            <TabsContent value="emotional" className="space-y-6">
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

              {/* Energy Level */}
              <div>
                <Label className="block text-sm font-medium mb-3">Energy Level</Label>
                <div className="grid grid-cols-5 gap-2">
                  {energyOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selectedEnergy === option.value ? "default" : "outline"}
                      className="flex flex-col items-center p-3 h-auto"
                      onClick={() => handleEnergySelect(option.value)}
                      data-testid={`button-energy-${option.value}`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs">{option.label}</div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Additional Emotional Symptoms */}
              <div>
                <Label className="block text-sm font-medium mb-3">Emotional Symptoms</Label>
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
            </TabsContent>

            {/* Physical Tab */}
            <TabsContent value="physical" className="space-y-6">
              {/* Physical Symptoms */}
              <div>
                <Label className="block text-sm font-medium mb-3">Physical Symptoms</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {physicalSymptomOptions.map((symptom) => (
                    <label key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        checked={physicalSymptoms.includes(symptom)}
                        onCheckedChange={(checked) => handlePhysicalSymptomToggle(symptom, checked as boolean)}
                        data-testid={`checkbox-physical-${symptom.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <span>{symptom}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Digestive Symptoms */}
              <div>
                <Label className="block text-sm font-medium mb-3">Digestive Symptoms</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {digestiveSymptomOptions.map((symptom) => (
                    <label key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        checked={digestiveSymptoms.includes(symptom)}
                        onCheckedChange={(checked) => handleDigestiveSymptomToggle(symptom, checked as boolean)}
                        data-testid={`checkbox-digestive-${symptom.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <span>{symptom}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skin Condition */}
              <div>
                <Label className="block text-sm font-medium mb-3">Skin Condition</Label>
                <div className="grid grid-cols-3 gap-2">
                  {skinOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selectedSkin === option.value ? "default" : "outline"}
                      className="flex flex-col items-center p-3 h-auto"
                      onClick={() => handleSkinSelect(option.value)}
                      data-testid={`button-skin-${option.value}`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs">{option.label}</div>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Lifestyle Tab */}
            <TabsContent value="lifestyle" className="space-y-6">
              {/* Sleep Quality */}
              <div>
                <Label className="block text-sm font-medium mb-3">Sleep Quality</Label>
                <div className="grid grid-cols-5 gap-2">
                  {sleepOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selectedSleep === option.value ? "default" : "outline"}
                      className="flex flex-col items-center p-3 h-auto"
                      onClick={() => handleSleepSelect(option.value)}
                      data-testid={`button-sleep-${option.value}`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs">{option.label}</div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sleep Hours */}
              <div>
                <Label className="block text-sm font-medium mb-3">
                  Sleep Hours: {sleepHours[0]}h
                </Label>
                <Slider
                  value={sleepHours}
                  onValueChange={handleSleepHoursChange}
                  max={12}
                  min={3}
                  step={1}
                  className="w-full"
                  data-testid="slider-sleep-hours"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>3h</span>
                  <span>12h</span>
                </div>
              </div>

              {/* Food Cravings */}
              <div>
                <Label className="block text-sm font-medium mb-3">Food Cravings</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {cravingOptions.map((craving) => (
                    <label key={craving} className="flex items-center space-x-2">
                      <Checkbox
                        checked={foodCravings.includes(craving)}
                        onCheckedChange={(checked) => handleCravingToggle(craving, checked as boolean)}
                        data-testid={`checkbox-craving-${craving.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <span>{craving}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Appetite Level */}
              <div>
                <Label className="block text-sm font-medium mb-3">Appetite Level</Label>
                <div className="grid grid-cols-5 gap-2">
                  {appetiteOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selectedAppetite === option.value ? "default" : "outline"}
                      className="flex flex-col items-center p-3 h-auto"
                      onClick={() => handleAppetiteSelect(option.value)}
                      data-testid={`button-appetite-${option.value}`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs">{option.label}</div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Exercise Level */}
              <div>
                <Label className="block text-sm font-medium mb-3">Exercise Level</Label>
                <div className="flex space-x-2">
                  {exerciseOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selectedExercise === option.value ? "default" : "outline"}
                      className="flex-1 flex flex-col items-center p-3 h-auto"
                      onClick={() => handleExerciseSelect(option.value)}
                      data-testid={`button-exercise-${option.value}`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs">{option.label}</div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Exercise Types */}
              {selectedExercise && selectedExercise !== 'none' && (
                <div>
                  <Label className="block text-sm font-medium mb-3">Exercise Types</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {exerciseTypeOptions.map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <Checkbox
                          checked={exerciseTypes.includes(type)}
                          onCheckedChange={(checked) => handleExerciseTypeToggle(type, checked as boolean)}
                          data-testid={`checkbox-exercise-${type.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes or observations..."
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
