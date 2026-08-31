import { ForecastService } from '@/lib/providers/fixture-provider';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export default async function AlertsPage({ params }: { params: { id: string } }) {
  const alerts = await ForecastService.getAlerts(params.id);

  if (alerts.length === 0) {
    return (
      <div className="bg-surface border border-surface-raised rounded-3xl p-12 text-center flex flex-col items-center">
        <CheckCircle className="w-12 h-12 text-success/50 mb-4" />
        <h2 className="text-lg font-bold mb-2 text-snow">No Active Alerts</h2>
        <p className="text-text-secondary text-sm">Conditions are normal. No weather advisories or warnings currently issued for this location.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="bg-danger/10 border-2 border-danger/20 rounded-2xl p-6 flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-danger shrink-0" />
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-danger text-snow text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {alert.severity}
              </span>
              <span className="text-xs text-danger/70 font-medium">Issued {alert.issueTime}</span>
            </div>
            <h3 className="text-xl font-bold text-snow mb-2">{alert.title}</h3>
            <p className="text-sm text-snow/80 mb-3">Affected Area: <span className="font-medium text-snow">{alert.affectedArea}</span></p>
            <div className="text-xs bg-background/50 px-3 py-2 rounded-lg inline-block border border-danger/10 text-danger/80">
              Expires: {alert.expirationTime}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}