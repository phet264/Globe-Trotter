import { PreparationItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api/client";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export function PreparationChecklist({ tripId, items, onUpdate }: { tripId: string, items: PreparationItem[], onUpdate: () => void }) {
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggest = async () => {
    setIsSuggesting(true);
    try {
      await api.post(`/v1/trips/${tripId}/preparations/suggest`, {});
      onUpdate();
    } catch(e) {
      console.error(e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const categories = Array.from(new Set(items.map(i => i.category)));
  const completed = items.filter(i => i.isCompleted).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Before You Go</CardTitle>
        <span className="text-sm text-slate-500 font-medium">{completed} / {items.length} done</span>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center p-6 border-2 border-dashed rounded-lg">
            <p className="text-sm text-slate-500 mb-4">Your packing list is empty.</p>
            <Button onClick={handleSuggest} disabled={isSuggesting} variant="outline" className="w-full">
              <Sparkles className="w-4 h-4 mr-2"/> Auto-suggest items
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Button onClick={handleSuggest} disabled={isSuggesting} variant="secondary" size="sm" className="w-full text-xs">
              <Sparkles className="w-3 h-3 mr-2"/> Suggest More
            </Button>
            
            {categories.map(cat => (
              <div key={cat} className="space-y-2">
                <h4 className="font-semibold text-sm text-slate-900">{cat}</h4>
                <div className="space-y-2">
                  {items.filter(i => i.category === cat).map(item => (
                    <label key={item.id} className="flex items-start space-x-3 cursor-pointer group">
                      <Checkbox 
                        checked={item.isCompleted} 
                        className="mt-0.5"
                        // In a real app we'd PUT update the status here
                      />
                      <span className={`text-sm ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {item.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
