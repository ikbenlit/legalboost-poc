<script lang="ts">
    interface Risk {
        severity: 'high' | 'medium' | 'low';
        description: string;
    }

    interface AnalysisResult {
        risks: Risk[];
        recommendations: string[];
        considerations: string[];
    }

    export let analysis: AnalysisResult;

    const severityColors = {
        high: 'bg-red-100 text-red-800 border-red-300',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        low: 'bg-blue-100 text-blue-800 border-blue-300'
    };

    const severityLabels = {
        high: 'Hoog',
        medium: 'Middel',
        low: 'Laag'
    };
</script>

<div class="space-y-6">
    <div>
        <h3 class="text-lg font-semibold mb-3">Risico Analyse</h3>
        <div class="space-y-2">
            {#each analysis.risks as risk}
                <div class="flex items-start space-x-3 p-3 rounded-md border {severityColors[risk.severity]}">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {severityLabels[risk.severity]}
                    </span>
                    <p>{risk.description}</p>
                </div>
            {/each}
        </div>
    </div>

    <div>
        <h3 class="text-lg font-semibold mb-3">Aanbevelingen</h3>
        <ul class="list-disc list-inside space-y-2">
            {#each analysis.recommendations as recommendation}
                <li class="text-gray-700">{recommendation}</li>
            {/each}
        </ul>
    </div>

    <div>
        <h3 class="text-lg font-semibold mb-3">Juridische Overwegingen</h3>
        <ul class="list-disc list-inside space-y-2">
            {#each analysis.considerations as consideration}
                <li class="text-gray-700">{consideration}</li>
            {/each}
        </ul>
    </div>
</div> 