import React from 'react';

export function ThankYou() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Terminal Header */}
      <header className="h-14 bg-surface border-b border-border flex items-center px-4">
        <div className="font-mono text-sm tracking-tight text-text-secondary">
          POST-OP MONITORING SYSTEM v2.0 / CHECK-IN COMPLETE
        </div>
      </header>

      {/* Success Console */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* System Status */}
          <div className="mb-8 font-mono text-sm">
            <div className="flex items-center space-x-2 text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-risk-green"></span>
              <span>CHECK-IN RECORDED</span>
            </div>
          </div>

          {/* Success Terminal */}
          <div className="bg-surface border border-border rounded-lg shadow-inner-subtle overflow-hidden">
            <div className="px-4 py-3 bg-surface-dark border-b border-border">
              <div className="font-mono text-sm text-text-secondary">STATUS UPDATE</div>
            </div>

            <div className="p-6">
              <div className="space-y-4 text-center">
                <div className="font-mono text-lg">
                  Thank you for your check-in
                </div>
                <div className="font-mono text-sm text-text-secondary">
                  Your responses have been recorded and will be reviewed by our clinical team.
                </div>
                <div className="font-mono text-sm text-text-secondary">
                  We will contact you if any follow-up is needed.
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="mt-8 font-mono text-xs text-text-secondary space-y-1">
            <div>DATA STORED: CONFIRMED</div>
            <div>RISK ASSESSMENT: COMPLETE</div>
            <div>NEXT CHECK-IN: TOMORROW 08:00</div>
          </div>
        </div>
      </div>
    </div>
  );
}
