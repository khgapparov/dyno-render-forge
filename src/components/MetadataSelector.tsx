import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LayoutEngine, LayoutMetadata } from './engine/LayoutEngine';
import { useTheme } from '@/contexts/ThemeContext';
import { ColorThemePicker } from './ColorThemePicker';
import { Layers, Code, Settings, Play } from 'lucide-react';

// Import metadata configurations
import defaultMetadata from '@/data/metadata.json';
import alternativeMetadata from '@/data/alternativeMetadata.json';
import projectManagementMetadata from '@/data/project-management-metadata.json';
import backendConnectedMetadata from '@/data/backend-connected-metadata.json';

interface MetadataSelectorProps {
  onMetadataChange?: (metadata: LayoutMetadata) => void;
}

/**
 * MetadataSelector - Demonstrates the dynamic nature of the engine
 * Allows switching between different JSON configurations in real-time
 */
export const MetadataSelector = ({ onMetadataChange }: MetadataSelectorProps) => {
  const [selectedMetadata, setSelectedMetadata] = useState<LayoutMetadata>(defaultMetadata as LayoutMetadata);
  const [showMetadataJson, setShowMetadataJson] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { isDarkMode } = useTheme();

  const metadataOptions = [
    { 
      id: 'default', 
      name: 'Full Dashboard', 
      description: 'Complete dashboard with cards, charts, and metrics',
      metadata: defaultMetadata as LayoutMetadata 
    },
    { 
      id: 'alternative', 
      name: 'Minimal Analytics', 
      description: 'Simplified view focused on key analytics',
      metadata: alternativeMetadata as LayoutMetadata 
    },
    { 
      id: 'project-management', 
      name: 'Project Management', 
      description: 'Complete project management system with CRUD operations',
      metadata: projectManagementMetadata as LayoutMetadata 
    },
    { 
      id: 'backend-connected', 
      name: 'Backend Connected', 
      description: 'Real-time project dashboard with backend API integration',
      metadata: backendConnectedMetadata as LayoutMetadata 
    }
  ];

  const handleMetadataChange = (optionId: string) => {
    const option = metadataOptions.find(opt => opt.id === optionId);
    if (option) {
      setSelectedMetadata(option.metadata);
      onMetadataChange?.(option.metadata);
      console.log('[MetadataSelector] Switched to:', option.name);
    }
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-background">
        {/* Preview controls - Professional floating control panel */}
        <div className="fixed top-4 right-4 z-[9999] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePreview}
            >
              <Settings className="w-4 h-4 mr-2" />
              Exit Preview
            </Button>
            <Select value={metadataOptions.find(opt => opt.metadata === selectedMetadata)?.id} onValueChange={handleMetadataChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metadataOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Full layout preview with lower z-index to ensure controls stay on top */}
        <div className="relative z-10">
          <LayoutEngine 
            metadata={selectedMetadata}
            onError={(error) => console.error('[Preview] Layout error:', error)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Hero Image */}
        <div className="relative text-center space-y-6 overflow-hidden rounded-2xl">
          <div 
            className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl"
            style={{
              backgroundImage: 'url(/src/assets/hero-dashboard.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="relative z-10 p-12 space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-gradient-primary rounded-xl shadow-engine-glow">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-engine-text-primary">
                Customizable Front-End Engine
              </h1>
            </div>
            <p className="text-xl text-engine-text-secondary max-w-4xl mx-auto leading-relaxed">
              A production-quality, JSON-driven front-end engine that dynamically renders layouts, 
              components, and data visualizations. Experience the power of metadata-driven architecture 
              with real-time configuration switching and beautiful, responsive design.
            </p>
            <div className="flex items-center justify-center space-x-4 pt-4">
              <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                React + TypeScript
              </div>
              <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Dynamic Components
              </div>
              <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                JSON Metadata
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <Card className="bg-engine-surface border-border shadow-engine-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-primary" />
              Engine Configuration
            </CardTitle>
            <CardDescription>
              Select a metadata configuration to dynamically change the entire application layout
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Color Theme Selection */}
            <div className="mb-6">
              <ColorThemePicker />
            </div>

            {/* Metadata Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Choose Layout Configuration</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metadataOptions.map(option => (
                  <Card 
                    key={option.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-engine-md ${
                      selectedMetadata === option.metadata 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-secondary/50'
                    }`}
                    onClick={() => handleMetadataChange(option.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{option.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {option.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-engine-text-tertiary">
                        Components: {JSON.stringify(option.metadata).match(/"type":/g)?.length || 0}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-3">
                <Switch
                  id="show-json"
                  checked={showMetadataJson}
                  onCheckedChange={setShowMetadataJson}
                />
                <Label htmlFor="show-json" className="text-sm">
                  Show JSON metadata
                </Label>
              </div>
              
              <Button onClick={togglePreview} className="bg-gradient-primary text-white">
                <Play className="w-4 h-4 mr-2" />
                Preview Layout
              </Button>
            </div>

            {/* JSON Display */}
            {showMetadataJson && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  Current Metadata JSON
                </Label>
                <div className="relative">
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-96 border border-border">
                    {JSON.stringify(selectedMetadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Architecture Overview */}
        <Card className="bg-engine-surface border-border shadow-engine-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2 text-primary" />
              Engine Architecture
            </CardTitle>
            <CardDescription>
              How the customizable front-end engine works
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-engine-text-primary">JSON Metadata</h4>
                <p className="text-sm text-engine-text-secondary">
                  Define your entire UI structure, components, and data sources in a single JSON configuration
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-engine-text-primary">Dynamic Rendering</h4>
                <p className="text-sm text-engine-text-secondary">
                  The LayoutEngine component maps JSON to React components and renders them dynamically
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-engine-text-primary">API Integration</h4>
                <p className="text-sm text-engine-text-secondary">
                  DataService automatically fetches data from configured endpoints with caching and error handling
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card className="bg-engine-surface border-border shadow-engine-lg">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              Production-ready features for scalable applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h5 className="font-medium text-engine-text-primary">Core Engine</h5>
                <ul className="space-y-1 text-engine-text-secondary">
                  <li>• Dynamic component rendering</li>
                  <li>• JSON-driven architecture</li>
                  <li>• TypeScript support</li>
                  <li>• Error boundaries and handling</li>
                  <li>• Hot-swappable configurations</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-engine-text-primary">UI & Experience</h5>
                <ul className="space-y-1 text-engine-text-secondary">
                  <li>• Beautiful modern design system</li>
                  <li>• Dark/light theme support</li>
                  <li>• Responsive layout engine</li>
                  <li>• Smooth animations and transitions</li>
                  <li>• Accessibility compliant</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-engine-text-primary">Data & API</h5>
                <ul className="space-y-1 text-engine-text-secondary">
                  <li>• Promise-based data service</li>
                  <li>• Automatic caching system</li>
                  <li>• Mock data for development</li>
                  <li>• Error handling and retries</li>
                  <li>• Real-time data updates</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-engine-text-primary">Components</h5>
                <ul className="space-y-1 text-engine-text-secondary">
                  <li>• Interactive charts (Recharts)</li>
                  <li>• Metric cards and dashboards</li>
                  <li>• Collapsible navigation</li>
                  <li>• Loading states and skeletons</li>
                  <li>• Extensible component library</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
