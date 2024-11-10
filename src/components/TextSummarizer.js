import React from 'react';
import { Card } from '@/components/ui/card';

const TextSummary = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <Card className="p-6 mt-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-2">Simple Explanation</h3>
          <p className="text-gray-700">{analysis.simpleSummary}</p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Key Points</h3>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.keyPoints.map((point, index) => (
              <li key={index} className="text-gray-700">{point}</li>
            ))}
          </ul>
        </section>

        {analysis.deadlines.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Important Deadlines</h3>
            <ul className="list-disc pl-5 space-y-1">
              {analysis.deadlines.map((deadline, index) => (
                <li key={index} className="text-gray-700">{deadline}</li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h3 className="text-lg font-semibold mb-2">Required Actions</h3>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.requiredActions.map((action, index) => (
              <li key={index} className="text-gray-700">{action}</li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
};

export default TextSummary;