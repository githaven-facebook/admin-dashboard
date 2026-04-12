import * as React from 'react'
import { ExternalLink, Target, DollarSign, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/common/status-badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { AdCampaign } from '@/types/ads'

const violationLabels: Record<string, string> = {
  misleading_content: 'Misleading Content',
  prohibited_products: 'Prohibited Products',
  targeting_violation: 'Targeting Violation',
  image_violation: 'Image Violation',
  text_violation: 'Text Violation',
  landing_page_violation: 'Landing Page Violation',
  other: 'Other Violation',
}

const severityColors: Record<string, string> = {
  low: 'bg-yellow-100 text-yellow-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
  critical: 'bg-red-200 text-red-900 font-semibold',
}

interface AdDetailPanelProps {
  campaign: AdCampaign
}

export function AdDetailPanel({ campaign }: AdDetailPanelProps) {
  return (
    <div className="space-y-4">
      {/* Campaign info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">{campaign.name}</CardTitle>
            <StatusBadge status={campaign.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Advertiser</p>
              <p className="font-medium">{campaign.advertiserName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Objective</p>
              <Badge variant="outline" className="capitalize">{campaign.objective.replace('_', ' ')}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Budget</p>
              <div className="flex items-center gap-1 font-medium">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                {formatCurrency(campaign.budget, campaign.currency)}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Schedule</p>
              <p className="text-xs">
                {formatDate(campaign.startDate)}
                {campaign.endDate && ` – ${formatDate(campaign.endDate)}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Creative preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ad Creative</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border p-3 space-y-2">
            <p className="font-medium text-sm">{campaign.creative.title}</p>
            <p className="text-sm text-muted-foreground">{campaign.creative.body}</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">{campaign.creative.callToAction}</Badge>
              <a
                href={campaign.creative.landingPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-facebook-500 hover:underline"
              >
                {campaign.creative.displayUrl ?? campaign.creative.landingPageUrl}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Targeting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Targeting Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Locations</span>
            <span>{campaign.targeting.locations.join(', ') || 'All'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Age Range</span>
            <span>{campaign.targeting.ageMin}–{campaign.targeting.ageMax}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Est. Reach</span>
            <span className="font-medium">
              {campaign.targeting.estimatedReach.toLocaleString()}
            </span>
          </div>
          {campaign.targeting.interests.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-1">Interests</p>
              <div className="flex flex-wrap gap-1">
                {campaign.targeting.interests.map((i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Policy violations */}
      {campaign.policyViolations.length > 0 && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Policy Violations ({campaign.policyViolations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaign.policyViolations.map((v) => (
              <div key={v.id} className="rounded-lg border border-destructive/30 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{violationLabels[v.type] ?? v.type}</span>
                  <span
                    className={`inline-flex rounded px-1.5 py-0.5 text-xs ${severityColors[v.severity] ?? ''}`}
                  >
                    {v.severity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{v.description}</p>
                <p className="text-xs text-facebook-500">Policy: {v.policyReference}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
