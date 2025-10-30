import { ScrollArea } from '@/components/ui/scroll-area'
import { AppDetailHeader } from './app-detail-header'
import { AppInfoSection } from './app-info-section'
import { AppMetadataBar } from './app-metadata-bar'
import { AppScreenshots } from './app-screenshots'
import { AppDescription } from './app-description'
import { AppDeveloperInfo } from './app-developer-info'
import { AppReviews } from './app-reviews'
import type { App } from '@/types/explore'

interface AppDetailProps {
  app: App
  onClose: () => void
}

export function AppDetail({ app, onClose }: AppDetailProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header with navigation */}
      <div className="flex-shrink-0">
        <AppDetailHeader onBack={onClose} />
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="bg-gradient-to-b from-white to-[#F5E3DF] pb-8">
          <div className="flex flex-col">
          {/* App Info Section */}
          <AppInfoSection
            name={app.name}
            tagline={app.tagline}
            icon={app.icon}
            gradient={app.gradient}
            inAppPurchases={app.inAppPurchases}
            thirdParty={app.thirdParty}
          />

          {/* Metadata Bar */}
          <AppMetadataBar
            metadata={app.metadata}
            developerName={app.developer.name}
          />

          {/* Screenshots */}
          <AppScreenshots
            screenshots={app.screenshots}
            appName={app.name}
          />

          {/* Description */}
          <AppDescription
            fullDescription={app.fullDescription}
            features={app.features}
            platforms={app.platforms}
          />

          {/* Developer Info */}
          <AppDeveloperInfo developer={app.developer} />

          {/* Ratings & Reviews */}
          <AppReviews metadata={app.metadata} />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
