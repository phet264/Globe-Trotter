import { TripIntelligence } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function IntelligenceCenter({ intelligence, currency }: { intelligence: TripIntelligence | null, currency: string }) {
  if (!intelligence) return null;

  return (
    <div className="space-y-6">
      {/* Readiness */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center text-lg">
            Trip Readiness
            <span className="text-2xl font-bold">{intelligence.readiness.score}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={intelligence.readiness.score} className="h-2 mb-4" />
          <div className="space-y-2 text-sm">
            {intelligence.readiness.completedChecks.map((c, i) => (
              <div key={i} className="flex items-center text-green-700">
                <CheckCircle2 className="w-4 h-4 mr-2" /> {c}
              </div>
            ))}
            {intelligence.readiness.pendingChecks.map((c, i) => (
              <div key={i} className="flex items-center text-slate-400">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 mr-2" /> {c}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Total Projected</span>
            <span className="font-semibold">{currency}{intelligence.cost.totalProjected.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Remaining Budget</span>
            <span className={`font-semibold ${intelligence.cost.remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
              {currency}{intelligence.cost.remaining.toFixed(2)}
            </span>
          </div>
          
          <div className="pt-4 border-t space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-500">Accommodation</span><span>{currency}{intelligence.cost.breakdown.accommodation.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Transportation</span><span>{currency}{intelligence.cost.breakdown.transportation.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Activities</span><span>{currency}{intelligence.cost.breakdown.activities.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Food</span><span>{currency}{intelligence.cost.breakdown.food.toFixed(2)}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Conflict Center */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Trip Issues</CardTitle>
        </CardHeader>
        <CardContent>
          {intelligence.conflicts.length === 0 ? (
            <p className="text-sm text-green-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2"/> Looks good! No major conflicts detected.</p>
          ) : (
            <div className="space-y-3">
              {intelligence.conflicts.map((conflict, i) => (
                <div key={i} className={`p-3 rounded-lg flex items-start text-sm ${
                  conflict.severity === 'ERROR' ? 'bg-red-50 text-red-700' : 
                  conflict.severity === 'WARNING' ? 'bg-yellow-50 text-yellow-800' : 'bg-blue-50 text-blue-700'
                }`}>
                  {conflict.severity === 'ERROR' ? <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" /> : <Info className="w-4 h-4 mr-2 mt-0.5 shrink-0" />}
                  <span>{conflict.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
